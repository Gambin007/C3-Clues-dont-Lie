'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import MoviePlayer from '@/components/MoviePlayer'

export default function MoviePart2Page() {
  const router = useRouter()

  const handleVideoEnded = () => {
    router.push('/experience/bela/chat')
  }

  return (
    <MoviePlayer
      src="/media/movie/part2.mp4"
      onEnded={handleVideoEnded}
      autoPlay={true}
      preload="metadata"
    />
  )
}
