'use client'

import React from 'react'
import './styles/globals.css'

// Importiere die Root-Komponente deines Interfaces.
// Du hast gesagt: interface/app/page.js orchestriert alles.
// Das soll jetzt die "Root UI Komponente" sein.
// Importiere sie als Komponente (nicht als Next route).

import Home from './app/page'  // ggf. Pfad anpassen, aber keine Logik ändern

// Falls Provider global gebraucht:
// WindowProvider und PuzzleProvider sind in /features/interface/contexts/... vorhanden.
// Wrappe NUR hier. Keine Provider-Logik verändern, nur importieren und verwenden.

// NOTE: Die Provider sind bereits in Home eingebaut, daher hier nicht nochmal wrappen
// Falls nötig, können sie hier zusätzlich gewrappt werden, aber aktuell sind sie schon in Home

export default function InterfaceMount() {
  return (
    <div className="desktop-root" style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Home />
    </div>
  )
}
