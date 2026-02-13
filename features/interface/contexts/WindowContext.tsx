'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { APP_CONFIGS } from '@interface/components/apps/appConfigs'

export interface WindowState {
  id: string
  appId: string
  x: number
  y: number
  width: number
  height: number
  minimized: boolean
  fullscreen: boolean
  zIndex: number
  resizable?: boolean
  initialPath?: string[] // For Files app: path to open
}

interface WindowContextType {
  windows: WindowState[]
  createWindow: (appId: string, options?: { initialPath?: string[] }) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  toggleFullscreen: (id: string) => void
  focusWindow: (id: string) => void
  updateWindowPosition: (id: string, x: number, y: number) => void
  updateWindowSize: (id: string, width: number, height: number) => void
  getWindow: (id: string) => WindowState | undefined
}

const WindowContext = createContext<WindowContextType | undefined>(undefined)

let nextZIndex = 10

export function WindowProvider({ children }: { children: React.ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>([])

  const createWindow = useCallback((appId: string, options?: { initialPath?: string[] }) => {
    const id = `win-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    const appConfig = APP_CONFIGS[appId]
    const initialSize = appConfig?.initialSize || { width: 520, height: 340 }
    // Photos-App öffnet standardmäßig im Vollbildmodus
    const shouldBeFullscreen = appId === 'photos'
    const newWindow: WindowState = {
      id,
      appId,
      x: 40 + Math.random() * 120,
      y: 60 + Math.random() * 80,
      width: initialSize.width,
      height: initialSize.height,
      minimized: false,
      fullscreen: shouldBeFullscreen,
      zIndex: ++nextZIndex,
      resizable: appConfig?.resizable !== false, // Default: true, unless explicitly false
      initialPath: options?.initialPath,
    }
    setWindows(prev => [...prev, newWindow])
  }, [])

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id))
  }, [])

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, minimized: true } : w
    ))
  }, [])

  const restoreWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, minimized: false, zIndex: ++nextZIndex } : w
    ))
  }, [])

  const toggleFullscreen = useCallback((id: string) => {
    setWindows(prev => prev.map(w => {
      if (w.id !== id) return w
      return {
        ...w,
        fullscreen: !w.fullscreen,
        zIndex: ++nextZIndex,
      }
    }))
  }, [])

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: ++nextZIndex } : w
    ))
  }, [])

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, x, y } : w
    ))
  }, [])

  const updateWindowSize = useCallback((id: string, width: number, height: number) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, width, height } : w
    ))
  }, [])

  const getWindow = useCallback((id: string) => {
    return windows.find(w => w.id === id)
  }, [windows])

  return (
    <WindowContext.Provider value={{
      windows,
      createWindow,
      closeWindow,
      minimizeWindow,
      restoreWindow,
      toggleFullscreen,
      focusWindow,
      updateWindowPosition,
      updateWindowSize,
      getWindow,
    }}>
      {children}
    </WindowContext.Provider>
  )
}

export function useWindows() {
  const context = useContext(WindowContext)
  if (!context) {
    throw new Error('useWindows must be used within WindowProvider')
  }
  return context
}
