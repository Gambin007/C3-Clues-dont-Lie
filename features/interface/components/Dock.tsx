'use client'

import { useWindows } from '@interface/contexts/WindowContext'

const DOCK_APPS = [
  { id: 'notes', icon: '📝', title: 'Notizen' },
  { id: 'calendar', icon: '📅', title: 'Calendar' },
  { id: 'calculator', icon: '🧮', title: 'Calculator' },
  { id: 'contacts', icon: '👥', title: 'Kontakte' },
  { id: 'terminal', icon: '💻', title: 'Terminal' },
  { id: 'dateien', icon: '🗂️', title: 'Dateien' },
  { id: 'photos', icon: '🖼️', title: 'Photos' },
  { id: 'messages', icon: '💬', title: 'Messages' },
  { id: 'spotify', icon: '🎵', title: 'Songs' },
]

export default function Dock() {
  const { windows, createWindow, restoreWindow } = useWindows()

  // Prüfe, ob ein Fenster im Fullscreen-Modus ist
  const hasFullscreenWindow = windows.some(w => w.fullscreen && !w.minimized)

  const handleDockClick = (appId: string) => {
    const minimizedWindow = windows
      .filter(w => w.appId === appId && w.minimized)
      .sort((a, b) => b.zIndex - a.zIndex)[0]
    
    if (minimizedWindow) {
      restoreWindow(minimizedWindow.id)
    } else {
      createWindow(appId)
    }
  }

  return (
    <div className={`dock ${hasFullscreenWindow ? 'hidden' : ''}`}>
      <div className="dock-bar">
        {DOCK_APPS.map(app => {
          const isActive = windows.some(w => w.appId === app.id && !w.minimized)
          return (
            <div
              key={app.id}
              className={`dock-btn ${isActive ? 'active' : ''}`}
              data-app={app.id}
              onClick={() => handleDockClick(app.id)}
              data-title={app.title}
            >
              {app.icon}
              {isActive && (
                <div className="indicator" />
              )}
              {/* Tooltip mit App-Namen */}
              <div className="dock-tooltip">
                {app.title.split('').map((char, index) => (
                  <span
                    key={index}
                    className={index === 0 ? 'dock-tooltip-first' : ''}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
