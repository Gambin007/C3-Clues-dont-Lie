'use client'

const Hero = () => {
  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Animated background shapes with logo colors - brighter */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#00C4FF]/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFC32E]/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-[#FE4A2C]/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-[#00C4FF]/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-56 h-56 bg-[#FFC32E]/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-[#FE4A2C]/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '5s' }}></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
        <h1 className="text-2xl md:text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight bungee-regular">
          Wir schaffen cinematische Erlebnisse, die zum Nachdenken anregen.
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
          Ein kreatives Studentenkollektiv, das Film, Web und Content vereint, um überzeugende digitale Erlebnisse zu schaffen.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#projects"
            onClick={(e) => handleSmoothScroll(e, 'projects')}
            className="px-8 py-4 border-2 border-white bg-transparent text-white font-semibold rounded-full hover:border-glow-gradient transition-all duration-300 hover:scale-105"
          >
            Projekt ansehen
          </a>
          <a
            href="#team"
            onClick={(e) => handleSmoothScroll(e, 'team')}
            className="px-8 py-4 border-2 border-white bg-transparent text-white font-semibold rounded-full hover:border-glow-gradient transition-all duration-300 hover:scale-105"
          >
            Team kennenlernen
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
