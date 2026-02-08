'use client'

import { useEffect, useState } from 'react'

interface MenuBarProps {
  onLogout: () => void
}

export default function MenuBar({ onLogout }: MenuBarProps) {
  const [time, setTime] = useState('')
  const [showAppleMenu, setShowAppleMenu] = useState(false)

  useEffect(() => {
    const formatTime = () => {
      const now = new Date()
      return now.toLocaleString(undefined, { 
        weekday: 'short', 
        day: '2-digit', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
    setTime(formatTime())
    const interval = setInterval(() => setTime(formatTime()), 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.apple-menu')) {
        setShowAppleMenu(false)
      }
    }
    if (showAppleMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showAppleMenu])

  return (
    <div className="menubar">
      <div 
        className="apple-menu"
        style={{ position: 'relative' }}
      >
        <div 
          className="apple"
          onClick={() => setShowAppleMenu(!showAppleMenu)}
          style={{ cursor: 'pointer' }}
        >
          ⌘
        </div>
        {showAppleMenu && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '4px',
              background: 'rgba(30, 31, 36, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '4px',
              minWidth: '200px',
              boxShadow: 'var(--shadow)',
              zIndex: 10000,
            }}
          >
            <div
              className="menu-item"
              style={{
                cursor: 'default',
                padding: '8px 12px',
                borderRadius: '6px',
                color: 'var(--muted)',
                fontSize: '12px',
              }}
            >
              Über diesen Mac
            </div>
            <div
              style={{
                height: '1px',
                background: 'var(--border)',
                margin: '4px 0',
              }}
            />
            <div
              className="menu-item"
              onClick={() => {
                setShowAppleMenu(false)
                onLogout()
              }}
              style={{
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '6px',
              }}
            >
              Abmelden…
            </div>
            <div
              className="menu-item"
              style={{
                cursor: 'default',
                padding: '8px 12px',
                borderRadius: '6px',
                color: 'var(--muted)',
                fontSize: '12px',
              }}
            >
              Neustart…
            </div>
          </div>
        )}
      </div>
      <div className="menu-item active">
        {'Dateien'.split('').map((char: string, index: number) => (
          <span key={index} className={index === 0 ? 'menu-item-first' : ''}>
            {char}
          </span>
        ))}
      </div>
      <div className="menu-item">
        {'File'.split('').map((char: string, index: number) => (
          <span key={index} className={index === 0 ? 'menu-item-first' : ''}>
            {char}
          </span>
        ))}
      </div>
      <div className="menu-item">
        {'Edit'.split('').map((char: string, index: number) => (
          <span key={index} className={index === 0 ? 'menu-item-first' : ''}>
            {char}
          </span>
        ))}
      </div>
      <div className="menu-item">
        {'View'.split('').map((char: string, index: number) => (
          <span key={index} className={index === 0 ? 'menu-item-first' : ''}>
            {char}
          </span>
        ))}
      </div>
      <div className="menu-item">
        {'Window'.split('').map((char: string, index: number) => (
          <span key={index} className={index === 0 ? 'menu-item-first' : ''}>
            {char}
          </span>
        ))}
      </div>
      <div className="menu-item">
        {'Help'.split('').map((char: string, index: number) => (
          <span key={index} className={index === 0 ? 'menu-item-first' : ''}>
            {char}
          </span>
        ))}
      </div>
      <div className="menubar-clock" style={{ marginLeft: 'auto' }}>{time}</div>
    </div>
  )
}
