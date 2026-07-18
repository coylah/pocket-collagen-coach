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
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
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
