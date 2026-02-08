'use client'

import { useState, useEffect, useRef } from 'react'
import { usePuzzle } from '@interface/contexts/PuzzleContext'

interface Note {
  id: string
  title: string
  content: string
  date: string
}

const INITIAL_NOTES: Note[] = [
  {
    id: 'ideen',
    title: 'Ideen',
    content: 'Artikel über lokale Politik\nInterview mit Stadtrat\nRecherche zu Bauprojekt',
    date: 'Gestern 18:00',
  },
  {
    id: 'recherche',
    title: 'Recherche',
    content: 'Quelle A: bestätigt\nQuelle B: noch offen\nTreffe Quelle – Bahnhof?',
    date: 'Gestern 14:20',
  },
  {
    id: 'liste',
    title: 'Liste',
    content: `Lass es nicht offen liegen.
Ich vertraue niemandem.
Sie hören mit.
Aber ich muss was tun.`,
    date: 'Gestern 16:00',
  },
  {
    id: 'lernplan',
    title: 'Lernplan',
    content: `Lies die Kapitel durch
Lerne die Formeln auswendig
Lass nichts aus
Lies nochmal nach
Lerne systematisch`,
    date: 'Gestern 16:30',
  },
  {
    id: 'to-do',
    title: 'To-do',
    content: `Termine koordinieren
Treffen vorbereiten
Texte überarbeiten
Themen recherchieren
Tatsachen prüfen`,
    date: 'Gestern 10:15',
  },
  {
    id: 'codewort-terminal',
    title: 'ARCHIV',
    content: `> Wenn du das Wort zusammengesetzt hast,  
> probier es im Terminal.
>
> unlock <CODEWORT>
>
> um das Archiv freizuschalten.`,
    date: 'Gestern 17:00',
  },
  {
    id: 'nicht-liegen-lassen',
    title: 'Nicht liegen lassen',
    content: `> Drei Zeichen hast du gefunden.  
> Nicht auf einmal. Nicht am selben Ort.  
>
> Das vierte wartet nicht dort,  
> wo man es zuerst suchen würde.  
>
> Es liegt am Ende dessen,  
> was ich mir noch aufzuschreiben wagte.  
>
> Zähle nicht Schritte.  
> Zähle nicht Versuche.  
>
> Lies bis nichts mehr folgt.  
>
> **L**eise.`,
    date: 'Gestern 16:45',
  },
  {
    id: 'interviewfragen',
    title: 'Interviewfragen',
    content: '1. Wie sehen Sie die Entwicklung?\n2. Was sind die größten Herausforderungen?\n3. Welche Pläne gibt es?',
    date: 'Vor 2 Tagen 09:00',
  },
  {
    id: 'einkauf',
    title: 'Einkauf',
    content: 'Milch\nBrot\nEier\nKäse',
    date: 'Vor 2 Tagen 18:00',
  },
  {
    id: 'reise',
    title: 'Reise',
    content: 'Zugticket buchen\nHotel reservieren\nTermine koordinieren',
    date: 'Vor 3 Tagen 11:30',
  },
  {
    id: 'artikelstruktur',
    title: 'Artikelstruktur',
    content: 'Einleitung\nHauptteil\nFazit\nQuellen',
    date: 'Vor 3 Tagen 15:45',
  },
  {
    id: 'melina-check',
    title: 'Melina: Check-in',
    content: 'Status prüfen\nNotizen teilen\nDeadline besprechen',
    date: 'Vor 4 Tagen 13:20',
  },
  {
    id: 'quellen',
    title: 'Quellen',
    content: 'Quelle 1: Interview\nQuelle 2: Dokumente\nQuelle 3: Recherche',
    date: 'Vor 5 Tagen 10:00',
  },
  {
    id: 'deadlines',
    title: 'Deadlines',
    content: 'Artikel 1: 20.01\nArtikel 2: 25.01\nArtikel 3: 30.01',
    date: 'Vor 6 Tagen 09:00',
  },
  {
    id: 'notizen-ordnen',
    title: 'Notizen ordnen',
    content: 'Themen sortieren\nWichtiges markieren\nStruktur festlegen',
    date: 'Vor 7 Tagen 16:00',
  },
  {
    id: 'treffen',
    title: 'Treffen',
    content: 'Mit Redaktion besprechen\nTermine koordinieren\nRessourcen klären',
    date: 'Vor 8 Tagen 14:30',
  },
]

export default function Notes({ windowId }: { windowId: string }) {
  const { markLFound } = usePuzzle()
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [editingContent, setEditingContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [hasSeenLernplan, setHasSeenLernplan] = useState(false)
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null)

  // Sortiere Notizen chronologisch (neueste zuerst)
  // Neue Notizen (mit ID note-*) kommen immer ganz oben
  const sortedNotes = [...notes].sort((a, b) => {
    const aIsNew = a.id.startsWith('note-')
    const bIsNew = b.id.startsWith('note-')
    
    // Neue Notizen immer ganz oben
    if (aIsNew && !bIsNew) return -1
    if (!aIsNew && bIsNew) return 1
    if (aIsNew && bIsNew) {
      // Unter neuen Notizen: neueste zuerst (höhere ID = neuer)
      return b.id.localeCompare(a.id)
    }
    
    // Bestehende Notizen: chronologisch sortieren
    // "Gestern 18:00" kommt vor "Gestern 16:00" etc.
    // "Heute" kommt vor "Gestern", "Gestern" vor "Vor X Tagen"
    const dateOrder = (date: string) => {
      if (date.startsWith('Heute')) return 1000
      if (date.startsWith('Gestern')) {
        const timeMatch = date.match(/(\d{2}):(\d{2})/)
        if (timeMatch) {
          const hours = parseInt(timeMatch[1])
          const minutes = parseInt(timeMatch[2])
          return 900 + hours * 60 + minutes
        }
        return 900
      }
      const daysMatch = date.match(/Vor (\d+) Tagen/)
      if (daysMatch) {
        const days = parseInt(daysMatch[1])
        return 100 - days
      }
      return 0
    }
    
    return dateOrder(b.date) - dateOrder(a.date)
  })

  const selected = notes.find(n => n.id === selectedId) || sortedNotes[0]

  useEffect(() => {
    // Markiere L als gefunden, wenn "Lernplan" Notiz gesehen wurde (Akrostichon mit L-Buchstaben)
    if (selected?.id === 'lernplan' && !hasSeenLernplan) {
      markLFound()
      setHasSeenLernplan(true)
    }
  }, [selected, hasSeenLernplan, markLFound])

  useEffect(() => {
    // Setze initial selectedId auf erste Notiz
    if (!selectedId && sortedNotes.length > 0) {
      setSelectedId(sortedNotes[0].id)
    }
  }, [selectedId, sortedNotes])

  useEffect(() => {
    // Wenn Notiz ausgewählt wird, lade Titel und Content für Editing
    if (selected) {
      setEditingTitle(selected.title)
      setEditingContent(selected.content)
      setIsEditing(false)
    }
  }, [selected])

  const handleCreateNote = () => {
    const newId = `note-${Date.now()}`
    const now = new Date()
    const newNote: Note = {
      id: newId,
      title: 'Neue Notiz',
      content: '',
      date: 'Heute ' + now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
    }
    // Neue Notiz ganz oben einfügen
    setNotes([newNote, ...notes])
    setSelectedId(newId)
    setIsEditing(true)
    setTimeout(() => {
      contentTextareaRef.current?.focus()
    }, 100)
  }

  const handleSaveNote = () => {
    if (!selectedId) return
    setNotes(notes.map(note => 
      note.id === selectedId 
        ? { ...note, title: editingTitle, content: editingContent }
        : note
    ))
    setIsEditing(false)
  }

  const handleDeleteNote = () => {
    if (!selectedId) return
    const newNotes = notes.filter(n => n.id !== selectedId)
    setNotes(newNotes)
    if (newNotes.length > 0) {
      setSelectedId(newNotes[0].id)
    } else {
      setSelectedId(null)
    }
  }

  useEffect(() => {
    // Markiere L als gefunden, wenn "Lernplan" Notiz gesehen wurde (Akrostichon mit L-Buchstaben)
    if (selected?.id === 'lernplan' && !hasSeenLernplan) {
      markLFound()
      setHasSeenLernplan(true)
    }
  }, [selected, hasSeenLernplan, markLFound])

  return (
    <div className="notes-root" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', height: '100%', gap: '10px' }}>
      <aside style={{ borderRight: '1px solid var(--border)', paddingRight: '8px', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ fontWeight: 700 }}>Notizen</div>
          <button
            onClick={handleCreateNote}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 600,
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
            }}
            title="Neue Notiz"
          >
            +
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflow: 'auto' }}>
          {sortedNotes.map(note => (
            <div
              key={note.id}
              onClick={() => setSelectedId(note.id)}
              style={{
                padding: '8px',
                borderRadius: '8px',
                background: note.id === selectedId ? '#2a2b33' : 'transparent',
                border: note.id === selectedId ? '1px solid var(--border)' : '1px solid transparent',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--text)' }}>{note.title}</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{note.date}</div>
            </div>
          ))}
        </div>
      </aside>
      <section style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'auto' }}>
        {selected && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              {isEditing ? (
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  style={{
                    flex: 1,
                    fontSize: '18px',
                    fontWeight: 700,
                    color: 'var(--text)',
                    background: '#2a2b33',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    marginRight: '8px',
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      contentTextareaRef.current?.focus()
                    }
                  }}
                />
              ) : (
                <div style={{ fontWeight: 700, fontSize: '18px', color: 'var(--text)' }}>
                  {selected.title}
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px' }}>
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveNote}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        background: '#3b82f6',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      Speichern
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        setEditingTitle(selected.title)
                        setEditingContent(selected.content)
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        background: 'transparent',
                        color: 'var(--muted)',
                        border: '1px solid var(--border)',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Abbrechen
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        background: 'transparent',
                        color: 'var(--muted)',
                        border: '1px solid var(--border)',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Bearbeiten
                    </button>
                    {selected.id.startsWith('note-') && (
                      <button
                        onClick={handleDeleteNote}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: 'transparent',
                          color: '#ef4444',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        Löschen
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '16px' }}>
              {selected.date}
            </div>
            {isEditing ? (
              <textarea
                ref={contentTextareaRef}
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                style={{
                  flex: 1,
                  minHeight: '300px',
                  fontSize: '14px',
                  color: 'var(--text)',
                  background: '#2a2b33',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '12px',
                  fontFamily: 'inherit',
                  lineHeight: 1.6,
                  resize: 'vertical',
                }}
                placeholder="Notizinhalt eingeben..."
              />
            ) : (
              <div style={{ fontSize: '14px', color: 'var(--text)', whiteSpace: 'pre-line', lineHeight: 1.6, flex: 1 }}>
                {selected.content.split('\n').map((line, i) => {
                  // Markiere erste Zeile der "Liste" Notiz
                  if (selected.id === 'liste' && i === 0) {
                    return (
                      <div key={i} style={{ fontWeight: 700, color: 'var(--accent)', textDecoration: 'underline' }}>
                        {line}
                      </div>
                    )
                  }
                  // Markiere "Terminal" in der Codewort-Terminal Notiz
                  if (selected.id === 'codewort-terminal') {
                    const parts = line.split(/(Terminal)/i)
                    return (
                      <div key={i}>
                        {parts.map((part, j) => 
                          part.toLowerCase() === 'terminal' ? (
                            <span key={j} style={{ fontWeight: 700, color: 'var(--accent)' }}>{part}</span>
                          ) : (
                            <span key={j}>{part}</span>
                          )
                        )}
                      </div>
                    )
                  }
                  return (
                    <div key={i}>
                      {(() => {
                        const parts = line.split(/(\*\*[A-Z]\*\*)/g).filter(p => p !== '')
                        return parts.map((part, j) => {
                          const boldMatch = part.match(/^\*\*([A-Z])\*\*$/)
                          if (boldMatch) {
                            return <strong key={j} style={{ fontWeight: 700, color: 'inherit' }}>{boldMatch[1]}</strong>
                          }
                          return <span key={j}>{part}</span>
                        })
                      })()}
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
