'use client'

import { useState, useEffect, useRef } from 'react'
import { usePuzzle } from '@interface/contexts/PuzzleContext'

interface Song {
  id: string
  title: string
  artist: string
  cover?: string
  audioUrl?: string
  embedUrl?: string
}

// Fallback-Liste falls API nicht erreichbar
const FALLBACK_SONGS: Song[] = [
  { id: '1', title: 'Then Again', artist: 'Lisa', cover: '🎵' },
  { id: '2', title: 'Memories', artist: 'Various', cover: '🎵' },
  { id: '3', title: 'Quiet Moments', artist: 'Lisa', cover: '🎵' },
  { id: 'universe', title: 'Us emene lääre Gygechaschte', artist: 'Mani Matter', cover: '🎵', audioUrl: '/media/audio/Mani_Matter.mp3' },
  { id: '14', title: 'Chill', artist: 'Various', cover: '🎵' },
]

export default function Spotify({ windowId }: { windowId: string }) {
  const { markUFound } = usePuzzle()
  const [songs, setSongs] = useState<Song[]>(FALLBACK_SONGS)
  const [selectedTrack, setSelectedTrack] = useState<Song | null>(null)
  const [hasSeenUniverse, setHasSeenUniverse] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showEmbed, setShowEmbed] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Lade Songs von API
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch('/api/songs')
        if (response.ok) {
          const data = await response.json()
          setSongs(data)
        }
      } catch (error) {
        console.error('Failed to fetch songs:', error)
        // Fallback wird bereits verwendet
      }
    }
    fetchSongs()
  }, [])

  // Markiere U als gefunden, wenn "universe" Track gesehen wurde
  useEffect(() => {
    if (selectedTrack?.id === 'universe' && !hasSeenUniverse) {
      markUFound()
      setHasSeenUniverse(true)
    }
  }, [selectedTrack, hasSeenUniverse, markUFound])

  // Audio-Playback-Logik
  useEffect(() => {
    if (selectedTrack?.audioUrl && audioRef.current) {
      const audio = audioRef.current
      
      // Setze src nur wenn es sich geändert hat
      if (audio.src !== selectedTrack.audioUrl) {
        audio.src = selectedTrack.audioUrl
        setIsPlaying(false) // Reset playing state when track changes
      }
      
      const handlePlay = () => setIsPlaying(true)
      const handlePause = () => setIsPlaying(false)
      const handleEnded = () => setIsPlaying(false)
      const handleError = () => {
        setIsPlaying(false)
        console.error('Audio playback error')
      }

      audio.addEventListener('play', handlePlay)
      audio.addEventListener('pause', handlePause)
      audio.addEventListener('ended', handleEnded)
      audio.addEventListener('error', handleError)

      return () => {
        audio.removeEventListener('play', handlePlay)
        audio.removeEventListener('pause', handlePause)
        audio.removeEventListener('ended', handleEnded)
        audio.removeEventListener('error', handleError)
      }
    } else if (!selectedTrack?.audioUrl) {
      // Reset playing state wenn kein audioUrl vorhanden
      setIsPlaying(false)
    }
  }, [selectedTrack])

  const handlePlayPause = async () => {
    if (!audioRef.current || !selectedTrack?.audioUrl) {
      console.warn('No audio element or audioUrl available')
      return
    }

    try {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        // Stelle sicher, dass src gesetzt ist
        if (audioRef.current.src !== selectedTrack.audioUrl) {
          audioRef.current.src = selectedTrack.audioUrl
        }
        await audioRef.current.play()
      }
    } catch (error) {
      console.error('Playback error:', error)
      setIsPlaying(false)
    }
  }

  const handleTrackSelect = (track: Song) => {
    // Stoppe aktuelles Audio wenn neuer Track ausgewählt wird
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      // Reset src um sicherzustellen, dass neuer Track geladen wird
      audioRef.current.src = ''
    }
    setSelectedTrack(track)
    setShowEmbed(false)
  }

  return (
    <div className="spotify-root" style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      <div className="spotify-header" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexShrink: 0 }}>
        <div className="spotify-cover" style={{ width: '80px', height: '80px', borderRadius: '12px', background: '#2a2b33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>🎵</div>
        <div className="spotify-meta">
          <div className="spotify-title" style={{ fontWeight: 700, fontSize: '24px', color: 'var(--text)', marginBottom: '4px' }}>Songs</div>
          <div style={{ fontSize: '13px', color: 'var(--muted)' }}>{songs.length} Tracks</div>
        </div>
      </div>

      {/* Audio-Element (versteckt) - immer vorhanden für bessere Kontrolle */}
      <audio ref={audioRef} style={{ display: 'none' }} />

      {/* Playlist - mit paddingBottom für Safe-Area */}
      <div className="spotify-queue" style={{ flex: 1, minHeight: 0, overflow: 'auto', marginBottom: 0, paddingBottom: selectedTrack ? '130px' : '0' }}>
        {songs.map((song) => (
          <div
            key={song.id}
            className={`spotify-track ${selectedTrack?.id === song.id ? 'active' : ''}`}
            onClick={() => handleTrackSelect(song)}
            style={{
              cursor: 'pointer',
              padding: '12px 16px',
              borderRadius: '10px',
              background: selectedTrack?.id === song.id ? '#2a2b33' : 'transparent',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (selectedTrack?.id !== song.id) {
                e.currentTarget.style.background = '#1e1f24'
              }
            }}
            onMouseLeave={(e) => {
              if (selectedTrack?.id !== song.id) {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            <div className="spotify-cover" style={{ width: '48px', height: '48px', fontSize: '20px', borderRadius: '6px', background: '#1e1f24', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {song.cover || '🎵'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text)', marginBottom: '4px' }}>{song.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.artist}</div>
            </div>
            {selectedTrack?.id === song.id && (
              <div style={{ fontSize: '18px', color: '#3b82f6' }}>
                {isPlaying ? '⏸' : '▶'}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Safe-Area Glass-Fläche (sichtbar wenn Track selected) */}
      {selectedTrack && (
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '130px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(14px) saturate(140%)',
          WebkitBackdropFilter: 'blur(14px) saturate(140%)',
          pointerEvents: 'none',
          zIndex: 5,
        }}>
          {/* Leichter Gradient-Fade oben für macOS-Style */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '30px',
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.08), transparent)',
            pointerEvents: 'none',
          }} />
        </div>
      )}

      {/* Bottom-Bar als Overlay */}
      {selectedTrack && (
        <div className="glassBar" style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          borderTop: '1px solid rgba(255, 255, 255, 0.14)',
          zIndex: 10,
        }}>
          {/* Header mit X-Button */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
              <div style={{ width: '60px', height: '60px', fontSize: '24px', borderRadius: '8px', background: 'rgba(42, 43, 51, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {selectedTrack.cover || '🎵'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '6px', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', opacity: 0.95 }}>{selectedTrack.title}</div>
                <div style={{ fontSize: '14px', color: 'var(--muted)', opacity: 0.9 }}>{selectedTrack.artist}</div>
              </div>
            </div>
            <button
              onClick={() => setSelectedTrack(null)}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                flexShrink: 0,
                transition: 'background 0.2s ease, color 0.2s ease, border-color 0.2s ease',
                padding: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.color = 'var(--text)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--muted)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
              }}
              title="Schließen"
            >
              ×
            </button>
          </div>

          {/* Playback Controls */}
          {selectedTrack.audioUrl ? (
            <button
              onClick={handlePlayPause}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                background: '#3b82f6',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 600,
                width: '100%',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#2563eb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#3b82f6'
              }}
            >
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
          ) : (
            <div style={{ fontSize: '13px', color: 'var(--muted)', fontStyle: 'italic', textAlign: 'center', padding: '12px' }}>
              Kein Audio verfügbar
            </div>
          )}

          {selectedTrack.embedUrl && !selectedTrack.audioUrl && (
            <div>
              {!showEmbed ? (
                <button
                  onClick={() => setShowEmbed(true)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    background: '#3b82f6',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: 600,
                    width: '100%',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#2563eb'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#3b82f6'
                  }}
                >
                  ▶ Open/Play
                </button>
              ) : (
                <div style={{ marginTop: '12px' }}>
                  <iframe
                    src={selectedTrack.embedUrl}
                    width="100%"
                    height="200"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    style={{ borderRadius: '8px' }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Rätsel-Hinweis für Universe */}
          {selectedTrack.id === 'universe' && (
            <div style={{ marginTop: '16px', padding: '14px', background: 'rgba(42, 43, 51, 0.5)', borderRadius: '8px', fontSize: '13px', color: 'var(--text)', lineHeight: 1.6, opacity: 0.95 }}>
              {(() => {
                const text = "De Tit**U** isch auä nid zuefällig."
                const parts = text.split(/(\*\*[A-Z]\*\*)/g).filter(p => p !== '')
                return parts.map((part, idx) => {
                  const boldMatch = part.match(/^\*\*([A-Z])\*\*$/)
                  if (boldMatch) {
                    return <strong key={idx} style={{ fontWeight: 700, color: 'inherit' }}>{boldMatch[1]}</strong>
                  }
                  return <span key={idx}>{part}</span>
                })
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
