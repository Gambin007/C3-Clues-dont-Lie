'use client'

import { useState, useRef, useEffect } from 'react'
import Navbar from '@/components/Navbar'

// Device detection helper
const isMobileOrTablet = () => {
  // Check user agent for mobile patterns
  const userAgent = navigator.userAgent || navigator.vendor || window.opera
  const mobilePatterns = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
  const isMobileUA = mobilePatterns.test(userAgent.toLowerCase())

  // Check for touch/coarse pointer (tablets and phones)
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches

  // Check screen width (tablets typically < 1024px)
  const isSmallScreen = window.innerWidth < 1024

  // Device is mobile/tablet if any of these conditions are true
  return isMobileUA || (hasCoarsePointer && isSmallScreen)
}

export default function Demo() {
  const [isMuted, setIsMuted] = useState(true)
  const [showMobileBlockModal, setShowMobileBlockModal] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)
  const videoRef = useRef(null)

  // Check device type on mount and window resize
  useEffect(() => {
    const checkDevice = () => {
      setIsDesktop(!isMobileOrTablet())
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)

    return () => {
      window.removeEventListener('resize', checkDevice)
    }
  }, [])

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleStartExperience = (e) => {
    if (!isDesktop) {
      e.preventDefault()
      setShowMobileBlockModal(true)
    }
    // If desktop, allow normal navigation
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-black">
      <Navbar />
      
      <div className="h-[calc(100vh-11rem)] flex flex-col md:flex-row">
        {/* Left side - Title and Description */}
        <div className="w-full md:w-[38%] flex items-center justify-center px-8 md:px-12 lg:px-16 relative z-10">
          <div className="max-w-xl pt-24 md:pt-28 lg:pt-32">
            <div className="inline-flex items-center gap-2 px-6 py-2 border-2 border-white bg-transparent text-white font-semibold rounded-full mt-70">
              <span className="w-2 h-2 bg-[#FE4A2C] rounded-full animate-ping pl-2"></span>
              Demo Out Now
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-10 mb-6 bungee-regular leading-tight">
              Clues<br />Don't Lie
            </h1>
            
            <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-10">
            Eine spielbare Mockumentary-Filmerfahrung, die Zuschauer einlädt, gemeinsam Rätsel zu lösen und Stück für Stück die Geschichte freizuschalten.
            Als desktop-basierte, interaktive Experience verbindet das Projekt eine Schweizerdeutsche Story mit Webtechnologie und filmischer Inszenierung.
            Entwickelt für ein bis zwei Personen, die neugierig sind, Spuren zu lesen, Zusammenhänge zu hinterfragen und aktiv Teil der Erzählung zu werden.
            </p>
            
            <a
              href="/experience"
              onClick={handleStartExperience}
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
            src="/media/trailer.mp4"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-105 mt-8 md:mt-0"
          />
          
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

      {/* Mobile/Tablet Block Modal */}
      {showMobileBlockModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setShowMobileBlockModal(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
          
          {/* Modal */}
          <div
            className="relative z-10 bg-black/80 backdrop-blur-xl border-2 border-white/20 rounded-2xl p-8 md:p-10 max-w-md mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowMobileBlockModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              aria-label="Schließen"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Desktop Only
              </h2>
              <p className="text-base md:text-lg text-gray-300 mb-2 leading-relaxed">
                Diese Experience ist nur auf einem Desktop-Gerät verfügbar.
              </p>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                Bitte öffne sie auf einem Computer für das beste Erlebnis.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
