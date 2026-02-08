'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ExperienceState {
  part1Done: boolean
  interfaceDone: boolean
  belaDone: boolean
  movie1Done: boolean
  movie2Done: boolean
  movie3Done: boolean
}

interface ExperienceContextType {
  state: ExperienceState
  markPart1Done: () => void
  markInterfaceDone: () => void
  markBelaDone: () => void
  markMovie1Done: () => void
  markMovie2Done: () => void
  markMovie3Done: () => void
  resetExperience: () => void
}

const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined)

const STORAGE_KEY = 'c3-experience-state'

const defaultState: ExperienceState = {
  part1Done: false,
  interfaceDone: false,
  belaDone: false,
  movie1Done: false,
  movie2Done: false,
  movie3Done: false,
}

function loadState(): ExperienceState {
  if (typeof window === 'undefined') return defaultState
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load experience state:', e)
  }
  return defaultState
}

function saveState(state: ExperienceState) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error('Failed to save experience state:', e)
  }
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ExperienceState>(loadState)

  useEffect(() => {
    setState(loadState())
  }, [])

  const markPart1Done = () => {
    const newState = { ...state, part1Done: true }
    setState(newState)
    saveState(newState)
  }

  const markInterfaceDone = () => {
    const newState = { ...state, interfaceDone: true }
    setState(newState)
    saveState(newState)
  }

  const markBelaDone = () => {
    const newState = { ...state, belaDone: true }
    setState(newState)
    saveState(newState)
  }

  const markMovie1Done = () => {
    const newState = { ...state, movie1Done: true }
    setState(newState)
    saveState(newState)
  }

  const markMovie2Done = () => {
    const newState = { ...state, movie2Done: true }
    setState(newState)
    saveState(newState)
  }

  const markMovie3Done = () => {
    const newState = { ...state, movie3Done: true }
    setState(newState)
    saveState(newState)
  }

  const resetExperience = () => {
    setState(defaultState)
    saveState(defaultState)
  }

  return (
    <ExperienceContext.Provider
      value={{
        state,
        markPart1Done,
        markInterfaceDone,
        markBelaDone,
        markMovie1Done,
        markMovie2Done,
        markMovie3Done,
        resetExperience,
      }}
    >
      {children}
    </ExperienceContext.Provider>
  )
}

export function useExperience() {
  const context = useContext(ExperienceContext)
  if (context === undefined) {
    throw new Error('useExperience must be used within ExperienceProvider')
  }
  return context
}
