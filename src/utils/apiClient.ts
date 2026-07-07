// src/utils/apiClient_safe.ts

import { getStoredToken } from "./useAuthToken"

export async function callChatAPI(messages: any) {
  // 🚫 Prevent SSR from calling API
  if (typeof window === "undefined") {
    return { reply: "" }
  }

  const token = getStoredToken()

  // 🚫 No token = do not call API
  if (!token) {
    return { reply: "" }
  }

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ messages }),
    })

    return await res.json()
  } catch (e) {
    console.error("API error:", e)
    return { reply: "" }
  }
}
