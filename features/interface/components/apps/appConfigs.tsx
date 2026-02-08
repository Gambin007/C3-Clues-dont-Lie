import Notes from './Notes'
import Calendar from './Calendar'
import Calculator from './Calculator'
import Contacts from './Contacts'
import Terminal from './Terminal'
import Dateien from './Dateien'
import Photos from './Photos'
import Messages from './Messages'
import Spotify from './Spotify'

export interface AppConfig {
  title: string
  component: React.ComponentType<{ windowId: string }>
  initialSize?: { width: number; height: number }
  resizable?: boolean // Default: true
}

export const APP_CONFIGS: Record<string, AppConfig> = {
  notes: {
    title: 'Notizen',
    component: Notes,
    initialSize: { width: 700, height: 600 },
  },
  calendar: {
    title: 'Calendar',
    component: Calendar,
    initialSize: { width: 800, height: 680 },
    resizable: false, // Kalender ist nicht resizable
  },
  calculator: {
    title: 'Calculator',
    component: Calculator,
    initialSize: { width: 360, height: 520 },
  },
  contacts: {
    title: 'Kontakte',
    component: Contacts,
    initialSize: { width: 720, height: 520 },
  },
  terminal: {
    title: 'Terminal',
    component: Terminal,
    initialSize: { width: 720, height: 420 },
  },
  dateien: {
    title: 'Dateien',
    component: Dateien,
    initialSize: { width: 820, height: 540 },
  },
  photos: {
    title: 'Photos',
    component: Photos,
    initialSize: { width: 1200, height: 800 },
  },
  messages: {
    title: 'Messages',
    component: Messages,
    initialSize: { width: 900, height: 700 },
  },
  spotify: {
    title: 'Songs',
    component: Spotify,
    initialSize: { width: 800, height: 600 },
  },
}
