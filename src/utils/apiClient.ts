// src/utils/apiClient_safe.ts

export async function callChatAPI(messages: any) {
  // 🚫 Prevent SSR from calling API
  if (typeof window === "undefined") {
    return { reply: "" }
  }

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    })

    return await res.json()
  } catch (e) {
    console.error("API error:", e)
    return { reply: "" }
  }
}
