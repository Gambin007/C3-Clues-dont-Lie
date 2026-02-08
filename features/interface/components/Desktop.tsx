'use client'

import { useState } from 'react'
import { useWindows } from '@interface/contexts/WindowContext'
import { usePuzzle } from '@interface/contexts/PuzzleContext'
import Window from './Window'
import WeatherWidget from './WeatherWidget'
import CalendarWidget from './CalendarWidget'
import ArchiveLockOverlay from './ArchiveLockOverlay'
import { APP_CONFIGS } from './apps/appConfigs'
import { DESKTOP_FOLDER_POSITIONS, DESKTOP_FILES, DESKTOP_FOLDERS } from './apps/desktopData'

export default function Desktop() {
  const { windows, createWindow } = useWindows()
  const { vaultUnlocked, archiveLocked, archiveUnlocked } = usePuzzle()
  const [showArchiveLockOverlay, setShowArchiveLockOverlay] = useState(false)

  const handleArchiveClick = () => {
    if (archiveLocked) {
      // ARCHIV ist gesperrt - zeige Overlay
      setShowArchiveLockOverlay(true)
    } else {
      // ARCHIV ist entsperrt - öffne normal
      createWindow('dateien')
      // TODO: ARCHIV-Pfad an Dateien übergeben
    }
  }

  const handleFolderClick = (folderName: string) => {
    // Öffne Dateien mit diesem Ordner
    const dateienWindow = windows.find(w => w.appId === 'dateien')
    if (dateienWindow) {
      // Wenn Dateien bereits offen, fokussiere ihn
      // TODO: Ordner-Pfad an Dateien übergeben
    } else {
      // Öffne neue Dateien
      createWindow('dateien')
      // TODO: Ordner-Pfad an Dateien übergeben
    }
  }

  const handleFileClick = (fileName: string) => {
    // Öffne Dateien mit dieser Datei
    createWindow('dateien')
    // TODO: Datei-Pfad an Dateien übergeben
  }

  return (
    <main className="desktop" id="desktop">
      {/* Ordner */}
      {DESKTOP_FOLDER_POSITIONS.map((folder, index) => (
        <div
          key={folder.name}
          className="desktop-icon"
          style={{ top: folder.top, left: folder.left }}
          onDoubleClick={() => handleFolderClick(folder.name)}
        >
          <div className="glyph">📁</div>
          <div className="label">{folder.name}</div>
        </div>
      ))}

      {/* Lose Dateien auf dem Desktop */}
      {DESKTOP_FILES.map((file, index) => {
        const row = Math.floor(index / 6)
        const col = index % 6
        const top = `${270 + row * 100}px`
        const left = `${30 + col * 100}px`
        
        return (
          <div
            key={file.name}
            className="desktop-icon"
            style={{ top, left }}
            onDoubleClick={() => handleFileClick(file.name)}
          >
            <div className="glyph">{file.type === 'file' ? '📄' : '📁'}</div>
            <div className="label">{file.name}</div>
          </div>
        )
      })}

      {/* ARCHIV Ordner - erscheint nach VAULT-Unlock, sichtbar wenn entsperrt */}
      {vaultUnlocked && archiveUnlocked && (
        <div 
          className="desktop-icon" 
          id="icon-archive"
          style={{ top: '270px', left: '530px' }}
          onDoubleClick={handleArchiveClick}
        >
          <div className="glyph">📁</div>
          <div className="label">ARCHIV</div>
        </div>
      )}
      
      {/* ARCHIV Ordner - gesperrt, zeigt Overlay */}
      {vaultUnlocked && !archiveUnlocked && (
        <div 
          className="desktop-icon" 
          id="icon-archive"
          style={{ top: '270px', left: '530px' }}
          onDoubleClick={handleArchiveClick}
        >
          <div className="glyph">🔒</div>
          <div className="label">ARCHIV</div>
        </div>
      )}

      <WeatherWidget />
      <CalendarWidget />

      {showArchiveLockOverlay && (
        <ArchiveLockOverlay onClose={() => setShowArchiveLockOverlay(false)} />
      )}

      {windows.map(win => (
        <Window key={win.id} windowState={win} />
      ))}
    </main>
  )
}
