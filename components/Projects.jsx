'use client'

import { useState, useRef } from 'react'

const Projects = () => {
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef(null)

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <section id="projects" className="py-32 md:py-40 px-6 lg:px-8 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="rounded-3xl p-10 md:p-14 lg:p-20 bg-black/50 backdrop-blur-sm border border-white relative overflow-hidden">
          {/* Video background inside the card */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover opacity-90 scale-110"
            >
              <source src="/media/trailer.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Out now badge - top */}
          <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20">
            <span className="inline-flex items-center gap-2 px-6 py-2 border-2 border-white bg-transparent text-white font-semibold rounded-full"
            >
              <span className="w-2 h-2 bg-[#FE4A2C] rounded-full animate-ping"></span>
              Clues Don't Lie | Out Now
            </span>
          </div>

          {/* Audio button - bottom right */}
          <button
            onClick={toggleAudio}
            className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-20 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border-2 border-white text-white flex items-center justify-center hover:bg-white/10 transition-all duration-300 hover:scale-110"
            aria-label={isMuted ? 'Audio einschalten' : 'Audio ausschalten'}
          >
            {isMuted ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>

          {/* Demo button - bottom left */}
          <a
            href="/demo"
            className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-20 inline-flex items-center gap-2 px-8 py-4 border-2 border-white bg-transparent text-white font-semibold rounded-full hover:border-glow-gradient transition-all duration-300 hover:scale-105"
          >
            Demo
            <span className="text-xl">→</span>
          </a>

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full min-h-[420px] md:min-h-[480px]">
            <div className="flex-1"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Projects
