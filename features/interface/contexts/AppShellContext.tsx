'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface AppShellContextType {
  bottomBar: ReactNode | null
  setBottomBar: (bar: ReactNode | null) => void
}

const AppShellContext = createContext<AppShellContextType | undefined>(undefined)

export function AppShellProvider({ children }: { children: React.ReactNode }) {
  const [bottomBar, setBottomBar] = useState<ReactNode | null>(null)

  return (
    <AppShellContext.Provider value={{ bottomBar, setBottomBar }}>
      {children}
    </AppShellContext.Provider>
  )
}

export function useAppShell() {
  const context = useContext(AppShellContext)
  if (!context) {
    throw new Error('useAppShell must be used within AppShellProvider')
  }
  return context
}
