'use client'

import { useState } from 'react'
import { DESKTOP_FOLDERS, DESKTOP_FILES, DESKTOP_FOLDER_POSITIONS, DesktopFile } from './desktopData'

export default function Finder({ windowId }: { windowId: string }) {
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState<DesktopFile | null>(null)

  // Hole aktuelle Dateien/Ordner basierend auf Pfad
  const getCurrentItems = (): DesktopFile[] => {
    if (currentPath.length === 0) {
      // Desktop-Ebene: Zeige nur Ordner, die tatsächlich auf dem Desktop sind
      const folders: DesktopFile[] = DESKTOP_FOLDER_POSITIONS.map(folder => ({
        name: folder.name,
        type: 'folder' as const,
        children: folder.files,
      }))
      return [...folders, ...DESKTOP_FILES]
    }

    // Navigiere durch Ordner-Struktur
    // Finde den Ordner in DESKTOP_FOLDER_POSITIONS oder in DESKTOP_FOLDERS
    const rootFolderName = currentPath[0]
    const rootFolder = DESKTOP_FOLDER_POSITIONS.find(f => f.name === rootFolderName)
    let current: DesktopFile[] | undefined = rootFolder?.files || DESKTOP_FOLDERS[rootFolderName]
    
    if (!current) {
      return []
    }
    
    // Navigiere durch Unterordner
    for (let i = 1; i < currentPath.length; i++) {
      const folderName = currentPath[i]
      const folder: DesktopFile | undefined = current.find(item => item.name === folderName && item.type === 'folder')
      if (!folder || !folder.children) {
        return []
      }
      current = folder.children
    }

    return current
  }

  const handleItemClick = (item: DesktopFile) => {
    if (item.type === 'folder') {
      // Navigiere in Ordner
      setCurrentPath([...currentPath, item.name])
      setSelectedFile(null)
    } else {
      // Zeige Datei-Inhalt
      setSelectedFile(item)
    }
  }

  const handleBack = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1))
      setSelectedFile(null)
    }
  }

  const items = getCurrentItems()

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '200px', 
        background: 'rgba(0, 0, 0, 0.05)', 
        borderRight: '1px solid rgba(0, 0, 0, 0.1)',
        padding: '12px',
        overflowY: 'auto',
      }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(0, 0, 0, 0.5)', marginBottom: '8px', textTransform: 'uppercase' }}>
          Favoriten
        </div>
        <div 
          style={{ 
            padding: '6px 8px', 
            borderRadius: '6px', 
            cursor: 'pointer',
            fontSize: '13px',
            color: currentPath.length === 0 ? 'var(--text)' : 'var(--muted)',
            background: currentPath.length === 0 ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
          }}
          onClick={() => setCurrentPath([])}
        >
          🖥️ Desktop
        </div>
        {currentPath.length > 0 && (
          <div style={{ marginTop: '16px', fontSize: '11px', fontWeight: 600, color: 'rgba(0, 0, 0, 0.5)', marginBottom: '8px', textTransform: 'uppercase' }}>
            Pfad
          </div>
        )}
        {currentPath.length > 0 && (
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>
            {currentPath.join(' > ')}
          </div>
        )}
      </div>

      {/* Hauptbereich */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ 
          padding: '12px 16px', 
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          {currentPath.length > 0 && (
            <button
              onClick={handleBack}
              style={{
                padding: '4px 12px',
                background: 'transparent',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              ← Zurück
            </button>
          )}
          <div style={{ flex: 1, fontSize: '13px', color: 'var(--muted)' }}>
            {currentPath.length === 0 ? 'Desktop' : currentPath.join(' > ')}
          </div>
        </div>

        {/* Dateiliste */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '16px',
        }}>
          {items.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              onClick={() => handleItemClick(item)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: selectedFile?.name === item.name ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => {
                if (selectedFile?.name !== item.name) {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.03)'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedFile?.name !== item.name) {
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>
                {item.type === 'folder' ? '📁' : '📄'}
              </div>
              <div style={{ 
                fontSize: '12px', 
                textAlign: 'center',
                wordBreak: 'break-word',
                color: 'var(--text)',
              }}>
                {item.name}
              </div>
            </div>
          ))}
        </div>

        {/* Vorschau-Bereich (wenn Datei ausgewählt) */}
        {selectedFile && selectedFile.type === 'file' && selectedFile.content && (
          <div style={{
            borderTop: '1px solid rgba(0, 0, 0, 0.1)',
            padding: '16px',
            maxHeight: '200px',
            overflowY: 'auto',
            background: 'rgba(0, 0, 0, 0.02)',
          }}>
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
              {selectedFile.name}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: 'var(--text)',
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
              lineHeight: 1.6,
            }}>
              {selectedFile.content}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
