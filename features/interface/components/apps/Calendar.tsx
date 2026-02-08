'use client'

import React, { useMemo, useState } from 'react'
import { usePuzzle } from '@interface/contexts/PuzzleContext'
import type { CalendarEvent } from './calendarData'
import { generateDummyEvents } from './calendarData'

export default function Calendar({ windowId }: { windowId: string }) {
  const { markOrderSeen } = usePuzzle()
  const today = new Date()

  // view - the first day of the month we're showing
  const [view, setView] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState<Date | null>(today)
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([])

  // Use shared events generator. If later a shared data source exists, replace here.
  const allEvents = useMemo(() => generateDummyEvents(today), [today])

  const fmtMonthYear = (d: Date) => d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

  const dateToKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

  const isSameDay = (a: Date | null, b: Date | null) => {
    if (!a || !b) return false
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  }

  const isToday = (d: Date) => isSameDay(d, today)

  const getEventsForDate = (d: Date) => {
    const key = dateToKey(d)
    return allEvents.filter(e => e.date === key)
  }

  // Build a 42-cell grid (6 rows x 7 cols) starting from Monday (EU week start)
  const cells = useMemo(() => {
    const startDay = new Date(view.getFullYear(), view.getMonth(), 1)
    // convert Sunday(0)..Saturday(6) to Monday-first index: Monday=0
    const offset = (startDay.getDay() + 6) % 7
    const startGridDate = new Date(view.getFullYear(), view.getMonth(), 1 - offset)
    const result: { date: Date; inMonth: boolean; events: CalendarEvent[] }[] = []
    for (let i = 0; i < 42; i++) {
      const d = new Date(startGridDate.getFullYear(), startGridDate.getMonth(), startGridDate.getDate() + i)
      result.push({ date: d, inMonth: d.getMonth() === view.getMonth(), events: getEventsForDate(d) })
    }
    return result
  }, [view, allEvents])

  const handleDayClick = (d: Date) => {
    setSelectedDate(d)
    const evs = getEventsForDate(d)
    setSelectedEvents(evs)
    // If the puzzle event is present, hint at puzzle progress
    if (evs.find(e => e.id === 'puzzle-1')) {
      markOrderSeen && markOrderSeen()
    }
  }

  const handlePrev = () => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))
  const handleNext = () => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))
  const handleToday = () => {
    setView(new Date(today.getFullYear(), today.getMonth(), 1))
    setSelectedDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()))
    setSelectedEvents(getEventsForDate(today))
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
      <header style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ fontWeight: 600 }}>{fmtMonthYear(view)}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handlePrev} title="Previous Month" style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: 'var(--text)' }}>◀</button>
          <button onClick={handleNext} title="Next Month" style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: 'var(--text)' }}>▶</button>
          <button onClick={handleToday} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', color: 'var(--text)' }}>Today</button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '8px 10px', gap: 6, background: 'transparent', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        {['Mo','Di','Mi','Do','Fr','Sa','So'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>{d}</div>
        ))}
      </div>

      {/* Month grid - flex:1 keeps it above footer; use 6 rows to always show a full month */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: 'repeat(6, 1fr)', gap: 6, padding: 10, minHeight: 0, overflow: 'hidden' }}>
        {cells.map((cell, i) => {
          const dots = cell.events.slice(0, 3)
          const more = cell.events.length > 3
          const muted = !cell.inMonth
          const todayMark = isToday(cell.date)
          const selected = isSameDay(cell.date, selectedDate)

          return (
            <button
              key={i}
              onClick={() => handleDayClick(cell.date)}
              onDoubleClick={() => setView(new Date(cell.date.getFullYear(), cell.date.getMonth(), 1))}
              style={{
                padding: 8,
                textAlign: 'center',
                background: selected ? 'var(--window-accent)' : 'transparent',
                color: muted ? 'var(--muted)' : 'var(--text)',
                border: 'none',
                borderRadius: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 6,
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontWeight: 600 }}>{cell.date.getDate()}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                {dots.map((evt, idx) => (
                  <span key={idx} style={{ width: 8, height: 8, borderRadius: 999, background: evt.color === 'blue' ? '#4f83ff' : evt.color === 'green' ? '#4cd264' : evt.color === 'red' ? '#ff5c5c' : '#9aa0a6' }} />
                ))}
                {more && <span style={{ fontSize: 10, color: 'var(--muted)' }}>+</span>}
              </div>
            </button>
          )
        })}
      </div>

      {/* Fixed bottom agenda strip - stabil positioniert */}
      <footer style={{ height: 140, borderTop: '1px solid var(--border)', padding: 12, overflowY: 'auto', flexShrink: 0, background: 'var(--window-bg)' }}>
        {selectedEvents.length === 0 ? (
          <div style={{ color: 'var(--muted)' }}>
            {selectedDate
              ? selectedDate.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
              : 'Keine Termine ausgewählt'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {selectedEvents.map(ev => (
              <div key={ev.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ minWidth: 56, fontSize: 12, color: 'var(--muted)' }}>{ev.time}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{ev.title}</div>
                  {ev.notes && <div style={{ whiteSpace: 'pre-line', marginTop: 6, color: 'var(--muted)', fontSize: 13 }}>{ev.notes}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </footer>
    </div>
  )
}

