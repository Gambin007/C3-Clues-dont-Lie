'use client'

interface GoalOverlayProps {
  onContinue: () => void
}

export default function GoalOverlay({ onContinue }: GoalOverlayProps) {
  return (
    <div
      className="goal-overlay"
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
        padding: '20px',
      }}
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
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            margin: '0 0 24px 0',
            fontSize: '32px',
            fontWeight: 700,
            color: 'var(--text)',
          }}
        >
          Ziel
        </h1>
        <p
          style={{
            margin: '0 0 32px 0',
            fontSize: '16px',
            lineHeight: 1.7,
            color: 'var(--muted)',
          }}
        >
          Lisa war Journalistin.<br />
          Irgendetwas an ihrem letzten Tag wirkt nicht stimmig.<br />
          Euer Ziel: das ARCHIV freizuschalten.<br />
          Hinweise sind über Apps verteilt – und nur in der richtigen Reihenfolge sinnvoll.
        </p>
        <button
          className="btn"
          onClick={onContinue}
          style={{
            padding: '12px 32px',
            fontSize: '16px',
            fontWeight: 600,
          }}
        >
          Weiter
        </button>
      </div>
    </div>
  )
}
