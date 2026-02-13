const Contact = () => {
  return (
    <section id="contact" className="py-24 px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Animated background shapes with logo colors - different positions */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-20 w-80 h-80 bg-[#FE4A2C]/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-[#00C4FF]/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-[#FFC32E]/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-[#FE4A2C]/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/4 left-1/2 w-88 h-88 bg-[#00C4FF]/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute bottom-1/2 right-1/5 w-72 h-72 bg-[#FFC32E]/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '4.5s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="p-12 md:p-16 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white bungee-regular">
              Möchtest du mit uns zusammenarbeiten?
            </h2>
            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Hast du ein Projekt im Kopf? Wir würden gerne von dir hören. Melde dich und lass uns gemeinsam etwas Grossartiges schaffen.
            </p>
            <a
              href="mailto:kontakt@c3-studios.ch"
              className="px-8 py-4 border-2 border-white bg-transparent text-white font-semibold rounded-full hover:border-glow-gradient transition-all duration-300 hover:scale-105"
            >
              Kontakt aufnehmen
            </a>
          </div>
        </div>
      </div>
      
      <footer className="mt-20 text-center text-gray-500 text-sm relative z-10">
        <p>&copy; 2025 C³. Alle Rechte vorbehalten.</p>
      </footer>
    </section>
  )
}

export default Contact
