'use client'

export default function BelaPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <iframe
        src="/bela/index.html"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        allow="autoplay; fullscreen"
      />
    </div>
  )
}
