'use client'

import { useRouter } from 'next/navigation'
import { useExperience } from '@/contexts/ExperienceContext'
import MoviePlayer from '@/components/movie/MoviePlayer'

export default function MoviePart3Page() {
  const router = useRouter()
  const { markMovie3Done } = useExperience()

  const handleMovieEnded = () => {
    markMovie3Done()
    router.push('/experience')
  }

  return <MoviePlayer src="/media/movie/part3.mp4" onEnded={handleMovieEnded} />
}
