'use client'

import { useState, useRef, useEffect } from 'react'
import PostItHint from './PostItHint'

interface LoginScreenProps {
  onLogin: () => void
}

const CORRECT_PIN = '129191' // L=12, I=9, S=19, A=1 -> "129191"

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Nur Zahlen erlauben
    if (value === '' || /^\d+$/.test(value)) {
      setPin(value.slice(0, 6)) // Max 6 Stellen
      setError('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pin === CORRECT_PIN) {
      onLogin()
    } else {
      setError('Falsches Passwort.')
      setPin('')
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && pin.length === 6) {
      handleSubmit(e)
    }
  }

  return (
    <>
      <PostItHint />
      <div
        className="login-screen"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: "url('/macwallpaper.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        <div
          className="login-card"
          style={{
            background: 'rgba(30, 31, 36, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '50px 60px',
            width: '100%',
            maxWidth: '420px',
            boxShadow: 'var(--shadow)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #9333ea)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
              border: '3px solid var(--border)',
            }}
          >
            👤
          </div>

          <div
            style={{
              fontSize: '28px',
              fontWeight: 600,
              color: 'var(--text)',
            }}
          >
            Lisa
          </div>

          <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label
                htmlFor="pin-input"
                style={{
                  fontSize: '14px',
                  color: 'var(--muted)',
                  fontWeight: 500,
                }}
              >
                Passwort
              </label>
              <input
                ref={inputRef}
                id="pin-input"
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={handlePinChange}
                onKeyDown={handleKeyDown}
                placeholder="******"
                autoComplete="off"
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '24px',
                  letterSpacing: '12px',
                  textAlign: 'center',
                  background: '#1e1f24',
                  border: error ? '2px solid #ef4444' : '2px solid var(--border)',
                  borderRadius: '10px',
                  color: 'var(--text)',
                  fontFamily: 'ui-monospace, monospace',
                  outline: 'none',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                }}
              />
              {error && (
                <div
                  style={{
                    fontSize: '13px',
                    color: '#ef4444',
                    textAlign: 'center',
                    marginTop: '-8px',
                  }}
                >
                  {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn"
              disabled={pin.length !== 6}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: 600,
                marginTop: '8px',
                opacity: pin.length === 6 ? 1 : 0.5,
                cursor: pin.length === 6 ? 'pointer' : 'not-allowed',
              }}
            >
              Anmelden
            </button>
          </form>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--muted)',
              fontSize: '13px',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '4px',
            }}
          >
            Passwort vergessen?
          </button>
        </div>
      </div>
    </>
  )
}
