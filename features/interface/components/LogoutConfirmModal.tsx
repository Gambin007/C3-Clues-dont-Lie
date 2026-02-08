'use client'

interface LogoutConfirmModalProps {
  onConfirm: () => void
  onCancel: () => void
}

export default function LogoutConfirmModal({ onConfirm, onCancel }: LogoutConfirmModalProps) {
  return (
    <div
      className="logout-modal-overlay"
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10001,
      }}
    >
      <div
        className="logout-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(30, 31, 36, 0.95)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '24px',
          maxWidth: '400px',
          width: '90%',
          boxShadow: 'var(--shadow)',
        }}
      >
        <h2
          style={{
            margin: '0 0 16px 0',
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--text)',
          }}
        >
          Abmelden?
        </h2>
        <p
          style={{
            margin: '0 0 24px 0',
            fontSize: '14px',
            color: 'var(--muted)',
            lineHeight: 1.5,
          }}
        >
          Möchtest du dich wirklich abmelden?
        </p>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
          }}
        >
          <button
            className="btn"
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
            }}
          >
            Abbrechen
          </button>
          <button
            className="btn"
            onClick={onConfirm}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              background: '#ef4444',
              borderColor: '#ef4444',
              color: '#fff',
            }}
          >
            Abmelden
          </button>
        </div>
      </div>
    </div>
  )
}
