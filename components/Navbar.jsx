'use client'

import { useEffect, useState } from 'react'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleNavClick = (e, targetId) => {
    if (window.location.pathname === '/') {
      // Auf Home-Seite: Smooth Scroll
      e.preventDefault()
      handleSmoothScroll(e, targetId)
    } else {
      // Auf anderer Seite: Zur Home-Seite mit Hash navigieren
      window.location.href = `/#${targetId}`
    }
  }

  const logoGradientStyle = {
    backgroundImage:
      'linear-gradient(135deg, #fe4a2c 0%, #fe4a2c 33%, #ffc32e 33%, #ffc32e 66%, #00c4ff 66%, #00c4ff 100%)',
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a 
            href="/"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault()
                handleSmoothScroll(e, 'home')
              }
            }}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-12 h-12 group-hover:scale-110 transition-transform duration-300">
              <img
                src="/media/logo/logo white.svg"
                alt="C³ Studio Logo"
                className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300 opacity-100 group-hover:opacity-0"
              />
              <img
                src="/media/logo/logo.svg"
                alt="C³ Studio Logo Farbig"
                className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300 opacity-0 group-hover:opacity-100 drop-shadow-[0_0_15px_rgba(0,196,255,0.6),0_0_25px_rgba(255,195,46,0.4),0_0_35px_rgba(254,74,44,0.3)]"
              />
            </div>
          </a>
          
          <ul className="hidden md:flex items-center space-x-8">
            <li>
              <a 
                href="/demo" 
                className="text-gray-300 transition-colors duration-300 relative group"
              >
                Clues Don't Lie
                <span
                  className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                  style={logoGradientStyle}
                ></span>
              </a>
            </li>
            <li>
              <a 
                href="/#team" 
                onClick={(e) => handleNavClick(e, 'team')}
                className="text-gray-300 transition-colors duration-300 relative group"
              >
                Team
                <span
                  className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                  style={logoGradientStyle}
                ></span>
              </a>
            </li>
            <li>
              <a 
                href="/#contact" 
                onClick={(e) => handleNavClick(e, 'contact')}
                className="text-gray-300 transition-colors duration-300 relative group"
              >
                Kontakt
                <span
                  className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                  style={logoGradientStyle}
                ></span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
