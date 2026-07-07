// src/components/AuthGate.tsx

import React, { useEffect, useState } from "react"
import { initToken } from "../../utils/useAuthToken"

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const t = initToken()
    setToken(t)
  }, [])

  // Prevent SSR crash
  if (!isClient) return null

  if (!token) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>Access Required</h2>
        <p>Please use your secure access link.</p>
      </div>
    )
  }

  return <>{children}</>
}
