'use client'

interface IntroOverlayProps {
  onContinue: () => void
}

export default function IntroOverlay({ onContinue }: IntroOverlayProps) {
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
      onClick={onContinue}
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
        <h1
          style={{
            margin: '0 0 24px 0',
            fontSize: '32px',
            fontWeight: 700,
            color: 'var(--text)',
          }}
        >
          Lisas Laptop
        </h1>
        <p
          style={{
            margin: '0 0 32px 0',
            fontSize: '16px',
            lineHeight: 1.7,
            color: 'var(--muted)',
          }}
        >
          Bela und Tim haben den Laptop von Lisas Mutter erhalten.<br />
          Sie kennt das Passwort nicht – aber Lisa hat Hinweise oft logisch hinterlassen.<br />
          Beobachte genau: Der erste Hinweis ist schon da.
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
