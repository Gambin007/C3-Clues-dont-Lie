'use client'

import { useState, useRef } from 'react'
import Navbar from '@/components/Navbar'

export default function Demo() {
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef(null)

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-black">
      <Navbar />
      
      <div className="h-[calc(100vh-11rem)] flex flex-col md:flex-row">
        {/* Left side - Title and Description */}
        <div className="w-full md:w-[38%] flex items-center justify-center px-8 md:px-12 lg:px-16 relative z-10">
          <div className="max-w-xl pt-24 md:pt-28 lg:pt-32">
            <div className="inline-flex items-center gap-2 px-6 py-2 border-2 border-white bg-transparent text-white font-semibold rounded-full mt-70">
              <span className="w-2 h-2 bg-[#FE4A2C] rounded-full animate-ping"></span>
              Out Now
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-10 mb-6 bungee-regular leading-tight">
              Clues<br />Don't Lie
            </h1>
            
            <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-10">
            Eine spielbare Mockumentary-Filmerfahrung, die Zuschauer einlädt, gemeinsam Rätsel zu lösen und Stück für Stück die Geschichte freizuschalten.
            Als desktop-basierte, interaktive Experience verbindet das Projekt Schweizer Storytelling mit Webtechnologie und filmischer Inszenierung.
            Entwickelt für ein bis zwei Personen, die neugierig sind, Spuren zu lesen, Zusammenhänge zu hinterfragen und aktiv Teil der Erzählung zu werden.
            </p>
            
            <a
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white bg-transparent text-white font-semibold rounded-full hover:border-glow-gradient transition-all duration-300 hover:scale-105"
            >
              Film Experience starten
              <span className="text-xl">→</span>
            </a>
          </div>
        </div>

        {/* Right side - Video background */}
        <div className="w-full md:w-[62%] relative overflow-hidden h-full">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-105"
          >
            <source src="/media/trailer.mp4" type="video/mp4" />
          </video>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20"></div>
          
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
        </div>
      </div>
    </div>
  )
}
