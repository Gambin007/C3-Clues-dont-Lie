'use client'

import { useState, useEffect } from 'react'
import { WindowProvider } from '@interface/contexts/WindowContext'
import { PuzzleProvider } from '@interface/contexts/PuzzleContext'
import MenuBar from '@interface/components/MenuBar'
import Desktop from '@interface/components/Desktop'
import Dock from '@interface/components/Dock'
import IntroOverlay from '@interface/components/IntroOverlay'
import LoginScreen from '@interface/components/LoginScreen'
import GoalOverlay from '@interface/components/GoalOverlay'
import LogoutConfirmModal from '@interface/components/LogoutConfirmModal'
import Spotlight from '@interface/components/Spotlight'

// State-Maschine: 'intro' | 'login' | 'desktop'
export default function Home() {
  const [screen, setScreen] = useState('intro')
  const [showGoalOverlay, setShowGoalOverlay] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showSpotlight, setShowSpotlight] = useState(false)

  useEffect(() => {
    // Prüfe ob bereits eingeloggt (sessionStorage)
    if (typeof window !== 'undefined') {
      const loggedIn = sessionStorage.getItem('loggedIn')
      const goalOverlayShown = sessionStorage.getItem('goalOverlayShown')
      if (loggedIn === 'true') {
        setScreen('desktop')
        // Zeige GoalOverlay nur wenn es noch nicht gezeigt wurde
        if (goalOverlayShown !== 'true') {
          setShowGoalOverlay(true)
        }
        return
      }
    }

  }, [])

  // Spotlight via Cmd+Space
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ' ') {
        e.preventDefault()
        if (screen === 'desktop') {
          setShowSpotlight(true)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [screen])

  const handleIntroContinue = () => {
    setScreen('login')
  }

  const handleLoginSuccess = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('loggedIn', 'true')
      // GoalOverlay wird nach Login angezeigt
      setShowGoalOverlay(true)
    }
    setScreen('desktop')
  }

  const handleGoalOverlayContinue = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('goalOverlayShown', 'true')
    }
    setShowGoalOverlay(false)
  }

  const handleLogoutClick = () => {
    setShowLogoutModal(true)
  }

  const handleLogoutConfirm = () => {
    // State zurücksetzen
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('loggedIn')
      sessionStorage.removeItem('goalOverlayShown')
    }
    setShowLogoutModal(false)
    setShowGoalOverlay(false)
    setScreen('login')
  }

  const handleLogoutCancel = () => {
    setShowLogoutModal(false)
  }

  // Render basierend auf State
  if (screen === 'intro') {
    return <IntroOverlay onContinue={handleIntroContinue} />
  }

  if (screen === 'login') {
    return <LoginScreen onLogin={handleLoginSuccess} />
  }

  // screen === 'desktop'
  // Rätsel 1 startet automatisch, sobald Desktop sichtbar ist
  return (
    <>
      {showGoalOverlay && <GoalOverlay onContinue={handleGoalOverlayContinue} />}
      {showLogoutModal && (
        <LogoutConfirmModal
          onConfirm={handleLogoutConfirm}
          onCancel={handleLogoutCancel}
        />
      )}
      <PuzzleProvider>
        <Spotlight isOpen={showSpotlight} onClose={() => setShowSpotlight(false)} />
        <WindowProvider>
          <MenuBar onLogout={handleLogoutClick} />
          <Desktop />
          <Dock />
        </WindowProvider>
      </PuzzleProvider>
    </>
  )
}
