'use client'

import { useState, useEffect } from 'react'
import { usePuzzle } from '@interface/contexts/PuzzleContext'

interface SpotlightProps {
  isOpen: boolean
  onClose: () => void
}

export default function Spotlight({ isOpen, onClose }: SpotlightProps) {
  const { unlockVault, vaultUnlocked } = usePuzzle()
  const [query, setQuery] = useState('')
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      return
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ' ') {
        e.preventDefault()
        // Toggle handled by parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const normalizedQuery = query.trim().toLowerCase()
    
    if ((normalizedQuery === 'vault' || normalizedQuery === 'unlock vault') && !vaultUnlocked) {
      unlockVault()
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
        onClose()
      }, 2000)
    } else {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="spotlight-overlay"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 10002,
        }}
      />
      <div
        className="spotlight-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(30, 31, 36, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '0',
          width: '90%',
          maxWidth: '600px',
          boxShadow: 'var(--shadow)',
          zIndex: 10003,
        }}
      >
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Spotlight suchen..."
            autoFocus
            style={{
              width: '100%',
              padding: '16px 20px',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text)',
              fontSize: '16px',
            }}
          />
        </form>
      </div>
      {showToast && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(30, 31, 36, 0.95)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '16px 24px',
            color: 'var(--text)',
            fontSize: '14px',
            zIndex: 10004,
            boxShadow: 'var(--shadow)',
          }}
        >
          Freigeschaltet.
        </div>
      )}
    </>
  )
}
