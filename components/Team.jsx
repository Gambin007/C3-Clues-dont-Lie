const Team = () => {
  const teamMembers = [
    {
      name: 'Thalia',
      role: 'Lead Management',
      image: '/media/Team/Thalianormal.jpg'.replace(/ /g, '%20'),
      hoverImage: '/media/Team/ThaliaLupe.jpg'.replace(/ /g, '%20'),
      hoverColor: '#00c4ff',
    },
    {
      name: 'Philippe',
      role: 'Lead UX/UI Design',
      image: '/media/Team/Philippenormal.jpg'.replace(/ /g, '%20'),
      hoverImage: '/media/Team/PhilippeLupe.jpg'.replace(/ /g, '%20'),
      hoverColor: '#fe4a2c',
    },
    {
      name: 'Larissa',
      role: 'Lead Story',
      image: '/media/Team/Larissanormal.jpg'.replace(/ /g, '%20'),
      hoverImage: '/media/Team/LarissaLupe.jpg'.replace(/ /g, '%20'),
      hoverColor: '#ffc32e',
    },
    {
      name: 'Noé',
      role: 'Lead Development',
      image: '/media/Team/Noenormal.jpg'.replace(/ /g, '%20'),
      hoverImage: '/media/Team/NoeLupe.jpg'.replace(/ /g, '%20'),
      hoverColor: '#fe4a2c',
    },
    {
      name: 'Sara',
      role: 'Lead Cinematography',
      image: '/media/Team/Saranormal.jpg'.replace(/ /g, '%20'),
      hoverImage: '/media/Team/SaraLupe.jpg'.replace(/ /g, '%20'),
      hoverColor: '#ffc32e',
    },
    {
      name: 'Marco',
      role: 'Lead Marketing',
      image: '/media/Team/Marconormal.jpg'.replace(/ /g, '%20'),
      hoverImage: '/media/Team/MarcoLupe.jpg'.replace(/ /g, '%20'),
      hoverColor: '#00c4ff',
    },
  ]

  return (
    <section id="team" className="py-24 px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16 text-white bungee-regular">
          Unser Team
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-black p-6 rounded-2xl border border-white transition-all duration-300 hover:scale-105 group team-card"
              style={{ '--card-hover-color': member.hoverColor }}
            >
              {/* Image swap normal → Lupe on hover */}
              <div className="w-full aspect-square mb-4 rounded-xl overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-opacity duration-300 group-hover:hidden block"
                />
                <img
                  src={member.hoverImage}
                  alt={member.name + ' Lupe'}
                  className="w-full h-full object-cover transition-opacity duration-300 hidden group-hover:block"
                />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {member.name}
              </h3>
              <p className="text-gray-400 font-semibold text-sm">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Team
