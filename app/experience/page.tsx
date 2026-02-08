'use client'

import React, { useState, useRef, useEffect } from 'react'
import InterfaceMount from '@/features/interface/InterfaceMount'

// Helper: Format seconds to mm:ss
const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || !isFinite(seconds)) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

// Helper: Clamp value between min and max
const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

export default function ExperiencePage() {
  const [phase, setPhase] = useState<'movie1' | 'interface'>('movie1')
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isSeeking, setIsSeeking] = useState(false)

  // Event listeners for video
  useEffect(() => {
    if (phase !== 'movie1' || !videoRef.current) return

    const video = videoRef.current

    const handleTimeUpdate = () => {
      if (!isSeeking && video) {
        setCurrentTime(video.currentTime)
      }
    }

    const handleLoadedMetadata = () => {
      if (video && video.duration) {
        setDuration(video.duration)
      }
    }

    const handleLoadedData = () => {
      if (video && video.duration) {
        setDuration(video.duration)
      }
    }

    const handleDurationChange = () => {
      if (video && video.duration) {
        setDuration(video.duration)
      }
    }

    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setPhase('interface')
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('durationchange', handleDurationChange)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    // Set initial playing state and duration if available
    setIsPlaying(!video.paused)
    if (video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
      setDuration(video.duration)
    }

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('durationchange', handleDurationChange)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [phase, isSeeking])

  const handlePlayPause = async () => {
    if (!videoRef.current) return

    try {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        await videoRef.current.play()
      }
    } catch (error) {
      console.error('Playback error:', error)
    }
  }

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    // Update video immediately when seeking
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
    }
  }

  const handleSeekStart = () => {
    setIsSeeking(true)
  }

  const handleSeekEnd = (e: React.PointerEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = parseFloat((e.target as HTMLInputElement).value)
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
    setIsSeeking(false)
  }

  // Handle pointer cancel (when user drags outside the element)
  const handlePointerCancel = () => {
    if (videoRef.current && isSeeking) {
      videoRef.current.currentTime = currentTime
    }
    setIsSeeking(false)
  }

  const handleJumpBackward = () => {
    if (!videoRef.current) return
    const currentVideoTime = videoRef.current.currentTime
    const newTime = Math.max(0, currentVideoTime - 10)
    videoRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleJumpForward = () => {
    if (!videoRef.current) return
    const currentVideoTime = videoRef.current.currentTime
    const maxTime = duration || videoRef.current.duration || Infinity
    const newTime = Math.min(maxTime, currentVideoTime + 10)
    videoRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative' }}>
      {phase === 'movie1' ? (
        <>
          <div style={{ width: '100%', height: '100%', paddingBottom: '110px' }}>
            <video
              ref={videoRef}
              src="/media/movie/part1.mp4"
              autoPlay
              playsInline
              controls={false}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          
          {/* Video Controls - Glass Bar macOS Style */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90%',
              maxWidth: '700px',
              padding: '16px 20px',
              background: 'rgba(255, 255, 255, 0.10)',
              backdropFilter: 'blur(18px) saturate(160%)',
              WebkitBackdropFilter: 'blur(18px) saturate(160%)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              alignItems: 'center',
              zIndex: 10,
            }}
          >
            {/* Seek Bar */}
            <input
              type="range"
              min={0}
              max={duration > 0 ? duration : 100}
              value={currentTime}
              step={0.1}
              onChange={handleSeekChange}
              onPointerDown={handleSeekStart}
              onPointerUp={handleSeekEnd}
              onPointerCancel={handlePointerCancel}
              onMouseDown={handleSeekStart}
              onMouseUp={handleSeekEnd}
              onMouseLeave={(e) => {
                if (isSeeking) {
                  handleSeekEnd(e as any)
                }
              }}
              onTouchStart={handleSeekStart}
              onTouchEnd={handleSeekEnd}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: 'rgba(255, 255, 255, 0.2)',
                outline: 'none',
                cursor: 'pointer',
                WebkitAppearance: 'none',
                appearance: 'none',
              }}
            />

            {/* Controls Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                gap: '12px',
              }}
            >
              {/* Time Display */}
              <div
                style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  minWidth: '80px',
                }}
              >
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              {/* Jump Backward Button */}
              <button
                onClick={handleJumpBackward}
                style={{
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'
                }}
              >
                −10s
              </button>

              {/* Play/Pause Button */}
              <button
                onClick={handlePlayPause}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  borderRadius: '10px',
                  color: 'rgba(255, 255, 255, 0.95)',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 600,
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  minWidth: '80px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.22)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)'
                }}
              >
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>

              {/* Jump Forward Button */}
              <button
                onClick={handleJumpForward}
                style={{
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'
                }}
              >
                +10s
              </button>
            </div>
          </div>
        </>
      ) : (
        <InterfaceMount />
      )}
    </div>
  )
}
