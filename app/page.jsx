import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Projects from '@/components/Projects'
import Team from '@/components/Team'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <Projects />
      <Team />
      <Contact />
    </main>
  )
}
