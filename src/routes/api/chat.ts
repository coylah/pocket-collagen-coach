// api/chat.ts (SAFE VERSION - prevents SSR crash)

import { createFileRoute } from '@tanstack/react-router'

type InBlock =
  | { type: 'text'; text: string }
  | { type: 'image'; source: { type: 'base64'; media_type: string; data: string } }

type InMsg = { role: 'user' | 'assistant'; content: string | InBlock[] }

function toGeminiParts(content: string | InBlock[]) {
  if (typeof content === 'string') return [{ text: content }]
  return content.map((b) => {
    if (b.type === 'text') return { text: b.text }
    return {
      inlineData: { mimeType: b.source.media_type, data: b.source.data },
    }
  })
}

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {

        // Auth check — verify the user has a valid Supabase session token.
        // The client sends the session access_token in the Authorization header.
        const authHeader = request.headers.get('authorization')
        const token = authHeader?.replace('Bearer ', '')
        if (!token) {
          return Response.json({ reply: 'Access denied' }, { status: 401 })
        }

        const SUPABASE_URL = process.env.SUPABASE_URL
        const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY
        if (SUPABASE_URL && SUPABASE_KEY) {
          const { createClient } = await import('@supabase/supabase-js')
          const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
            auth: { autoRefreshToken: false, persistSession: false }
          })
          const { data, error } = await supabase.auth.getUser(token)
          if (error || !data?.user) {
            return Response.json({ reply: 'Access denied' }, { status: 401 })
          }
        }

        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
          return Response.json({ reply: 'AI not configured' })
        }

        let body: { system?: string; messages?: InMsg[] }

        try {
          body = await request.json()
        } catch {
          return Response.json({ reply: '' })
        }

        const system = typeof body.system === 'string' ? body.system : ''
        const inMsgs = Array.isArray(body.messages) ? body.messages : []

        const contents = inMsgs.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: toGeminiParts(m.content),
        }))

        const upstream = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey,
            },
            body: JSON.stringify({
              contents,
              ...(system
                ? { systemInstruction: { parts: [{ text: system }] } }
                : {}),
            }),
          },
        )

        if (!upstream.ok) {
          const errText = await upstream.text().catch(() => '')
          console.error('Gemini upstream error', upstream.status, errText)
          return Response.json({ reply: '' })
        }

        const data = await upstream.json()

        const reply =
          data?.candidates?.[0]?.content?.parts
            ?.map((p: any) => p.text ?? '')
            .join('') || ''

        return Response.json({ reply })
      },
    },
  },
})
