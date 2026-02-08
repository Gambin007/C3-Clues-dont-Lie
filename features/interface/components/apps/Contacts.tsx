'use client'

import { useState, useEffect } from 'react'
import { usePuzzle } from '@interface/contexts/PuzzleContext'

interface Contact {
  id: string
  name: string
  avatar: string
  email: string
  phone: string
  city: string
  notes?: string
}

const CONTACTS: Contact[] = [
  {
    id: 'mama',
    name: 'Mama',
    avatar: '👩',
    email: '',
    phone: '+41 44 111 22 33',
    city: 'Zürich',
  },
  {
    id: 'Isak',
    name: 'Isak',
    avatar: '👨',
    email: '',
    phone: '+41 44 222 33 44',
    city: 'Zürich',
  },
  {
    id: 'melina',
    name: 'Melina',
    avatar: '👩‍💼',
    email: '',
    phone: '+41 44 444 55 66',
    city: 'Zürich',
  },
  {
    id: 'notfall',
    name: 'Notfall',
    avatar: '🚨',
    email: '',
    phone: '+41 44 999 88 77',
    city: 'Zürich',
    notes: `Der Buchstabe liegt nicht in der Person.
  Schau, wer wirklich sofort reagiert wenn mal was passiert.`
  },
  {
    id: 'pizza',
    name: 'Pizza Express',
    avatar: '🍕',
    email: 'order@pizzaexpress.ch',
    phone: '+41 44 123 45 67',
    city: 'Zürich',
    notes: 'Bestellnummer: 4711'
  },
  {
    id: 'hausarzt',
    name: 'Dr. Müller',
    avatar: '👨‍⚕️',
    email: 'mueller@praxis.ch',
    phone: '+41 44 666 77 88',
    city: 'Zürich',
  },
  {
    id: 'prof1',
    name: 'Prof. Schmidt',
    avatar: '👨‍🏫',
    email: 'schmidt@uni.ch',
    phone: '+41 44 777 88 99',
    city: 'Zürich',
  },
  {
    id: 'freundin1',
    name: 'Sarah',
    avatar: '👩',
    email: '',
    phone: '+41 44 888 99 00',
    city: 'Zürich',
  },
  {
    id: 'freundin2',
    name: 'Emma',
    avatar: '👩',
    email: '',
    phone: '+41 44 111 00 11',
    city: 'Zürich',
  },
  {
    id: 'quelle1',
    name: 'Quelle A',
    avatar: '🔍',
    email: '',
    phone: '+41 44 222 11 22',
    city: 'Zürich',
    notes: 'Vertraulich'
  },
  {
    id: 'quelle2',
    name: 'Quelle B',
    avatar: '🔍',
    email: '',
    phone: '+41 44 333 22 33',
    city: 'Zürich',
    notes: 'Nur per Signal'
  },
  {
    id: 'anna',
    name: 'Anna',
    avatar: '👩‍🎓',
    email: '',
    phone: '+41 44 999 88 77',
    city: 'Zürich',
    notes: 'Reagiert schnell.'
  },
  {
    id: 'taxi',
    name: 'Taxi Zürich',
    avatar: '🚕',
    email: 'info@taxi-zurich.ch',
    phone: '+41 44 123 45 67',
    city: 'Zürich',
  },
  {
    id: 'supermarkt',
    name: 'Coop',
    avatar: '🛒',
    email: 'info@coop.ch',
    phone: '+41 44 555 44 33',
    city: 'Zürich',
  },
  {
    id: 'bank',
    name: 'UBS',
    avatar: '🏦',
    email: 'info@ubs.ch',
    phone: '+41 44 666 55 44',
    city: 'Zürich',
  },
  {
    id: 'versicherung',
    name: 'Krankenkasse',
    avatar: '🏥',
    email: 'info@kk.ch',
    phone: '+41 44 777 66 55',
    city: 'Zürich',
  },
  {
    id: 'handy',
    name: 'Swisscom',
    avatar: '📱',
    email: 'info@swisscom.ch',
    phone: '+41 44 888 77 66',
    city: 'Zürich',
  },
  {
    id: 'uni-bib',
    name: 'Uni Bibliothek',
    avatar: '📚',
    email: 'bib@uni.ch',
    phone: '+41 44 999 88 77',
    city: 'Zürich',
  },
  {
    id: 'cafe',
    name: 'Café Central',
    avatar: '☕',
    email: 'info@cafe-central.ch',
    phone: '+41 44 111 22 33',
    city: 'Zürich',
    notes: 'Bester Kaffee in der Stadt'
  },
  {
    id: 'hauswart',
    name: 'Hauswart',
    avatar: '🔧',
    email: '',
    phone: '+41 44 123 45 68',
    city: 'Zürich',
  },
  {
    id: 'stefan',
    name: 'Stefan Redaktion',
    avatar: '👨',
    email: '',
    phone: '+41 44 234 56 78',
    city: 'Zürich',
  },
  {
    id: 'andreas',
    name: 'Andreas Gym',
    avatar: '👨',
    email: '',
    phone: '+41 44 345 67 89',
    city: 'Zürich',
  },
  {
    id: 'chefredaktion',
    name: 'Chefredaktion',
    avatar: '📝',
    email: '',
    phone: '+41 44 456 78 90',
    city: 'Zürich',
  },
  {
    id: 'quelle',
    name: 'Q***',
    avatar: '🔒',
    email: '',
    phone: '+41 44 567 89 01',
    city: 'Zürich',
  },
  {
    id: 'uni-gruppe',
    name: 'Uni Gruppe',
    avatar: '👥',
    email: '',
    phone: '+41 44 678 90 12',
    city: 'Zürich',
  },
]

export default function Contacts({ windowId }: { windowId: string }) {
  const { markAFound } = usePuzzle()
  const [selectedId, setSelectedId] = useState(CONTACTS[0].id)
  const [hasSeenAnnaNote, setHasSeenAnnaNote] = useState(false)

  const selected = CONTACTS.find(c => c.id === selectedId)

  useEffect(() => {
    // Markiere A als gefunden, wenn Anna-Kontakt gesehen wurde
    if (selected?.id === 'anna' && !hasSeenAnnaNote) {
      markAFound()
      setHasSeenAnnaNote(true)
    }
  }, [selected, hasSeenAnnaNote, markAFound])

  return (
    <div className="contacts-root" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', height: '100%', gap: '10px' }}>
      <aside className="contacts-sidebar" style={{ borderRight: '1px solid var(--border)', paddingRight: '8px', overflow: 'auto' }}>
        <div className="contacts-list">
          {CONTACTS.map(c => (
            <div
              key={c.id}
              className={`contact-item ${c.id === selectedId ? 'active' : ''}`}
              onClick={() => setSelectedId(c.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px',
                borderRadius: '10px',
                border: c.id === selectedId ? '1px solid var(--border)' : '1px solid transparent',
                background: c.id === selectedId ? '#2a2b33' : 'transparent',
                color: 'var(--text)',
                cursor: 'pointer',
                marginBottom: '6px',
              }}
            >
              <div className="avatar">{c.avatar}</div>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {c.name}
                </div>
                {c.phone && (
                  <div style={{ color: 'var(--muted)', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.phone}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </aside>
      <section className="contacts-detail" style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'auto' }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '8px', borderBottom: '1px solid var(--border)', minHeight: '34px' }}>
          <div className="avatar detail-avatar">{selected?.avatar || '👤'}</div>
          <div className="contact-name detail-name">{selected?.name || 'Select a contact'}</div>
        </header>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '10px' }}>
          {selected?.email && (
            <div className="contact-row">
              <span>📧</span>
              <span className="detail-email">{selected.email}</span>
            </div>
          )}
          <div className="contact-row">
            <span>📞</span>
            <span className="detail-phone">{selected?.phone || '—'}</span>
          </div>
          <div className="contact-row">
            <span>🏙️</span>
            <span className="detail-city">{selected?.city || '—'}</span>
          </div>
          {selected?.notes && (
            <div style={{ marginTop: '16px', padding: '12px', background: '#1e1f24', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px', fontWeight: 600 }}>Notizen</div>
              <div style={{ fontSize: '13px', color: 'var(--text)', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                {selected.notes}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
