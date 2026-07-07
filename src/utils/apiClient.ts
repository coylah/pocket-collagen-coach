import { getStoredToken } from "./useAuthToken"

export async function callChatAPI(messages: any) {
  const token = getStoredToken()

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ messages }),
  })

  return res.json()
}
