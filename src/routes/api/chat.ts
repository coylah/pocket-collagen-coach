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

const NO_MARKDOWN = `

CRITICAL FORMATTING RULE — YOU MUST FOLLOW THIS:
Never use markdown formatting of any kind in your responses.
No asterisks for bold or italic. No ** or *.
No # headers.
No bullet points using * or -.
No numbered lists unless absolutely necessary, and if so use plain numbers only.
Write in plain, flowing, conversational British English.
Short paragraphs. Natural line breaks. No symbols whatsoever.
Write the way a knowledgeable friend texts — warm, direct, easy to read on a phone screen.`

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

        const system = (typeof body.system === 'string' ? body.system : '') + NO_MARKDOWN
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
              systemInstruction: { parts: [{ text: system }] },
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,
              },
            }),
          },
        )

        if (!upstream.ok) {
          const status = upstream.status
          const text = await upstream.text().catch(() => '')
          console.error('Gemini API error', status, text)
          if (status === 429) {
            return Response.json({ reply: 'Too many requests — give it a moment and try again.' }, { status: 429 })
          }
          if (status === 401 || status === 403) {
            return Response.json({ reply: 'AI authentication failed. Check your API key.' }, { status })
          }
          return Response.json({ reply: 'Something went wrong. Please try again.' }, { status: 502 })
        }

        const data = (await upstream.json()) as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
        }

        const reply =
          data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ||
          'No response received.'

        return Response.json({ reply })
      },
    },
  },
})
