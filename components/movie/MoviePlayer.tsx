'use client'

import { useRef, useEffect } from 'react'

interface MoviePlayerProps {
  src: string
  onEnded?: () => void
}

export default function MoviePlayer({ src, onEnded }: MoviePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleEnded = () => {
      if (onEnded) {
        onEnded()
      }
    }

    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('ended', handleEnded)
    }
  }, [onEnded])

  return (
    <div className="fixed inset-0 bg-black z-50">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        controls
        playsInline
        className="w-full h-full object-contain"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
