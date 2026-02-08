'use client'

import { useState, useRef, useEffect } from 'react'
import { usePuzzle } from '@interface/contexts/PuzzleContext'

interface ArchiveLockOverlayProps {
  onClose: () => void
}

export default function ArchiveLockOverlay({ onClose }: ArchiveLockOverlayProps) {
  const { unlockArchive } = usePuzzle()
  const [codeword, setCodeword] = useState('')
  const [error, setError] = useState('')
  const [showArchiveSuccess, setShowArchiveSuccess] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Auto-focus input when overlay opens
    if (inputRef.current && !showArchiveSuccess) {
      inputRef.current.focus()
    }
  }, [showArchiveSuccess])


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedCodeword = codeword.trim().toUpperCase()
    
    if (trimmedCodeword === 'ZEITSPRUNG') {
      unlockArchive()
      setError('')
      // Show success overlay
      setShowArchiveSuccess(true)
    } else {
      setError('Falsches Codewort.')
    }
  }

  const handleSuccessClose = () => {
    setShowArchiveSuccess(false)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  // Success Overlay
  if (showArchiveSuccess) {
    return (
      <div 
        className="intro-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10001,
          cursor: 'pointer',
          padding: '20px',
        }}
        onClick={handleSuccessClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'rgba(30, 31, 36, 0.95)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '40px 50px',
            maxWidth: '500px',
            boxShadow: 'var(--shadow)',
            cursor: 'default',
            textAlign: 'center',
            transform: 'scale(1)',
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            animation: 'fadeInScale 0.3s ease',
          }}
        >
          <h2
            style={{
              margin: '0 0 20px 0',
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--text)',
            }}
          >
            ARCHIV entsperrt
          </h2>
          <p
            style={{
              margin: '0 0 24px 0',
              fontSize: '15px',
              lineHeight: 1.7,
              color: 'var(--muted)',
            }}
          >
            Gut.<br />
            Jetzt ist es sichtbar.<br />
            Und jetzt wird's unangenehm.
          </p>
          <div
            style={{
              fontSize: '13px',
              color: 'var(--muted)',
              marginBottom: '24px',
              opacity: 0.8,
            }}
          >
            Öffne das ARCHIV in Dateien.
          </div>
          <button
            className="btn"
            onClick={handleSuccessClose}
            style={{
              padding: '10px 28px',
              fontSize: '15px',
              fontWeight: 600,
            }}
          >
            OK
          </button>
        </div>
      </div>
    )
  }

  // Lock Overlay (original)
  return (
    <div 
      className="intro-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        cursor: 'pointer',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(30, 31, 36, 0.95)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '50px 60px',
          maxWidth: '650px',
          boxShadow: 'var(--shadow)',
          cursor: 'default',
          textAlign: 'center',
        }}
      >      
        <p
          style={{
            margin: '0 0 32px 0',
            fontSize: '16px',
            lineHeight: 1.7,
            color: 'var(--muted)',
          }}
        >
          Du hast den ersten Teil erfolgreich entschlüsselt.<br />
          <br />
          Nicht alles hier ist so, wie es scheint.<br />
          Nimm dir Zeit.<br />
          Sieh genau hin.<br />
          <br />
          Dateien enthält Fragmente –<br />
          einige davon widersprechen sich.<br />
          <br />
          <strong style={{ color: 'var(--text)' }}>Wenn die Zeit lügt: Was bleibt als einziges sicher?
          </strong>
        </p>
        
        <form onSubmit={handleSubmit} style={{ marginTop: '32px' }}>
            <input
              ref={inputRef}
              type="text"
              value={codeword}
              onChange={(e) => {
                setCodeword(e.target.value)
                setError('') // Clear error on input change
              }}
              onKeyDown={handleKeyDown}
              placeholder="Codewort eingeben…"
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: error 
                  ? '1px solid rgba(239, 68, 68, 0.3)' 
                  : '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text)',
                marginBottom: error ? '8px' : '16px',
                outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = error 
                  ? 'rgba(239, 68, 68, 0.3)' 
                  : 'var(--border)'
              }}
            />
            
            {error && (
              <div
                style={{
                  fontSize: '13px',
                  color: 'rgba(239, 68, 68, 0.8)',
                  marginBottom: '16px',
                  textAlign: 'left',
                }}
              >
                {error}
              </div>
            )}
            
            <button
              type="submit"
              className="btn"
              style={{
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: 600,
              }}
            >
              Entsperren
            </button>
          </form>
      </div>
    </div>
  )
}
