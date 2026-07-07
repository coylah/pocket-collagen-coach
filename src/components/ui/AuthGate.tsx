import React, { useEffect, useState } from "react"
import { initToken } from "../utils/useAuthToken"

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const t = initToken()
    setToken(t)
  }, [])

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
