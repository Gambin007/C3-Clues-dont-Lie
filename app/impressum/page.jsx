'use client'

import Navbar from '@/components/Navbar'

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      
      <section className="min-h-screen py-20 px-6 mt-5 bg-black">
        <div className="max-w-3xl mx-auto text-white">
          <h1 className="text-4xl font-bold mb-8">Impressum</h1>
          
          <div className="text-gray-300 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Verantwortlich für den Inhalt (Studienprojekt):
              </h2>
              <p>
                C³ Studios (Bachelorprojekt)<br />
                c/o SAE Institute Zürich<br />
                Buckhauserstrasse 24<br />
                8048 Zürich<br />
                Schweiz
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Kontakt:</h2>
              <p>
                E-Mail: <a href="mailto:kontakt@c3-studios.ch" className="text-white hover:text-gray-400 transition-colors duration-300 underline">kontakt@c3-studios.ch</a><br />
              </p>
            </div>
       
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Hinweis:</h2>
              <p>Dieses Projekt wurde im Rahmen des Bachelorstudiums an der oben genannten Bildungsinstitution realisiert. Die angegebene Adresse dient ausschliesslich als Kontakt- und Zustelladresse im Zusammenhang mit dem Studienprojekt.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Vertretungsberechtigte Personen / Projektverantwortliche:</h2>
              <p>Thalia Novoa Seoane, Philippe Hafen, Larissa Dietemann, Noé Schertenleib, Sara Wittwer, Marco Camardella</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Haftungsausschluss:</h2>
              <p>
                Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit 
                und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir 
                gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. 
                Als Diensteanbieter sind wir jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen 
                zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen 
                zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
