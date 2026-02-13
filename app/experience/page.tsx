'use client'

import React, { useState } from 'react'
import InterfaceMount from '@/features/interface/InterfaceMount'
import MoviePlayer from '@/components/MoviePlayer'

export default function ExperiencePage() {
  const [phase, setPhase] = useState<'movie1' | 'interface'>('movie1')

  const handleVideoEnded = () => {
    setPhase('interface')
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {phase === 'movie1' ? (
        <MoviePlayer
          src="/media/movie/part1.mp4"
          onEnded={handleVideoEnded}
          autoPlay={true}
          preload="metadata"
        />
      ) : (
        <InterfaceMount />
      )}
    </div>
  )
}
