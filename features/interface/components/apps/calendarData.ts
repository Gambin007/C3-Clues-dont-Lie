export type CalendarEvent = {
	id: string
	title: string
	date: string // YYYY-MM-DD
	time: string // HH:MM
	color: 'blue' | 'green' | 'red' | 'gray'
	notes?: string
}

// Deterministic events generator so events are stable across renders
export function generateDummyEvents(baseToday?: Date): CalendarEvent[] {
	const today = baseToday ? new Date(baseToday) : new Date()

	const puzzleDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

	const templates = [
		{ title: 'Vorlesung', color: 'blue' as const },
		{ title: 'Abgabe', color: 'blue' as const },
		{ title: 'Gruppenmeeting', color: 'green' as const },
		{ title: 'Mama anrufen', color: 'green' as const },
		{ title: 'Zahnarzt', color: 'green' as const },
		{ title: 'Recherche', color: 'gray' as const },
		{ title: 'Interview vorbereiten', color: 'blue' as const },
		{ title: 'Kaffee mit Melina', color: 'green' as const },
		{ title: 'Check-in', color: 'gray' as const },
	]

	const times = ['08:00', '09:30', '11:00', '13:00', '14:30', '16:00', '17:30', '19:00']

	function xfnv1a(str: string) {
		let h = 2166136261 >>> 0
		for (let i = 0; i < str.length; i++) {
			h ^= str.charCodeAt(i)
			h = Math.imul(h, 16777619)
		}
		return () => {
			h += 0x6D2B79F5
			let t = Math.imul(h ^ (h >>> 15), 1 | h)
			t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296
		}
	}

	const events: CalendarEvent[] = []

	// puzzle event at today's date
	events.push({
		id: 'puzzle-1',
		title: 'Nicht vergessen!!!',
		date: puzzleDate,
		time: '18:30',
		color: 'red',
		notes: `Nimm nur, was markiert ist.\nReihenfolge: M – K – S – N – T`,
	})

	const startDate = new Date(today)
	startDate.setDate(startDate.getDate() - 10)
	const endDate = new Date(today)
	endDate.setDate(endDate.getDate() + 40)

	for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
		const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
		if (dateStr === puzzleDate) continue
		const rng = xfnv1a(dateStr + '-seed')
		const num = Math.floor(rng() * 4) // 0..3 events
		for (let i = 0; i < num; i++) {
			const idx = Math.floor(rng() * templates.length)
			const t = templates[idx]
			const time = times[Math.floor(rng() * times.length)]
			events.push({
				id: `evt-${dateStr}-${i}`,
				title: t.title,
				date: dateStr,
				time,
				color: t.color,
			})
		}
	}

	return events
}
