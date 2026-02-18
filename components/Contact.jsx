const Contact = () => {
  return (
    <section id="contact" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Animated background shapes with logo colors - different positions */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-20 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-[#FE4A2C]/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 left-20 w-56 sm:w-72 md:w-96 h-56 sm:h-72 md:h-96 bg-[#00C4FF]/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-40 sm:w-56 md:w-72 h-40 sm:h-56 md:h-72 bg-[#FFC32E]/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-[#FE4A2C]/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/4 left-1/2 w-44 sm:w-64 md:w-88 h-44 sm:h-64 md:h-88 bg-[#00C4FF]/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute bottom-1/2 right-1/5 w-40 sm:w-56 md:w-72 h-40 sm:h-56 md:h-72 bg-[#FFC32E]/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '4.5s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="p-6 sm:p-8 md:p-12 lg:p-16 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-5 md:mb-6 text-white bungee-regular px-2">
              Möchtest du mit uns zusammenarbeiten?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto px-2">
              Hast du ein Projekt im Kopf? Wir würden gerne von dir hören. Melde dich und lass uns gemeinsam etwas Grossartiges schaffen.
            </p>
            <a
              href="mailto:kontakt@c3-studios.ch"
              className="inline-block px-6 sm:px-8 py-3 sm:py-4 border-2 border-white bg-transparent text-white text-sm sm:text-base font-semibold rounded-full hover:border-glow-gradient transition-all duration-300 hover:scale-105"
            >
              Kontakt aufnehmen
            </a>
          </div>
        </div>
      </div>
      
      <footer className="mt-12 sm:mt-16 md:mt-20 text-center text-gray-500 text-xs sm:text-sm relative z-10 px-4">
        <a
          href="/impressum"
          className="text-gray-500 hover:text-white transition-colors duration-300 block mt-2"
        >
          Impressum
        </a>
        <p className="mt-2">&copy; 2026 C³. Alle Rechte vorbehalten.</p>
      </footer>
    </section>
  )
}

export default Contact
