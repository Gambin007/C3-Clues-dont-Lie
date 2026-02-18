'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import MoviePlayer from '@/components/MoviePlayer'

export default function MoviePart3Page() {
  const router = useRouter()

  const handleVideoEnded = () => {
    router.push('/unterstuetzen')
  }

  return (
    <MoviePlayer
      src="/media/movie/part3.mp4"
      onEnded={handleVideoEnded}
      autoPlay={true}
      preload="metadata"
    />
  )
}
