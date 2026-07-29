// LoginScreen.tsx
//
// Shown to anyone who isn't logged in.
// User enters their email, clicks "Send me a login link", and receives
// a magic link email from Supabase. One click in that email logs them in
// with no password needed.
//
// If someone tries to access without having purchased, the magic link
// email simply won't send (their email isn't in the system).

import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

const PINK = '#c9485b'
const BABY = 'rgba(201,72,91,0.1)'
const INK = '#2b2320'
const INK_SOFT = '#3a312c'
const MUTE = '#6f6863'
const LINE = '#e4dedb'
const SERIF = "'Cormorant Garamond', Georgia, serif"
const SANS = "'DM Sans', -apple-system, sans-serif"
const SCRIPT = "'Pinyon Script', cursive"

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const send = async () => {
    if (!email.trim()) return
    setLoading(true)
    setError('')

    const appUrl = window.location.origin

    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: appUrl }
    })

    setLoading(false)
    if (err) {
      // Don't reveal whether the email exists — just show a generic message
      // This prevents someone from checking whether an email has an account
      console.error('[Login] Magic link error:', err.message)
      setError("Something went wrong. Please try again or contact support.")
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div style={{ minHeight: '100dvh', background: '#FFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center', fontFamily: SANS }}>
        <div style={{ fontFamily: SCRIPT, color: PINK, fontSize: 28, marginBottom: 12 }}>Love Coylah</div>
        <h2 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 400, color: INK, margin: '0 0 12px' }}>Check your email</h2>
        <p style={{ fontSize: 14, color: INK_SOFT, lineHeight: 1.6, maxWidth: 300, margin: '0 0 8px' }}>
          We've sent a login link to <strong>{email}</strong>
        </p>
        <p style={{ fontSize: 13, color: MUTE, lineHeight: 1.5, maxWidth: 300 }}>
          Click the link in that email and you'll be straight into your Pocket Collagen Coach. No password needed.
        </p>
        <button
          onClick={() => { setSent(false); setEmail('') }}
          style={{ marginTop: 24, background: 'none', border: 'none', color: MUTE, fontSize: 12, textDecoration: 'underline', cursor: 'pointer', fontFamily: SANS }}
        >
          Use a different email
        </button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#FFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', fontFamily: SANS }}>
      <div style={{ width: '100%', maxWidth: 340 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: SCRIPT, color: PINK, fontSize: 28, marginBottom: 6 }}>Love Coylah</div>
          <h1 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 400, color: INK, margin: '0 0 6px' }}>Pocket Collagen Coach</h1>
          <p style={{ fontSize: 13, color: MUTE, margin: 0 }}>Enter your email to access your coach</p>
        </div>

        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="your@email.com"
          style={{
            width: '100%', padding: '14px 16px', borderRadius: 12,
            border: `1.5px solid ${LINE}`, fontSize: 15, outline: 'none',
            fontFamily: SANS, color: INK, marginBottom: 12,
            boxSizing: 'border-box',
          }}
        />

        {error && (
          <p style={{ fontSize: 12, color: '#c0392b', margin: '0 0 10px', lineHeight: 1.4 }}>{error}</p>
        )}

        <button
          onClick={send}
          disabled={loading || !email.trim()}
          style={{
            width: '100%', background: loading || !email.trim() ? '#D8D2CE' : PINK,
            color: '#FFF', border: 'none', borderRadius: 50, padding: '15px',
            fontSize: 14, fontWeight: 600, cursor: loading || !email.trim() ? 'not-allowed' : 'pointer',
            fontFamily: SANS, boxShadow: email.trim() && !loading ? '0 4px 14px rgba(201,72,91,0.3)' : 'none',
          }}
        >
          {loading ? 'Sending…' : 'Send me a login link →'}
        </button>

        <p style={{ fontSize: 11, color: MUTE, textAlign: 'center', marginTop: 20, lineHeight: 1.5 }}>
          Access is for Pocket Collagen Coach subscribers only.{' '}
          <a href="https://lovecoylah.com" style={{ color: PINK }}>Get access here.</a>
        </p>
      </div>
    </div>
  )
}
