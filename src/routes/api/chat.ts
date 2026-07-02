import { createFileRoute } from '@tanstack/react-router'

type InBlock =
  | { type: 'text'; text: string }
  | { type: 'image'; source: { type: 'base64'; media_type: string; data: string } }

type InMsg = { role: 'user' | 'assistant'; content: string | InBlock[] }

function toGatewayContent(content: string | InBlock[]) {
  if (typeof content === 'string') return content
  return content.map((b) => {
    if (b.type === 'text') return { type: 'text', text: b.text }
    return {
      type: 'image_url',
      image_url: { url: `data:${b.source.media_type};base64,${b.source.data}` },
    }
  })
}

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.LOVABLE_API_KEY
        if (!apiKey) {
          return Response.json({ reply: 'AI is not configured.' }, { status: 500 })
        }
        let body: { system?: string; messages?: InMsg[] }
        try {
          body = await request.json()
        } catch {
          return Response.json({ reply: 'Invalid request.' }, { status: 400 })
        }
        const system = typeof body.system === 'string' ? body.system : ''
        const inMsgs = Array.isArray(body.messages) ? body.messages : []

        const messages = [
          ...(system ? [{ role: 'system' as const, content: system }] : []),
          ...inMsgs.map((m) => ({ role: m.role, content: toGatewayContent(m.content) })),
        ]

        const upstream = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages,
          }),
        })

        if (!upstream.ok) {
          const status = upstream.status
          const text = await upstream.text().catch(() => '')
          console.error('AI gateway error', status, text)
          if (status === 429) {
            return Response.json({ reply: 'Rate limit reached — try again in a moment.' }, { status: 429 })
          }
          if (status === 402) {
            return Response.json({ reply: 'AI credits exhausted. Please add credits in the workspace.' }, { status: 402 })
          }
          return Response.json({ reply: 'AI service error. Please try again.' }, { status: 502 })
        }

        const data = (await upstream.json()) as {
          choices?: Array<{ message?: { content?: string } }>
        }
        const reply = data.choices?.[0]?.message?.content ?? 'No response.'
        return Response.json({ reply })
      },
    },
  },
})