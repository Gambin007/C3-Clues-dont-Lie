'use client'

import React, { useState, useRef, useEffect } from 'react'

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

interface MoviePlayerProps {
  src: string
  onEnded?: () => void
  autoPlay?: boolean
  preload?: 'metadata' | 'auto' | 'none'
}

export default function MoviePlayer({ src, onEnded, autoPlay = true, preload = 'metadata' }: MoviePlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isSeeking, setIsSeeking] = useState(false)
  const [controlsCollapsed, setControlsCollapsed] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(true)
  const mouseMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Event listeners for video
  useEffect(() => {
    if (!videoRef.current) return

    const video = videoRef.current

    const handleTimeUpdate = () => {
      if (!isSeeking && video) {
        setCurrentTime(video.currentTime)
        // Also update duration if it becomes available during playback
        if (video.duration && video.duration !== duration && !isNaN(video.duration) && isFinite(video.duration)) {
          setDuration(video.duration)
        }
      }
    }

    const handleLoadedMetadata = () => {
      if (video && video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
        setDuration(video.duration)
      }
    }

    const handleLoadedData = () => {
      if (video && video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
        setDuration(video.duration)
      }
    }

    const handleDurationChange = () => {
      if (video && video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
        setDuration(video.duration)
      }
    }

    const handleCanPlay = () => {
      if (video && video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
        setDuration(video.duration)
      }
    }

    const handleCanPlayThrough = () => {
      if (video && video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
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
      if (onEnded) {
        onEnded()
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('durationchange', handleDurationChange)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('canplaythrough', handleCanPlayThrough)
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
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('canplaythrough', handleCanPlayThrough)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [isSeeking, duration, onEnded])

  // Auto-hide controls when playing and mouse idle
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    const handleMouseMove = () => {
      setControlsVisible(true)
      if (mouseMoveTimeoutRef.current) {
        clearTimeout(mouseMoveTimeoutRef.current)
      }
      if (isPlaying) {
        mouseMoveTimeoutRef.current = setTimeout(() => {
          setControlsVisible(false)
        }, 2000)
      }
    }

    const handleMouseLeave = () => {
      if (isPlaying) {
        if (mouseMoveTimeoutRef.current) {
          clearTimeout(mouseMoveTimeoutRef.current)
        }
        mouseMoveTimeoutRef.current = setTimeout(() => {
          setControlsVisible(false)
        }, 2000)
      }
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    if (isPlaying) {
      mouseMoveTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false)
      }, 2000)
    } else {
      setControlsVisible(true)
    }

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
      if (mouseMoveTimeoutRef.current) {
        clearTimeout(mouseMoveTimeoutRef.current)
      }
    }
  }, [isPlaying])

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
    const newTime = parseFloat((e.target as HTMLInputElement).value)
    setCurrentTime(newTime)
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

  const handlePointerCancel = () => {
    if (videoRef.current && isSeeking) {
      videoRef.current.currentTime = currentTime
    }
    setIsSeeking(false)
  }

  const handleJumpBackward = () => {
    if (!videoRef.current) return
    const videoDuration = videoRef.current.duration || duration || Infinity
    const newTime = clamp(videoRef.current.currentTime - 10, 0, videoDuration)
    videoRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleJumpForward = () => {
    if (!videoRef.current) return
    const videoDuration = videoRef.current.duration || duration || Infinity
    const newTime = clamp(videoRef.current.currentTime + 10, 0, videoDuration)
    videoRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const toggleCollapse = () => {
    setControlsCollapsed(!controlsCollapsed)
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: '#000',
      }}
    >
      {/* Video - Fullscreen */}
      <video
        ref={videoRef}
        src={src}
        autoPlay={autoPlay}
        playsInline
        controls={false}
        preload={preload}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Controls Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 10,
          opacity: controlsVisible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: controlsVisible ? 'auto' : 'none',
        }}
      >
        {/* Glass Bar macOS Style */}
        <div
          style={{
            width: '90%',
            maxWidth: '700px',
            padding: controlsCollapsed ? '10px 16px' : '16px 20px',
            background: 'rgba(255, 255, 255, 0.10)',
            backdropFilter: 'blur(18px) saturate(160%)',
            WebkitBackdropFilter: 'blur(18px) saturate(160%)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: controlsCollapsed ? '0' : '12px',
            alignItems: 'center',
            transition: 'all 0.3s ease',
          }}
        >
          {/* Seek Bar - Hidden when collapsed */}
          {!controlsCollapsed && (
            <input
              type="range"
              min={0}
              max={duration > 0 ? duration : (videoRef.current?.duration || 100)}
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
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${duration > 0 ? ((currentTime / duration) * 100) : 0}%, rgba(255, 255, 255, 0.2) ${duration > 0 ? ((currentTime / duration) * 100) : 0}%, rgba(255, 255, 255, 0.2) 100%)`,
                outline: 'none',
                cursor: 'pointer',
                WebkitAppearance: 'none',
                appearance: 'none',
              }}
            />
          )}

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
            {/* Time Display - Hidden when collapsed */}
            {!controlsCollapsed && (
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
            )}

            {/* Compact Time Display when collapsed */}
            {controlsCollapsed && (
              <div
                style={{
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  minWidth: '60px',
                }}
              >
                {formatTime(currentTime)}
              </div>
            )}

            {/* Jump Backward Button - Hidden when collapsed */}
            {!controlsCollapsed && (
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
            )}

            {/* Play/Pause Button */}
            <button
              onClick={handlePlayPause}
              style={{
                padding: controlsCollapsed ? '8px 16px' : '10px 20px',
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '10px',
                color: 'rgba(255, 255, 255, 0.95)',
                cursor: 'pointer',
                fontSize: controlsCollapsed ? '14px' : '16px',
                fontWeight: 600,
                fontFamily: 'system-ui, -apple-system, sans-serif',
                minWidth: controlsCollapsed ? '60px' : '80px',
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
              {isPlaying ? '⏸' : '▶'}
            </button>

            {/* Jump Forward Button - Hidden when collapsed */}
            {!controlsCollapsed && (
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
            )}

            {/* Collapse/Expand Toggle Button */}
            <button
              onClick={toggleCollapse}
              style={{
                padding: '6px 10px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '6px',
                color: 'rgba(255, 255, 255, 0.9)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'system-ui, -apple-system, sans-serif',
                transition: 'all 0.2s ease',
                minWidth: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
              {controlsCollapsed ? '⌃' : '⌄'}
            </button>
          </div>
        </div>
      </div>

      {/* Minimal Handle when controls are hidden */}
      {!controlsVisible && (
        <div
          onClick={() => setControlsVisible(true)}
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '6px 12px',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            color: 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            fontSize: '12px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            zIndex: 10,
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
          • • •
        </div>
      )}
    </div>
  )
}
