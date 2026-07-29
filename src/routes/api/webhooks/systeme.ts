// api/webhooks/systeme.ts
//
// Receives purchase and cancellation events from Systeme.io.
// When someone buys: creates a Supabase account and sends them a magic link.
// When someone cancels: disables their Supabase account so they lose access.
//
// SETUP IN SYSTEME.IO (Evita):
// Settings → Webhooks → Create
// URL: https://YOUR-APP-URL/api/webhooks/systeme
// Secret: copy from SYSTEME_WEBHOOK_SECRET environment variable in Lovable
// Events: "New sale" + "Sale canceled"

import { createFileRoute } from '@tanstack/react-router'
import { createClient } from '@supabase/supabase-js'

export const Route = createFileRoute('/api/webhooks/systeme')({
  component: () => null,
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const SUPABASE_URL = process.env.SUPABASE_URL!
        const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
        const WEBHOOK_SECRET = process.env.SYSTEME_WEBHOOK_SECRET!

        // 1. Verify the request is genuinely from Systeme.io
        const secret = new URL(request.url).searchParams.get('secret')
          || request.headers.get('x-systeme-secret')
        if (!WEBHOOK_SECRET || secret !== WEBHOOK_SECRET) {
          console.error('[Webhook] Invalid secret — rejected')
          return new Response('Unauthorized', { status: 401 })
        }

        // 2. Parse the event
        let body: any
        try {
          body = await request.json()
        } catch {
          return new Response('Bad request', { status: 400 })
        }

        const event = body.event
        const email = body.contact?.email || body.email
        if (!email) {
          console.error('[Webhook] No email in payload:', JSON.stringify(body))
          return new Response('No email', { status: 400 })
        }

        // Service role client — admin powers, server-side only, never sent to browser
        const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
          auth: { autoRefreshToken: false, persistSession: false }
        })

        if (event === 'new_sale' || event === 'contact.sale.created') {
          // 3a. Purchase — create user and send magic link
          console.log(`[Webhook] New sale for ${email}`)

          // Check if user already exists (e.g. re-subscribing)
          const { data: list } = await admin.auth.admin.listUsers()
          const existing = list?.users?.find((u: any) => u.email === email)

          if (existing) {
            // Re-enable previously banned user
            await admin.auth.admin.updateUserById(existing.id, { ban_duration: 'none' })
            console.log(`[Webhook] Re-enabled ${email}`)
          } else {
            // Create brand new user
            const { error } = await admin.auth.admin.createUser({
              email,
              email_confirm: true,
            })
            if (error) {
              console.error(`[Webhook] Failed to create ${email}:`, error.message)
              return new Response('Error', { status: 500 })
            }
            console.log(`[Webhook] Created ${email}`)
          }

          // Send magic link email
          const appUrl = process.env.PUBLIC_APP_URL || 'https://your-app.lovable.app'
          const { error: linkError } = await admin.auth.admin.generateLink({
            type: 'magiclink',
            email,
            options: { redirectTo: appUrl }
          })
          if (linkError) {
            console.error(`[Webhook] Magic link failed for ${email}:`, linkError.message)
            // User was created — they can request a new link from the login screen
          }

        } else if (event === 'sale_canceled' || event === 'contact.sale.refunded') {
          // 3b. Cancellation — ban the user
          console.log(`[Webhook] Cancellation for ${email}`)
          const { data: list } = await admin.auth.admin.listUsers()
          const existing = list?.users?.find((u: any) => u.email === email)
          if (existing) {
            await admin.auth.admin.updateUserById(existing.id, {
              ban_duration: '87600h' // 10 years = effectively permanent until re-subscribe
            })
            console.log(`[Webhook] Banned ${email}`)
          }
        } else {
          console.log(`[Webhook] Ignoring event: ${event}`)
        }

        // Always return 200 so Systeme.io doesn't keep retrying
        return new Response('OK', { status: 200 })
      }
    }
  }
})
