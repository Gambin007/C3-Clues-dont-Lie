'use client'

import Navbar from '@/components/Navbar'

export default function UnterstuetzenPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20">
        {/* Animated background shapes with logo colors */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#00C4FF]/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFC32E]/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-[#FE4A2C]/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight bungee-regular">
            Unterstütze uns
          </h1>
          
          {/* Text */}
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          bei der Realisierung unserer kreativen Projekte. Jeder Beitrag hilft uns, innovative digitale Erlebnisse zu schaffen und neue Geschichten zum Leben zu erwecken.
          </p>

          {/* TWINT Button Card */}
          <div className="flex justify-center">
              <a
                href="https://go.twint.ch/1/e/tw?tw=acq.WvUYjGSWQbubwPI8bbZmoGsX7OlstlpTH76N9Y_S6K2npGd5l7Osj7wcOlPpI30U."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-transform duration-300 hover:scale-105"
              >
                <img
                  src="https://go.twint.ch/static/img/button_light_de.svg"
                  alt="TWINT Spenden Button"
                  height="58"
                  className="mx-auto"
                />
              </a>
          </div>
        </div>
      </section>
    </main>
  )
}
