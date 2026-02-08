'use client'

import { useEffect, useState, useRef } from 'react'

interface WeatherData {
  icon: string
  temp: string
  desc: string
  range: string
  updated: string
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData>({
    icon: '⛅',
    temp: '—°C',
    desc: 'Loading…',
    range: 'H: —° / L: —°',
    updated: '—',
  })
  const widgetRef = useRef<HTMLDivElement>(null)
  const [userPlaced, setUserPlaced] = useState(false)

  useEffect(() => {
    const placeDefault = () => {
      if (userPlaced || !widgetRef.current) return
      requestAnimationFrame(() => {
        if (!widgetRef.current) return
        const width = widgetRef.current.offsetWidth || 280
        widgetRef.current.style.right = 'auto'
        widgetRef.current.style.left = `${Math.max(12, window.innerWidth - width - 24)}px`
        if (!widgetRef.current.style.top) {
          widgetRef.current.style.top = '72px'
        }
      })
    }
    placeDefault()
    window.addEventListener('resize', placeDefault)
    return () => window.removeEventListener('resize', placeDefault)
  }, [userPlaced])

  useEffect(() => {
    const lat = 47.3769
    const lon = 8.5417
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`

    const codeTo = (code: number): [string, string] => {
      const map: Record<number, [string, string]> = {
        0: ['Clear', '☀️'],
        1: ['Mainly clear', '🌤️'],
        2: ['Partly cloudy', '⛅'],
        3: ['Overcast', '☁️'],
        45: ['Fog', '🌫️'],
        48: ['Depositing rime fog', '🌫️'],
        51: ['Light drizzle', '🌦️'],
        53: ['Drizzle', '🌦️'],
        55: ['Dense drizzle', '🌧️'],
        61: ['Light rain', '🌦️'],
        63: ['Rain', '🌧️'],
        65: ['Heavy rain', '🌧️'],
        71: ['Snow fall', '🌨️'],
        80: ['Rain showers', '🌧️'],
        95: ['Thunderstorm', '⛈️'],
      }
      return map[code] || ['Weather', '🌡️']
    }

    fetch(url)
      .then(r => r.json())
      .then(d => {
        const cur = d.current || {}
        const daily = d.daily || {}
        const temp = Math.round(cur.temperature_2m)
        const [label, emoji] = codeTo(cur.weather_code)
        const tmax = daily.temperature_2m_max?.[0]
        const tmin = daily.temperature_2m_min?.[0]

        setWeather({
          icon: emoji,
          temp: (isFinite(temp) ? temp : '—') + '°C',
          desc: label,
          range: isFinite(tmax) && isFinite(tmin)
            ? `H: ${Math.round(tmax)}° / L: ${Math.round(tmin)}°`
            : 'H: —° / L: —°',
          updated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })
      })
      .catch(() => {
        setWeather(prev => ({ ...prev, desc: 'Failed to load' }))
      })
  }, [])

  useEffect(() => {
    const handle = widgetRef.current
    if (!handle) return

    let dragging = false
    let sx = 0
    let sy = 0
    let baseLeft = 0
    let baseTop = 0

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      dragging = true
      setUserPlaced(true)
      const rect = handle.getBoundingClientRect()
      baseLeft = rect.left
      baseTop = rect.top
      sx = e.clientX
      sy = e.clientY
      handle.style.right = 'auto'
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging || !handle) return
      const nx = baseLeft + (e.clientX - sx)
      const ny = baseTop + (e.clientY - sy)
      const maxX = window.innerWidth - handle.offsetWidth - 12
      const maxY = window.innerHeight - handle.offsetHeight - 20
      handle.style.left = `${Math.max(6, Math.min(nx, maxX))}px`
      handle.style.top = `${Math.max(34, Math.min(ny, maxY))}px`
    }

    const handleMouseUp = () => {
      dragging = false
    }

    handle.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      handle.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return (
    <section
      ref={widgetRef}
      className="weather-widget"
      id="weather-widget"
      aria-label="Weather in Zürich"
      role="complementary"
    >
      <header className="ww-header">
        <div className="ww-city">Zürich</div>
        <div className="ww-updated" title="Last updated">{weather.updated}</div>
      </header>
      <div className="ww-main">
        <div className="ww-icon">{weather.icon}</div>
        <div className="ww-temp">{weather.temp}</div>
      </div>
      <footer className="ww-footer">
        <div className="ww-desc">{weather.desc}</div>
        <div className="ww-range">{weather.range}</div>
      </footer>
    </section>
  )
}
