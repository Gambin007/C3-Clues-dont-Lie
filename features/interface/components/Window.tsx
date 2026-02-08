'use client'

import { useEffect, useRef, useState } from 'react'
import { WindowState, useWindows } from '@interface/contexts/WindowContext'
import { AppShellProvider, useAppShell } from '@interface/contexts/AppShellContext'
import { APP_CONFIGS } from './apps/appConfigs'

interface WindowProps {
  windowState: WindowState
}

export default function Window({ windowState }: WindowProps) {
  const {
    closeWindow,
    minimizeWindow,
    toggleFullscreen,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    windows,
  } = useWindows()

  const windowRef = useRef<HTMLDivElement>(null)
  const titlebarRef = useRef<HTMLDivElement>(null)
  const resizeHandleRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0, left: 0, top: 0 })
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 })

  const appConfig = APP_CONFIGS[windowState.appId]
  if (!appConfig) return null

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && titlebarRef.current) {
        const dx = e.clientX - dragStartRef.current.x
        const dy = e.clientY - dragStartRef.current.y
        const newX = Math.max(6, Math.min(
          dragStartRef.current.left + dx,
          window.innerWidth - windowState.width - 6
        ))
        const newY = Math.max(34, Math.min(
          dragStartRef.current.top + dy,
          window.innerHeight - windowState.height - 48
        ))
        updateWindowPosition(windowState.id, newX, newY)
      }
      if (isResizing && resizeHandleRef.current && windowState.resizable !== false) {
        const dx = e.clientX - resizeStartRef.current.x
        const dy = e.clientY - resizeStartRef.current.y
        const newWidth = Math.max(280, resizeStartRef.current.width + dx)
        const newHeight = Math.max(180, resizeStartRef.current.height + dy)
        updateWindowSize(windowState.id, newWidth, newHeight)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, isResizing, windowState, updateWindowPosition, updateWindowSize])

  const handleTitlebarMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    const target = e.target as HTMLElement
    if (target.closest('.traffic') || target.closest('[data-action]')) return
    if (['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT', 'LABEL'].includes(target.tagName)) return
    
    focusWindow(windowState.id)
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      left: windowState.x,
      top: windowState.y,
    }
  }

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    if (windowState.resizable === false) return // Nicht resizable
    focusWindow(windowState.id)
    setIsResizing(true)
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: windowState.width,
      height: windowState.height,
    }
  }

  const handleDoubleClick = () => {
    toggleFullscreen(windowState.id)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.querySelector('.window.active') !== windowRef.current) return
      if (e.key === 'Escape') closeWindow(windowState.id)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault()
        minimizeWindow(windowState.id)
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'Enter' || e.key.toLowerCase() === 'f')) {
        e.preventDefault()
        toggleFullscreen(windowState.id)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [windowState.id, closeWindow, minimizeWindow, toggleFullscreen])

  if (windowState.minimized) return null

  const style: React.CSSProperties = windowState.fullscreen
    ? {
        left: '10px',
        top: '34px',
        width: `${window.innerWidth - 20}px`,
        height: `${window.innerHeight - 60}px`,
        zIndex: windowState.zIndex,
      }
    : {
        left: `${windowState.x}px`,
        top: `${windowState.y}px`,
        width: `${windowState.width}px`,
        height: `${windowState.height}px`,
        zIndex: windowState.zIndex,
      }

  const AppComponent = appConfig.component
  const isActive = windowState.zIndex === Math.max(...windows.map(w => w.zIndex))

  return (
    <AppShellProvider>
      <WindowContent
        windowRef={windowRef}
        titlebarRef={titlebarRef}
        resizeHandleRef={resizeHandleRef}
        windowState={windowState}
        style={style}
        isActive={isActive}
        appConfig={appConfig}
        AppComponent={AppComponent}
        handleTitlebarMouseDown={handleTitlebarMouseDown}
        handleDoubleClick={handleDoubleClick}
        handleResizeMouseDown={handleResizeMouseDown}
        closeWindow={closeWindow}
        minimizeWindow={minimizeWindow}
        toggleFullscreen={toggleFullscreen}
        focusWindow={focusWindow}
      />
    </AppShellProvider>
  )
}

function WindowContent({
  windowRef,
  titlebarRef,
  resizeHandleRef,
  windowState,
  style,
  isActive,
  appConfig,
  AppComponent,
  handleTitlebarMouseDown,
  handleDoubleClick,
  handleResizeMouseDown,
  closeWindow,
  minimizeWindow,
  toggleFullscreen,
  focusWindow,
}: {
  windowRef: React.RefObject<HTMLDivElement>
  titlebarRef: React.RefObject<HTMLDivElement>
  resizeHandleRef: React.RefObject<HTMLDivElement>
  windowState: WindowState
  style: React.CSSProperties
  isActive: boolean
  appConfig: any
  AppComponent: React.ComponentType<{ windowId: string }>
  handleTitlebarMouseDown: (e: React.MouseEvent) => void
  handleDoubleClick: () => void
  handleResizeMouseDown: (e: React.MouseEvent) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  toggleFullscreen: (id: string) => void
  focusWindow: (id: string) => void
}) {
  const { bottomBar } = useAppShell()

  return (
    <section
      ref={windowRef}
      className={`window ${isActive ? 'active' : ''}`}
      style={style}
      data-app={windowState.appId}
      onMouseDown={() => focusWindow(windowState.id)}
    >
      <header
        ref={titlebarRef}
        className="titlebar"
        data-drag
        onMouseDown={handleTitlebarMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        <div className="traffic">
          <div
            className="dot close"
            data-action="close"
            title="Close"
            onClick={(e) => {
              e.stopPropagation()
              closeWindow(windowState.id)
            }}
          />
          <div
            className="dot min"
            data-action="min"
            title="Minimize"
            onClick={(e) => {
              e.stopPropagation()
              minimizeWindow(windowState.id)
            }}
          />
          <div
            className="dot max"
            data-action="max"
            title="Full Screen"
            onClick={(e) => {
              e.stopPropagation()
              toggleFullscreen(windowState.id)
            }}
          />
        </div>
        <div className="title">
          {appConfig.title.split('').map((char: string, index: number) => (
            <span key={index} className={index === 0 ? 'title-first' : ''}>
              {char}
            </span>
          ))}
        </div>
      </header>
      <div className="appShell">
        <div className="appShellContent">
          <AppComponent windowId={windowState.id} />
        </div>
        {bottomBar && (
          <div className="appShellBottom">
            {bottomBar}
          </div>
        )}
      </div>
      {!windowState.fullscreen && windowState.resizable !== false && (
        <div
          ref={resizeHandleRef}
          className="resize-handle"
          data-resize
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </section>
  )
}
