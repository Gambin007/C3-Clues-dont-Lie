'use client'

import { useRouter } from 'next/navigation'
import { useExperience } from '@/contexts/ExperienceContext'
import MoviePlayer from '@/components/movie/MoviePlayer'

export default function MoviePart1Page() {
  const router = useRouter()
  const { markMovie1Done } = useExperience()

  const handleMovieEnded = () => {
    markMovie1Done()
    router.push('/experience')
  }

  return <MoviePlayer src="/media/movie/part1.mp4" onEnded={handleMovieEnded} />
}
