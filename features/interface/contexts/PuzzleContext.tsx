'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

interface PuzzleContextType {
  // Rätsel 1 Progress - Reihenfolge M-K-T-N-S
  orderSeenInCalendar: boolean
  foundV: boolean // Messages
  foundA: boolean // Kontakte
  foundU: boolean // Terminal
  foundL: boolean // Notizen
  foundT: boolean // Music
  vaultUnlocked: boolean
  
  // Rätsel 2 - Archiv
  archiveLocked: boolean
  archiveUnlocked: boolean
  
  // Deep Links für App-Verknüpfungen
  photoDeepLink: string | null // z.B. "screenshots/screenshot3.jpg" oder "arbeitsplatz/desk_04.jpg"
  fileDeepLink: string | null // z.B. "REDAKTION/Recherche/Fragmente/fragment_07.txt"
  
  // Actions
  markOrderSeen: () => void
  markVFound: () => void
  markAFound: () => void
  markUFound: () => void
  markLFound: () => void
  markTFound: () => void
  unlockVault: () => void
  unlockArchive: () => void
  setPhotoDeepLink: (key: string | null) => void
  setFileDeepLink: (path: string | null) => void
}

const PuzzleContext = createContext<PuzzleContextType | undefined>(undefined)

export function PuzzleProvider({ children }: { children: React.ReactNode }) {
  const [orderSeenInCalendar, setOrderSeenInCalendar] = useState(false)
  const [foundV, setFoundV] = useState(false)
  const [foundA, setFoundA] = useState(false)
  const [foundU, setFoundU] = useState(false)
  const [foundL, setFoundL] = useState(false)
  const [foundT, setFoundT] = useState(false)
  const [vaultUnlocked, setVaultUnlocked] = useState(false)
  const [archiveLocked, setArchiveLocked] = useState(true)
  const [archiveUnlocked, setArchiveUnlocked] = useState(false)
  const [photoDeepLink, setPhotoDeepLink] = useState<string | null>(null)
  const [fileDeepLink, setFileDeepLink] = useState<string | null>(null)

  const markOrderSeen = useCallback(() => {
    setOrderSeenInCalendar(true)
  }, [])

  const markVFound = useCallback(() => {
    setFoundV(true)
  }, [])

  const markAFound = useCallback(() => {
    setFoundA(true)
  }, [])

  const markUFound = useCallback(() => {
    setFoundU(true)
  }, [])

  const markLFound = useCallback(() => {
    setFoundL(true)
  }, [])

  const markTFound = useCallback(() => {
    setFoundT(true)
  }, [])

  const unlockVault = useCallback(() => {
    // Schalte das Archiv frei (wird vom Terminal aufgerufen)
    if (!vaultUnlocked) {
      setVaultUnlocked(true)
    }
  }, [vaultUnlocked])

  const unlockArchive = useCallback(() => {
    // Entsperre das Archiv (wird vom Archiv-Overlay aufgerufen)
    if (archiveLocked) {
      setArchiveLocked(false)
      setArchiveUnlocked(true)
    }
  }, [archiveLocked])

  const handleSetPhotoDeepLink = useCallback((key: string | null) => {
    setPhotoDeepLink(key)
  }, [])

  const handleSetFileDeepLink = useCallback((path: string | null) => {
    setFileDeepLink(path)
  }, [])

  return (
    <PuzzleContext.Provider value={{
      orderSeenInCalendar,
      foundV,
      foundA,
      foundU,
      foundL,
      foundT,
      vaultUnlocked,
      archiveLocked,
      archiveUnlocked,
      photoDeepLink,
      fileDeepLink,
      markOrderSeen,
      markVFound,
      markAFound,
      markUFound,
      markLFound,
      markTFound,
      unlockVault,
      unlockArchive,
      setPhotoDeepLink: handleSetPhotoDeepLink,
      setFileDeepLink: handleSetFileDeepLink,
    }}>
      {children}
    </PuzzleContext.Provider>
  )
}

export function usePuzzle() {
  const context = useContext(PuzzleContext)
  if (!context) {
    throw new Error('usePuzzle must be used within PuzzleProvider')
  }
  return context
}
