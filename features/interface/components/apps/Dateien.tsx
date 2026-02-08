'use client'

import { useState, useEffect } from 'react'
import { usePuzzle } from '@interface/contexts/PuzzleContext'
import { useWindows } from '@interface/contexts/WindowContext'
import { DESKTOP_FOLDERS, DESKTOP_FILES, DESKTOP_FOLDER_POSITIONS, DesktopFile } from './desktopData'

// Helper: Get file icon based on extension/type
const getFileIcon = (item: DesktopFile): string => {
  if (item.type === 'folder') return '📁'
  
  const name = item.name.toLowerCase()
  if (name.endsWith('.mp4') || name.endsWith('.mov') || name.endsWith('.avi')) {
    return '🎬'
  }
  if (name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.gif')) {
    return '🖼️'
  }
  if (name.endsWith('.mp3') || name.endsWith('.m4a') || name.endsWith('.wav')) {
    return '🎧'
  }
  if (name.endsWith('.zip') || name.endsWith('.tar') || name.endsWith('.gz')) {
    return '🗜️'
  }
  if (name.endsWith('.pdf')) {
    return '📕'
  }
  if (name.endsWith('.docx') || name.endsWith('.doc')) {
    return '📘'
  }
  if (name.endsWith('.md')) {
    return '📝'
  }
  if (name.endsWith('.txt')) {
    return '📄'
  }
  return '📄'
}

export default function Dateien({ windowId }: { windowId: string }) {
  const { archiveUnlocked, setPhotoDeepLink, setFileDeepLink, fileDeepLink } = usePuzzle()
  const { createWindow } = useWindows()
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState<DesktopFile | null>(null)
  const [showPreview, setShowPreview] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string>('')

  // fileDeepLink Handler: Navigiere automatisch zur Datei
  useEffect(() => {
    if (!fileDeepLink) return

    // fileDeepLink Format: "REDAKTION/Recherche/Fragmente/fragment_07.txt" oder "fragment_07.txt"
    const parts = fileDeepLink.split('/')
    
    if (parts.length === 1) {
      // Nur Dateiname: Suche in aktuellen Items (Desktop-Ebene)
      const items = getCurrentItems()
      const file = items.find(item => item.name === parts[0] && item.type === 'file')
      if (file) {
        setSelectedFile(file)
        setShowPreview(true)
        setFileDeepLink(null) // Zurücksetzen nach Verwendung
      }
    } else {
      // Vollständiger Pfad: Navigiere durch Ordner
      const pathParts = parts.slice(0, -1) // Alle außer letztem (Dateiname)
      const fileName = parts[parts.length - 1]
      
      // Navigiere zum Pfad
      setCurrentPath(pathParts)
      
      // Warte kurz auf Rendering, dann wähle Datei aus
      setTimeout(() => {
        // Hole Items nach Navigation
        let current: DesktopFile[] | undefined
        
        if (pathParts.length === 0) {
          // Desktop-Ebene
          const folders: DesktopFile[] = DESKTOP_FOLDER_POSITIONS.map(folder => ({
            name: folder.name,
            type: 'folder' as const,
            children: folder.files,
          }))
          if (archiveUnlocked && DESKTOP_FOLDERS.ARCHIV) {
            folders.push({
              name: 'ARCHIV',
              type: 'folder' as const,
              children: DESKTOP_FOLDERS.ARCHIV,
            })
          }
          current = [...folders, ...DESKTOP_FILES]
        } else {
          // Navigiere durch Ordner-Struktur
          const rootFolderName = pathParts[0]
          const rootFolder = DESKTOP_FOLDER_POSITIONS.find(f => f.name === rootFolderName)
          current = rootFolder?.files || DESKTOP_FOLDERS[rootFolderName]
          
          if (rootFolderName === 'ARCHIV' && archiveUnlocked) {
            current = DESKTOP_FOLDERS.ARCHIV
          }
          
          if (current) {
            for (let i = 1; i < pathParts.length; i++) {
              const folderName = pathParts[i]
              const folder: DesktopFile | undefined = current.find(item => item.name === folderName && item.type === 'folder')
              if (!folder || !folder.children) {
                current = undefined
                break
              }
              current = folder.children
            }
          }
        }
        
        if (current) {
          const file = current.find(item => item.name === fileName && item.type === 'file')
          if (file) {
            setSelectedFile(file)
            setShowPreview(true)
          }
        }
        
        // Setze fileDeepLink zurück nach Verwendung
        setFileDeepLink(null)
      }, 200)
    }
  }, [fileDeepLink, setFileDeepLink, archiveUnlocked])

  // Extrahiere PHOTO_KEY aus Textdatei-Inhalt
  const extractPhotoKey = (content: string | undefined): string | null => {
    if (!content) return null
    const match = content.match(/PHOTO_KEY:\s*(.+)/i)
    return match ? match[1].trim() : null
  }

  // Handler für "In Fotos öffnen" Button
  const handleOpenInPhotos = (photoKey: string) => {
    setPhotoDeepLink(photoKey)
    // Setze fileDeepLink für Rückverknüpfung
    const filePath = currentPath.length > 0 
      ? `${currentPath.join('/')}/${selectedFile?.name || ''}`
      : selectedFile?.name || ''
    setFileDeepLink(filePath)
    createWindow('photos')
  }

  // Hole aktuelle Dateien/Ordner basierend auf Pfad
  const getCurrentItems = (): DesktopFile[] => {
    if (currentPath.length === 0) {
      // Desktop-Ebene: Zeige nur Ordner, die tatsächlich auf dem Desktop sind
      const folders: DesktopFile[] = DESKTOP_FOLDER_POSITIONS.map(folder => ({
        name: folder.name,
        type: 'folder' as const,
        children: folder.files,
      }))
      
      // Füge ARCHIV hinzu, wenn entsperrt
      if (archiveUnlocked && DESKTOP_FOLDERS.ARCHIV) {
        folders.push({
          name: 'ARCHIV',
          type: 'folder' as const,
          children: DESKTOP_FOLDERS.ARCHIV,
        })
      }
      
      return [...folders, ...DESKTOP_FILES]
    }

    // Navigiere durch Ordner-Struktur
    const rootFolderName = currentPath[0]
    const rootFolder = DESKTOP_FOLDER_POSITIONS.find(f => f.name === rootFolderName)
    let current: DesktopFile[] | undefined = rootFolder?.files || DESKTOP_FOLDERS[rootFolderName]
    
    // ARCHIV kann auch Root-Ordner sein
    if (rootFolderName === 'ARCHIV' && archiveUnlocked) {
      current = DESKTOP_FOLDERS.ARCHIV
    }
    
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
      // Prüfe ob es eine Video-Datei ist
      if (item.name.endsWith('.mp4') || item.name === 'anhang_video.mp4') {
        if (item.url) {
          setVideoUrl(item.url)
          setShowVideoModal(true)
        }
      } else {
        // Zeige Datei-Inhalt
        setSelectedFile(item)
      }
    }
  }

  const handleBack = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1))
      setSelectedFile(null)
    }
  }

  const handleForward = () => {
    // Placeholder für Vor-Button (kann später implementiert werden)
  }

  const items = getCurrentItems()
  const breadcrumb = currentPath.length === 0 
    ? ['Desktop'] 
    : ['Desktop', ...currentPath]

  return (
    <div style={{ 
      display: 'flex', 
      height: '100%', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
      background: 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }}>
      {/* Sidebar */}
      <div style={{ 
        width: '220px', 
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '16px 12px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <div style={{ 
          fontSize: '11px', 
          fontWeight: 600, 
          color: 'rgba(255, 255, 255, 0.4)', 
          marginBottom: '4px', 
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          Favoriten
        </div>
        <div 
          style={{ 
            padding: '8px 10px', 
            borderRadius: '10px', 
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: currentPath.length === 0 ? 500 : 400,
            color: currentPath.length === 0 ? 'var(--text)' : 'var(--muted)',
            background: currentPath.length === 0 ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
            transition: 'all 0.2s ease',
          }}
          onClick={() => setCurrentPath([])}
          onMouseEnter={(e) => {
            if (currentPath.length !== 0) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
            }
          }}
          onMouseLeave={(e) => {
            if (currentPath.length !== 0) {
              e.currentTarget.style.background = 'transparent'
            }
          }}
        >
          🖥️ Desktop
        </div>
      </div>

      {/* Hauptbereich */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Sticky Toolbar */}
        <div style={{ 
          padding: '10px 20px', 
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          {/* Navigation Buttons */}
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={handleBack}
              disabled={currentPath.length === 0}
              style={{
                width: '28px',
                height: '28px',
                padding: 0,
                background: currentPath.length > 0 ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                cursor: currentPath.length > 0 ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                color: currentPath.length > 0 ? 'var(--text)' : 'var(--muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (currentPath.length > 0) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'
                }
              }}
              onMouseLeave={(e) => {
                if (currentPath.length > 0) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                }
              }}
            >
              ←
            </button>
            <button
              onClick={handleForward}
              disabled={true}
              style={{
                width: '28px',
                height: '28px',
                padding: 0,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                cursor: 'not-allowed',
                fontSize: '14px',
                color: 'var(--muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              →
            </button>
          </div>

          {/* Breadcrumb */}
          <div style={{ 
            flex: 1, 
            fontSize: '13px', 
            color: 'var(--text)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 500,
          }}>
            {breadcrumb.map((part, index) => (
              <span key={index}>
                {index > 0 && <span style={{ color: 'var(--muted)', margin: '0 6px' }}>/</span>}
                <span 
                  style={{ 
                    cursor: index < breadcrumb.length - 1 ? 'pointer' : 'default',
                    color: index < breadcrumb.length - 1 ? 'var(--muted)' : 'var(--text)',
                    transition: 'color 0.2s',
                  }}
                  onClick={() => {
                    if (index < breadcrumb.length - 1) {
                      setCurrentPath(currentPath.slice(0, index))
                      setSelectedFile(null)
                    }
                  }}
                  onMouseEnter={(e) => {
                    if (index < breadcrumb.length - 1) {
                      e.currentTarget.style.color = 'var(--text)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (index < breadcrumb.length - 1) {
                      e.currentTarget.style.color = 'var(--muted)'
                    }
                  }}
                >
                  {part}
                </span>
              </span>
            ))}
          </div>

          {/* View Toggle */}
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            style={{
              width: '28px',
              height: '28px',
              padding: 0,
              background: viewMode === 'list' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              color: 'var(--text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = viewMode === 'list' ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.12)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = viewMode === 'list' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.08)'
            }}
            title={viewMode === 'grid' ? 'Listenansicht' : 'Rasteransicht'}
          >
            {viewMode === 'grid' ? '≡' : '⊞'}
          </button>
        </div>

        {/* Content Area */}
        <div style={{ 
          flex: 1, 
          display: 'flex',
          overflow: 'hidden',
        }}>
          {/* Dateiliste */}
          <div style={{ 
            flex: showPreview ? 1 : 1,
            overflowY: 'auto', 
            padding: viewMode === 'grid' ? '24px' : '12px',
            display: viewMode === 'grid' ? 'grid' : 'flex',
            flexDirection: viewMode === 'list' ? 'column' : undefined,
            gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(140px, 1fr))' : undefined,
            gap: viewMode === 'grid' ? '20px' : '4px',
            alignContent: 'start',
          }}>
            {items.map((item, index) => {
              const isSelected = selectedFile?.name === item.name
              return (
                <div
                  key={`${item.name}-${index}`}
                  onClick={() => handleItemClick(item)}
                  style={{
                    display: 'flex',
                    flexDirection: viewMode === 'grid' ? 'column' : 'row',
                    alignItems: viewMode === 'grid' ? 'center' : 'center',
                    padding: viewMode === 'grid' ? '16px 12px' : '10px 16px',
                    borderRadius: viewMode === 'grid' ? '14px' : '8px',
                    cursor: 'pointer',
                    background: isSelected 
                      ? 'rgba(59, 130, 246, 0.2)' 
                      : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected 
                      ? '1px solid rgba(59, 130, 246, 0.4)' 
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    transition: 'all 0.2s ease',
                    transform: 'scale(1)',
                    gap: viewMode === 'list' ? '12px' : undefined,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
                      if (viewMode === 'grid') {
                        e.currentTarget.style.transform = 'scale(1.02)'
                      }
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                      e.currentTarget.style.transform = 'scale(1)'
                    }
                  }}
                >
                  {item.url && (item.name.toLowerCase().endsWith('.jpg') || item.name.toLowerCase().endsWith('.jpeg') || item.name.toLowerCase().endsWith('.png') || item.name.toLowerCase().endsWith('.gif')) ? (
                    <div style={{
                      width: viewMode === 'grid' ? '100%' : '48px',
                      height: viewMode === 'grid' ? 'auto' : '48px',
                      aspectRatio: viewMode === 'grid' ? '1' : undefined,
                      marginBottom: viewMode === 'grid' ? '12px' : '0',
                      borderRadius: viewMode === 'grid' ? '8px' : '6px',
                      overflow: 'hidden',
                      background: 'rgba(0, 0, 0, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <img 
                        src={item.url} 
                        alt={item.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{ 
                      fontSize: viewMode === 'grid' ? '56px' : '32px', 
                      marginBottom: viewMode === 'grid' ? '12px' : '0',
                      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                      flexShrink: 0,
                    }}>
                      {getFileIcon(item)}
                    </div>
                  )}
                  <div style={{ 
                    fontSize: viewMode === 'grid' ? '12px' : '13px', 
                    textAlign: viewMode === 'grid' ? 'center' : 'left',
                    wordBreak: 'break-word',
                    color: 'var(--text)',
                    fontWeight: 500,
                    lineHeight: 1.4,
                    maxWidth: '100%',
                    flex: viewMode === 'list' ? 1 : undefined,
                  }}>
                    {item.name}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Preview Panel */}
          {showPreview && selectedFile && selectedFile.type === 'file' && (
            <div style={{
              width: '320px',
              borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              padding: '20px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>
                  {selectedFile.name}
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  style={{
                    width: '24px',
                    height: '24px',
                    padding: 0,
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: 'var(--muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                    e.currentTarget.style.color = 'var(--text)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--muted)'
                  }}
                >
                  ×
                </button>
              </div>
              
              <div style={{
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                fontSize: '11px',
                color: 'var(--muted)',
              }}>
                <div style={{ marginBottom: '4px' }}>
                  <strong>Typ:</strong> {selectedFile.name.split('.').pop()?.toUpperCase() || 'Datei'}
                </div>
                <div>
                  <strong>Größe:</strong> {selectedFile.content?.length || 0} Zeichen
                </div>
              </div>

              {/* Bild-Anzeige */}
              {selectedFile.url && (selectedFile.name.toLowerCase().endsWith('.jpg') || selectedFile.name.toLowerCase().endsWith('.jpeg') || selectedFile.name.toLowerCase().endsWith('.png') || selectedFile.name.toLowerCase().endsWith('.gif')) && (
                <div style={{
                  flex: 1,
                  padding: '16px',
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  maxHeight: '400px',
                }}>
                  <img 
                    src={selectedFile.url} 
                    alt={selectedFile.name}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      borderRadius: '8px',
                    }}
                  />
                </div>
              )}
              {/* Text-Content */}
              {selectedFile.content && !selectedFile.url && (
                <>
                  {/* "In Fotos öffnen" Button wenn PHOTO_KEY vorhanden */}
                  {extractPhotoKey(selectedFile.content) && (
                    <button
                      onClick={() => handleOpenInPhotos(extractPhotoKey(selectedFile.content)!)}
                      style={{
                        padding: '8px 16px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        border: '1px solid rgba(59, 130, 246, 0.4)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        color: 'var(--text)',
                        fontWeight: 500,
                        transition: 'all 0.2s ease',
                        alignSelf: 'flex-start',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)'
                        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'
                        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)'
                      }}
                    >
                      📷 In Fotos öffnen
                    </button>
                  )}
                  <div style={{
                    flex: 1,
                    padding: '16px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '10px',
                    fontSize: '12px',
                    color: 'var(--text)',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                    lineHeight: 1.6,
                    overflowY: 'auto',
                    maxHeight: '400px',
                  }}>
                    {selectedFile.content}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowVideoModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '900px',
              maxHeight: '70vh',
              width: '100%',
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowVideoModal(false)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: 0,
                width: '32px',
                height: '32px',
                padding: 0,
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '20px',
                color: 'var(--text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                zIndex: 10001,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              }}
            >
              ×
            </button>

            {/* Video Player */}
            <video
              src={videoUrl}
              controls
              autoPlay
              style={{
                width: '100%',
                maxHeight: '70vh',
                borderRadius: '12px',
                outline: 'none',
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
