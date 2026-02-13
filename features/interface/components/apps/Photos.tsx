'use client'

import { useState, useEffect, useRef } from 'react'
import { usePuzzle } from '@interface/contexts/PuzzleContext'
import { useWindows } from '@interface/contexts/WindowContext'

interface Photo {
  id: string
  name: string
  album: string
  url?: string // Optional: später für echte Bilder
}

// Album-Struktur mit Fotos
const ALBUMS: Record<string, Photo[]> = {
  Redaktion: [
    { id: 'red_01', name: '', album: 'Redaktion', url: '/media/photos/redaktion/redaktion1.png' },
    { id: 'red_02', name: '', album: 'Redaktion', url: '/media/photos/redaktion/redaktion2.png' },
    { id: 'red_03', name: '', album: 'Redaktion', url: '/media/photos/redaktion/redaktion3.png' },
    { id: 'red_04', name: '', album: 'Redaktion', url: '/media/photos/redaktion/redaktion4.png' },
    { id: 'red_05', name: '', album: 'Redaktion', url: '/media/photos/redaktion/redaktion5.png' },
    { id: 'red_06', name: '', album: 'Redaktion', url: '/media/photos/redaktion/redaktion6.png' },
    { id: 'red_07', name: '', album: 'Redaktion', url: '/media/photos/redaktion/redaktion7.png' },
  ],
  Arbeitsplatz: [
    { id: 'work_01', name: '', album: 'Arbeitsplatz', url: '/media/photos/arbeitsplatz/arbeitsplatz1.png' },
    { id: 'work_02', name: '', album: 'Arbeitsplatz', url: '/media/photos/arbeitsplatz/arbeitsplatz2.png' },
    { id: 'work_03', name: '', album: 'Arbeitsplatz', url: '/media/photos/arbeitsplatz/arbeitsplatz3.png' },
    { id: 'work_04', name: '', album: 'Arbeitsplatz', url: '/media/photos/arbeitsplatz/arbeitsplatz4.png' },
    { id: 'work_05', name: '', album: 'Arbeitsplatz', url: '/media/photos/arbeitsplatz/arbeitsplatz5.png' },
    { id: 'work_06', name: '', album: 'Arbeitsplatz', url: '/media/photos/arbeitsplatz/arbeitsplatz6.png' },
    { id: 'work_07', name: '', album: 'Arbeitsplatz', url: '/media/photos/arbeitsplatz/arbeitsplatz7.png' },
  ],
  Privat: [
    { id: 'priv_01', name: '', album: 'Privat', url: '/media/photos/privat/privat1.png' },
    { id: 'priv_02', name: '', album: 'Privat', url: '/media/photos/privat/privat2.png' },
    { id: 'priv_03', name: '', album: 'Privat', url: '/media/photos/privat/privat3.png' },
    { id: 'priv_04', name: '', album: 'Privat', url: '/media/photos/privat/privat4.png' },
    { id: 'priv_05', name: '', album: 'Privat', url: '/media/photos/privat/privat5.png' },
    { id: 'priv_06', name: '', album: 'Privat', url: '/media/photos/privat/privat6.png' },
    { id: 'priv_07', name: '', album: 'Privat', url: '/media/photos/privat/privat7.jpg' },
    { id: 'priv_08', name: '', album: 'Privat', url: '/media/photos/privat/privat8.jpg' },
    { id: 'priv_09', name: '', album: 'Privat', url: '/media/photos/privat/privat9.jpg' },
  ],
  Screenshots: [
    { id: 'scr_01', name: '', album: 'Screenshots', url: '/media/photos/screenshots/screenshot1.png' },
    { id: 'scr_02', name: '', album: 'Screenshots', url: '/media/photos/screenshots/screenshot2.png' },
    { id: 'scr_03', name: '', album: 'Screenshots', url: '/media/photos/screenshots/screenshot3.png' },
    { id: 'scr_04', name: '', album: 'Screenshots', url: '/media/photos/screenshots/screenshot4.png' },
    { id: 'scr_06', name: '', album: 'Screenshots', url: '/media/photos/screenshots/screenshot6.png' },
    { id: 'scr_07', name: '', album: 'Screenshots', url: '/media/photos/screenshots/screenshot7.png' },
    { id: 'scr_08', name: '', album: 'Screenshots', url: '/media/photos/screenshots/screenshot8.png' },
    { id: 'scr_09', name: '', album: 'Screenshots', url: '/media/photos/screenshots/screenshot9.png' },
  ],
}

export default function Photos({ windowId }: { windowId: string }) {
  const { photoDeepLink, setPhotoDeepLink, fileDeepLink, setFileDeepLink } = usePuzzle()
  const { createWindow } = useWindows()
  const [selectedAlbum, setSelectedAlbum] = useState<string>('Redaktion')
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [photoIndex, setPhotoIndex] = useState<number>(0)
  const [windowWidth, setWindowWidth] = useState<number>(1200)
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const currentPhotos = ALBUMS[selectedAlbum] || []
  const allPhotos = Object.values(ALBUMS).flat()

  // Deep-Link Handler: Finde Foto basierend auf photoDeepLink
  useEffect(() => {
    if (!photoDeepLink) return

    // photoDeepLink Format: "album/filename" z.B. "arbeitsplatz/creation_2293930965.png"
    const parts = photoDeepLink.split('/')
    if (parts.length < 2) return

    const albumName = parts[0]
    const filename = parts.slice(1).join('/') // Falls Unterordner vorhanden

    // Finde Album (case-insensitive)
    const albumKey = Object.keys(ALBUMS).find(
      key => key.toLowerCase() === albumName.toLowerCase()
    )

    if (!albumKey) return

    // Finde Foto im Album basierend auf URL
    // URL Format: "/media/photos/album/filename"
    const album = ALBUMS[albumKey]
    const photo = album.find(p => {
      if (p.url) {
        // Prüfe ob URL den filename enthält (case-insensitive)
        const urlLower = p.url.toLowerCase()
        const filenameLower = filename.toLowerCase()
        // Suche nach filename im URL-Pfad
        return urlLower.includes(filenameLower) || urlLower.endsWith(filenameLower)
      }
      return false
    })

    if (photo) {
      setSelectedAlbum(albumKey)
      const index = album.findIndex(p => p.id === photo.id)
      setPhotoIndex(index)
      setSelectedPhoto(photo)
      
      // Scrolle zum Foto im Grid (nach kurzer Verzögerung für Rendering)
      setTimeout(() => {
        if (gridRef.current) {
          const photoElement = gridRef.current.querySelector(`[data-photo-id="${photo.id}"]`) as HTMLElement
          if (photoElement) {
            photoElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }
      }, 200)

      // Optional: Deep-Link nach Verwendung zurücksetzen (damit es nicht "klebt")
      setTimeout(() => {
        setPhotoDeepLink(null)
      }, 1000)
    }
  }, [photoDeepLink, setPhotoDeepLink])

  // Track window size for responsive design
  useEffect(() => {
    const updateWindowSize = () => {
      if (containerRef.current) {
        setWindowWidth(containerRef.current.offsetWidth)
      }
    }

    updateWindowSize()
    const resizeObserver = new ResizeObserver(updateWindowSize)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  // Responsive breakpoints
  const isSmall = windowWidth < 600
  const isMedium = windowWidth >= 600 && windowWidth < 900
  const isLarge = windowWidth >= 900

  const handlePhotoClick = (photo: Photo) => {
    const index = currentPhotos.findIndex(p => p.id === photo.id)
    setSelectedPhoto(photo)
    setPhotoIndex(index)
  }

  const handleNext = () => {
    if (photoIndex < currentPhotos.length - 1) {
      const nextIndex = photoIndex + 1
      setPhotoIndex(nextIndex)
      setSelectedPhoto(currentPhotos[nextIndex])
    }
  }

  const handlePrevious = () => {
    if (photoIndex > 0) {
      const prevIndex = photoIndex - 1
      setPhotoIndex(prevIndex)
      setSelectedPhoto(currentPhotos[prevIndex])
    }
  }

  const handleClose = () => {
    setSelectedPhoto(null)
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!selectedPhoto) return
    
    if (e.key === 'ArrowRight') {
      handleNext()
    } else if (e.key === 'ArrowLeft') {
      handlePrevious()
    } else if (e.key === 'Escape') {
      handleClose()
    }
  }

  return (
    <div 
      ref={containerRef}
      style={{ 
        display: 'flex', 
        height: '100%', 
        width: '100%',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Sidebar */}
      <div style={{ 
        width: isSmall ? '0px' : isMedium ? '160px' : '220px',
        minWidth: isSmall ? '0px' : isMedium ? '160px' : '220px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRight: isSmall ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
        padding: isSmall ? '0' : isMedium ? '12px 8px' : '16px 12px',
        overflowY: 'auto',
        display: isSmall ? 'none' : 'flex',
        flexDirection: 'column',
        gap: '4px',
        transition: 'width 0.3s ease, padding 0.3s ease',
        overflow: isSmall ? 'hidden' : 'auto',
      }}>
        <div style={{ 
          fontSize: '11px', 
          fontWeight: 600, 
          color: 'rgba(255, 255, 255, 0.4)', 
          marginBottom: '8px', 
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          Alben
        </div>
        {Object.keys(ALBUMS).map(albumName => (
          <div
            key={albumName}
            onClick={() => {
              setSelectedAlbum(albumName)
              setSelectedPhoto(null)
            }}
            style={{
              padding: '8px 10px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: selectedAlbum === albumName ? 500 : 400,
              color: selectedAlbum === albumName ? 'var(--text)' : 'var(--muted)',
              background: selectedAlbum === albumName ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              if (selectedAlbum !== albumName) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
              }
            }}
            onMouseLeave={(e) => {
              if (selectedAlbum !== albumName) {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            <span style={{ fontSize: '16px' }}>📷</span>
            <span>{albumName}</span>
            <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--muted)' }}>
              {ALBUMS[albumName].length}
            </span>
          </div>
        ))}
      </div>

      {/* Hauptbereich */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden', 
        minWidth: 0,
        width: 0, // Wichtig für flexbox overflow
      }}>
        {/* Header */}
        {selectedAlbum !== 'Arbeitsplatz' && (
          <div style={{ 
            padding: isSmall ? '12px 16px' : isMedium ? '14px 20px' : '16px 24px', 
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <div style={{ fontSize: isSmall ? '16px' : isMedium ? '17px' : '18px', fontWeight: 600, color: 'var(--text)' }}>
              {selectedAlbum}
            </div>
            <div style={{ fontSize: isSmall ? '11px' : '12px', color: 'var(--muted)', marginTop: '4px' }}>
              {currentPhotos.length} {currentPhotos.length === 1 ? 'Foto' : 'Fotos'}
            </div>
          </div>
        )}

        {/* Photo Grid */}
        <div 
          ref={gridRef}
          style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: isSmall 
            ? (selectedAlbum === 'Arbeitsplatz' ? '12px' : '12px')
            : isMedium 
            ? (selectedAlbum === 'Arbeitsplatz' ? '16px' : '16px')
            : (selectedAlbum === 'Arbeitsplatz' ? '40px' : '24px'),
          display: 'grid',
          gridTemplateColumns: isSmall
            ? (selectedAlbum === 'Arbeitsplatz' ? 'repeat(auto-fill, minmax(80px, 1fr))' : 'repeat(auto-fill, minmax(80px, 1fr))')
            : isMedium
            ? (selectedAlbum === 'Arbeitsplatz' ? 'repeat(auto-fill, minmax(120px, 1fr))' : 'repeat(auto-fill, minmax(110px, 1fr))')
            : (selectedAlbum === 'Arbeitsplatz' 
              ? 'repeat(auto-fill, minmax(180px, 1fr))' 
              : 'repeat(auto-fill, minmax(140px, 1fr))'),
          gap: isSmall 
            ? (selectedAlbum === 'Arbeitsplatz' ? '6px' : '6px')
            : isMedium
            ? (selectedAlbum === 'Arbeitsplatz' ? '10px' : '8px')
            : (selectedAlbum === 'Arbeitsplatz' ? '20px' : '12px'),
          alignContent: 'start',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          {currentPhotos.map((photo) => (
            <div
              key={photo.id}
              data-photo-id={photo.id}
              onClick={() => handlePhotoClick(photo)}
              style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: '12px',
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                minWidth: 0,
                minHeight: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
                e.currentTarget.style.transform = 'scale(1.02)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              {photo.url ? (
                <>
                  <img 
                    src={photo.url} 
                    alt=""
                    onError={(e) => {
                      console.error('Failed to load image:', photo.url)
                      // Hide the broken image
                      e.currentTarget.style.display = 'none'
                      // Show fallback icon
                      const container = e.currentTarget.parentElement
                      if (container) {
                        const fallback = container.querySelector('.photo-fallback') as HTMLElement
                        if (fallback) {
                          fallback.style.display = 'flex'
                        }
                      }
                    }}
                    onLoad={(e) => {
                      console.log('Image loaded successfully:', photo.url)
                      // Hide fallback when image loads
                      const container = (e.currentTarget as HTMLElement).parentElement
                      if (container) {
                        const fallback = container.querySelector('.photo-fallback') as HTMLElement
                        if (fallback) {
                          fallback.style.display = 'none'
                        }
                      }
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <div 
                    className="photo-fallback"
                    style={{
                      fontSize: '48px',
                      color: 'var(--muted)',
                      opacity: 0.5,
                      display: 'none',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      pointerEvents: 'none',
                    }}
                  >
                    🖼️
                  </div>
                </>
              ) : (
                <div style={{
                  fontSize: '48px',
                  color: 'var(--muted)',
                  opacity: 0.5,
                }}>
                  🖼️
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / Viewer */}
      {selectedPhoto && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
          }}
          onClick={handleClose}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '80vw',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '20px',
                width: '32px',
                height: '32px',
                padding: 0,
                background: 'rgba(30, 31, 36, 0.8)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '20px',
                color: 'var(--text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(30, 31, 36, 0.95)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(30, 31, 36, 0.8)'
                e.currentTarget.style.borderColor = 'var(--border)'
              }}
            >
              ×
            </button>

            {/* Image Container */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              borderRadius: '12px',
              padding: isSmall ? '10px' : '20px',
              maxWidth: '80vw',
              maxHeight: '80vh',
              width: 'auto',
              height: 'auto',
              position: 'relative',
            }}>
              {selectedPhoto.url ? (
                <>
                  <img 
                    src={selectedPhoto.url} 
                    alt=""
                    onError={(e) => {
                      console.error('Failed to load image:', selectedPhoto.url)
                      // Hide the broken image
                      e.currentTarget.style.display = 'none'
                      // Show fallback icon
                      const container = e.currentTarget.parentElement
                      if (container) {
                        const fallback = container.querySelector('.photo-lightbox-fallback') as HTMLElement
                        if (fallback) {
                          fallback.style.display = 'flex'
                        }
                      }
                    }}
                    onLoad={(e) => {
                      console.log('Image loaded successfully:', selectedPhoto.url)
                      // Hide fallback when image loads
                      const container = (e.currentTarget as HTMLElement).parentElement
                      if (container) {
                        const fallback = container.querySelector('.photo-lightbox-fallback') as HTMLElement
                        if (fallback) {
                          fallback.style.display = 'none'
                        }
                      }
                    }}
                    style={{
                      maxWidth: '80vw',
                      maxHeight: '80vh',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      borderRadius: '8px',
                    }}
                  />
                  <div 
                    className="photo-lightbox-fallback"
                    style={{
                      fontSize: '120px',
                      color: 'var(--muted)',
                      opacity: 0.5,
                      display: 'none',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      pointerEvents: 'none',
                    }}
                  >
                    🖼️
                  </div>
                </>
              ) : (
                <div style={{
                  fontSize: '120px',
                  color: 'var(--muted)',
                  opacity: 0.5,
                }}>
                  🖼️
                </div>
              )}
            </div>

            {/* Navigation */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              alignItems: 'center',
            }}>
              <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
              }}>
                <button
                  className="btn"
                  onClick={handlePrevious}
                  disabled={photoIndex === 0}
                >
                  ← Zurück
                </button>
                <div style={{
                  fontSize: '12px',
                  color: 'var(--muted)',
                  minWidth: '80px',
                  textAlign: 'center',
                }}>
                  {photoIndex + 1} / {currentPhotos.length}
                </div>
                <button
                  className="btn"
                  onClick={handleNext}
                  disabled={photoIndex === currentPhotos.length - 1}
                >
                  Vor →
                </button>
              </div>
              {/* "Zu Datei springen" Button (optional, wenn fileDeepLink gesetzt) */}
              {fileDeepLink && (
                <button
                  className="btn"
                  onClick={() => {
                    setFileDeepLink(fileDeepLink)
                    createWindow('dateien')
                  }}
                >
                  📄 Zu Datei springen
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
