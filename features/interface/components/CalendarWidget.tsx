'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { useWindows } from '@interface/contexts/WindowContext'
import type { CalendarEvent } from './apps/calendarData'
import { generateDummyEvents } from './apps/calendarData'

export default function CalendarWidget() {
  const widgetRef = useRef<HTMLDivElement>(null)
  const [userPlaced, setUserPlaced] = useState(false)
  const { createWindow } = useWindows()
  const today = new Date()

  // Get events for today and upcoming days
  const allEvents = useMemo(() => generateDummyEvents(today), [today])

  const dateToKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

  // Get today's events and next 3 upcoming events
  const { todayEvents, upcomingEvents } = useMemo(() => {
    const todayKey = dateToKey(today)
    const todayEvs = allEvents
      .filter(e => e.date === todayKey)
      .sort((a, b) => a.time.localeCompare(b.time))

    // Get events for next 7 days
    const upcoming: CalendarEvent[] = []
    for (let i = 1; i <= 7; i++) {
      const futureDate = new Date(today)
      futureDate.setDate(today.getDate() + i)
      const futureKey = dateToKey(futureDate)
      const evs = allEvents
        .filter(e => e.date === futureKey)
        .sort((a, b) => a.time.localeCompare(b.time))
      upcoming.push(...evs)
    }

    // Sort upcoming by date and time, take first 3
    const sortedUpcoming = upcoming
      .sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date)
        if (dateCompare !== 0) return dateCompare
        return a.time.localeCompare(b.time)
      })
      .slice(0, 3)

    return { todayEvents: todayEvs, upcomingEvents: sortedUpcoming }
  }, [allEvents, today])

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00')
    const todayKey = dateToKey(today)
    if (dateStr === todayKey) return 'Heute'
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const tomorrowKey = dateToKey(tomorrow)
    if (dateStr === tomorrowKey) return 'Morgen'
    return d.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  useEffect(() => {
    const placeDefault = () => {
      if (userPlaced || !widgetRef.current) return
      requestAnimationFrame(() => {
        if (!widgetRef.current) return
        const width = widgetRef.current.offsetWidth || 280
        widgetRef.current.style.right = 'auto'
        widgetRef.current.style.left = `${Math.max(12, window.innerWidth - width - 24)}px`
        if (!widgetRef.current.style.top) {
          widgetRef.current.style.top = '250px'
        }
      })
    }
    placeDefault()
    window.addEventListener('resize', placeDefault)
    return () => window.removeEventListener('resize', placeDefault)
  }, [userPlaced])

  useEffect(() => {
    const handle = widgetRef.current
    if (!handle) return

    let dragging = false
    let dragStartX = 0
    let dragStartY = 0
    let baseLeft = 0
    let baseTop = 0
    let hasMoved = false

    const handleMouseDown = (e: MouseEvent) => {
      // Allow drag from anywhere on the widget
      if (e.button !== 0) return
      
      dragging = true
      hasMoved = false
      setUserPlaced(true)
      const rect = handle.getBoundingClientRect()
      baseLeft = rect.left
      baseTop = rect.top
      dragStartX = e.clientX
      dragStartY = e.clientY
      handle.style.right = 'auto'
      handle.style.cursor = 'grabbing'
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging || !handle) return
      
      const dx = Math.abs(e.clientX - dragStartX)
      const dy = Math.abs(e.clientY - dragStartY)
      
      // Only consider it a drag if moved more than 5px
      if (dx > 5 || dy > 5) {
        hasMoved = true
      }
      
      if (hasMoved) {
        const nx = baseLeft + (e.clientX - dragStartX)
        const ny = baseTop + (e.clientY - dragStartY)
        const maxX = window.innerWidth - handle.offsetWidth - 12
        const maxY = window.innerHeight - handle.offsetHeight - 20
        handle.style.left = `${Math.max(6, Math.min(nx, maxX))}px`
        handle.style.top = `${Math.max(34, Math.min(ny, maxY))}px`
      }
    }

    const handleMouseUp = () => {
      if (dragging && !hasMoved) {
        // If we didn't drag, treat it as a click - open calendar
        createWindow('calendar')
      }
      dragging = false
      if (handle) {
        handle.style.cursor = 'grab'
      }
    }

    handle.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      handle.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [createWindow])

  const fmtDay = (d: Date) => d.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })

  return (
    <section
      ref={widgetRef}
      className="calendar-widget"
      id="calendar-widget"
      aria-label="Calendar Widget"
      role="complementary"
      style={{ cursor: 'grab' }}
    >
      <header className="cw-header">
        <div className="cw-title">{fmtDay(today)}</div>
      </header>

      <div className="cw-content">
        {todayEvents.length > 0 ? (
          <div className="cw-section">
            <div className="cw-section-title">Heute</div>
            {todayEvents.map(ev => (
              <div 
                key={ev.id} 
                className="cw-event"
                style={ev.color === 'red' ? {
                  borderLeft: '3px solid rgba(239, 68, 68, 0.8)',
                  background: 'rgba(239, 68, 68, 0.1)',
                } : {}}
              >
                <div className="cw-event-time">{ev.time}</div>
                <div className="cw-event-title" style={ev.color === 'red' ? { color: 'rgba(239, 68, 68, 0.9)', fontWeight: 600 } : {}}>{ev.title}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="cw-empty">Keine Termine heute</div>
        )}

        {upcomingEvents.length > 0 && (
          <div className="cw-section">
            <div className="cw-section-title">Kommend</div>
            {upcomingEvents.map(ev => (
              <div 
                key={ev.id} 
                className="cw-event"
                style={ev.color === 'red' ? {
                  borderLeft: '3px solid rgba(239, 68, 68, 0.8)',
                  background: 'rgba(239, 68, 68, 0.1)',
                } : {}}
              >
                <div className="cw-event-date">{formatDate(ev.date)}</div>
                <div className="cw-event-time">{ev.time}</div>
                <div className="cw-event-title" style={ev.color === 'red' ? { color: 'rgba(239, 68, 68, 0.9)', fontWeight: 600 } : {}}>{ev.title}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
