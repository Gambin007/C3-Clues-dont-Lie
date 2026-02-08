'use client'

import Link from 'next/link'
import { useExperience } from '@/contexts/ExperienceContext'

export default function BelaPage() {
  const { markBelaDone } = useExperience()

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bungee-regular">
          Rätselblock 2 – Bela
        </h1>

        <div className="border border-white rounded-lg p-8 mb-8">
          <p className="text-lg text-gray-300 mb-6">
            Zweiter Rätselblock der Experience. Hier wird später der Bela-Block integriert.
          </p>

          <div className="space-y-4">
            <button
              onClick={markBelaDone}
              className="px-6 py-3 border-2 border-white bg-transparent text-white font-semibold rounded-full hover:border-glow-gradient transition-all duration-300 hover:scale-105"
            >
              Simulate Bela Completed
            </button>

            <div>
              <Link
                href="/experience"
                className="inline-block text-gray-400 hover:text-white transition-colors duration-300"
              >
                ← Zurück zum Experience Hub
              </Link>
            </div>
          </div>
        </div>

        <div className="border border-gray-600 rounded-lg p-6 bg-gray-900/20">
          <h2 className="text-xl font-bold mb-4">Migration Info</h2>
          <p className="text-sm text-gray-400">
            Diese Seite ist der Mount-Point für den Bela-Block. Nach der Migration wird hier der
            Bela-Inhalt integriert.
          </p>
        </div>
      </div>
    </div>
  )
}
