'use client'

import { useEffect, useState } from 'react'

interface MenuBarProps {
  onLogout: () => void
}

export default function MenuBar({ onLogout }: MenuBarProps) {
  const [time, setTime] = useState('')
  const [showAppleMenu, setShowAppleMenu] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)

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
      if (!target.closest('.apple-menu') && !target.closest('.menu-dropdown')) {
        setShowAppleMenu(false)
        setOpenMenu(null)
      }
    }
    if (showAppleMenu || openMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showAppleMenu, openMenu])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAppleMenu(false)
        setOpenMenu(null)
      }
    }
    if (showAppleMenu || openMenu) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [showAppleMenu, openMenu])

  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName)
  }

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
      <div className="menu-item" style={{ position: 'relative' }}>
        <div
          onClick={() => toggleMenu('dateien')}
          style={{ cursor: 'pointer' }}
          className={openMenu === 'dateien' ? 'active' : ''}
        >
          {'Dateien'.split('').map((char: string, index: number) => (
            <span key={index} className={index === 0 ? 'menu-item-first' : ''}>
              {char}
            </span>
          ))}
        </div>
        {openMenu === 'dateien' && (
          <div className="menu-dropdown" style={{
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
          }}>
            {['Neues Fenster', 'Neuer Ordner', 'Öffnen', 'Schließen', 'Speichern', 'Beenden'].map((item) => (
              <div
                key={item}
                className="menu-item"
                style={{
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '6px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--glass)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="menu-item" style={{ position: 'relative' }}>
        <div
          onClick={() => toggleMenu('file')}
          style={{ cursor: 'pointer' }}
          className={openMenu === 'file' ? 'active' : ''}
        >
          {'File'.split('').map((char: string, index: number) => (
            <span key={index} className={index === 0 ? 'menu-item-first' : ''}>
              {char}
            </span>
          ))}
        </div>
        {openMenu === 'file' && (
          <div className="menu-dropdown" style={{
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
          }}>
            {['New', 'Open', 'Open Recent', 'Close', 'Save', 'Save As…'].map((item) => (
              <div
                key={item}
                className="menu-item"
                style={{
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '6px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--glass)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="menu-item" style={{ position: 'relative' }}>
        <div
          onClick={() => toggleMenu('edit')}
          style={{ cursor: 'pointer' }}
          className={openMenu === 'edit' ? 'active' : ''}
        >
          {'Edit'.split('').map((char: string, index: number) => (
            <span key={index} className={index === 0 ? 'menu-item-first' : ''}>
              {char}
            </span>
          ))}
        </div>
        {openMenu === 'edit' && (
          <div className="menu-dropdown" style={{
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
          }}>
            {['Undo', 'Redo', 'Cut', 'Copy', 'Paste', 'Select All'].map((item) => (
              <div
                key={item}
                className="menu-item"
                style={{
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '6px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--glass)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="menu-item" style={{ position: 'relative' }}>
        <div
          onClick={() => toggleMenu('view')}
          style={{ cursor: 'pointer' }}
          className={openMenu === 'view' ? 'active' : ''}
        >
          {'View'.split('').map((char: string, index: number) => (
            <span key={index} className={index === 0 ? 'menu-item-first' : ''}>
              {char}
            </span>
          ))}
        </div>
        {openMenu === 'view' && (
          <div className="menu-dropdown" style={{
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
          }}>
            {['Show Sidebar', 'Hide Toolbar', 'Show Status Bar', 'Zoom In', 'Zoom Out', 'Actual Size'].map((item) => (
              <div
                key={item}
                className="menu-item"
                style={{
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '6px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--glass)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="menu-item" style={{ position: 'relative' }}>
        <div
          onClick={() => toggleMenu('window')}
          style={{ cursor: 'pointer' }}
          className={openMenu === 'window' ? 'active' : ''}
        >
          {'Window'.split('').map((char: string, index: number) => (
            <span key={index} className={index === 0 ? 'menu-item-first' : ''}>
              {char}
            </span>
          ))}
        </div>
        {openMenu === 'window' && (
          <div className="menu-dropdown" style={{
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
          }}>
            {['Minimize', 'Zoom', 'Bring All to Front', 'Tile Left', 'Tile Right', 'Cascade Windows'].map((item) => (
              <div
                key={item}
                className="menu-item"
                style={{
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '6px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--glass)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="menu-item" style={{ position: 'relative' }}>
        <div
          onClick={() => toggleMenu('help')}
          style={{ cursor: 'pointer' }}
          className={openMenu === 'help' ? 'active' : ''}
        >
          {'Help'.split('').map((char: string, index: number) => (
            <span key={index} className={index === 0 ? 'menu-item-first' : ''}>
              {char}
            </span>
          ))}
        </div>
        {openMenu === 'help' && (
          <div className="menu-dropdown" style={{
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
          }}>
            {['Help Center', 'Keyboard Shortcuts', 'User Guide', 'Report Issue', 'About', 'Check for Updates'].map((item) => (
              <div
                key={item}
                className="menu-item"
                style={{
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '6px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--glass)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="menubar-clock" style={{ marginLeft: 'auto' }}>{time}</div>
    </div>
  )
}
