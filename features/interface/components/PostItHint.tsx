'use client'

import { useState } from 'react'

export default function PostItHint() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="post-it-hint"
      onClick={() => setExpanded(!expanded)}
      style={{
        position: 'fixed',
        top: expanded ? '50%' : '20px',
        right: expanded ? '50%' : '20px',
        transform: expanded ? 'translate(50%, -50%) rotate(0deg)' : 'translate(0, 0) rotate(-5deg)',
        width: expanded ? '400px' : '180px',
        height: expanded ? 'auto' : '180px',
        background: '#ffeb3b',
        padding: expanded ? '24px' : '16px',
        borderRadius: '4px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        zIndex: 10000,
        userSelect: 'none',
        fontFamily: 'ui-sans-serif, system-ui, -apple-system',
        color: '#333',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: expanded ? '20px' : '16px',
          fontWeight: expanded ? 600 : 500,
          lineHeight: 1.5,
          fontStyle: 'italic',
          color: '#333',
        }}
      >
        Ich zuerst.<br />Immer von links nach rechts.<br />Nur Zahlen.
      </div>
      {expanded && (
        <div
          style={{
            marginTop: '12px',
            fontSize: '12px',
            color: '#666',
            fontStyle: 'normal',
          }}
        >
          Klicken zum Schließen
        </div>
      )}
    </div>
  )
}
