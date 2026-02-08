'use client'

import { useRouter } from 'next/navigation'
import { useExperience } from '@/contexts/ExperienceContext'
import MoviePlayer from '@/components/movie/MoviePlayer'

export default function MoviePart2Page() {
  const router = useRouter()
  const { markMovie2Done } = useExperience()

  const handleMovieEnded = () => {
    markMovie2Done()
    router.push('/experience/bela')
  }

  return <MoviePlayer src="/media/movie/part2.mp4" onEnded={handleMovieEnded} />
}
