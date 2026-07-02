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

        const contents = inMsgs.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: toGeminiParts(m.content),
        }))

        const model = 'gemini-2.5-flash'
        const upstream = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
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
          const status = upstream.status
          const text = await upstream.text().catch(() => '')
          console.error('Gemini API error', status, text)
          if (status === 429) {
            return Response.json({ reply: 'Rate limit reached — try again in a moment.' }, { status: 429 })
          }
          if (status === 401 || status === 403) {
            return Response.json({ reply: 'AI authentication failed. Check GEMINI_API_KEY.' }, { status })
          }
          return Response.json({ reply: 'AI service error. Please try again.' }, { status: 502 })
        }

        const data = (await upstream.json()) as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
        }
        const reply =
          data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ||
          'No response.'
        return Response.json({ reply })
      },
    },
  },
})