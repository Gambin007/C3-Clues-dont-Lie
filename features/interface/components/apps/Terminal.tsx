'use client'

import { useState, useEffect, useRef } from 'react'
import { usePuzzle } from '@interface/contexts/PuzzleContext'

interface TerminalLine {
  type: 'command' | 'output' | 'error'
  content: string
  prompt?: string
}

const PROMPT = 'lisa@macbook ~ %'

// Initiale History mit Rätselhinweis (verwirrend, aber T versteckt)
const getInitialHistory = (): TerminalLine[] => [
  { type: 'output', content: 'last login: Sat 23:41 on ttys001' },
  { type: 'command', content: 'cd ~/Documents', prompt: PROMPT },
  { type: 'output', content: '' },
  { type: 'command', content: 'ls -la', prompt: PROMPT },
  { type: 'output', content: 'total 48' },
  { type: 'output', content: 'drwxr-xr-x  8 lisa  staff   256 Jan 17 14:20 .' },
  { type: 'output', content: 'drwxr-xr-x  14 lisa  staff   448 Jan 17 14:20 ..' },
  { type: 'output', content: '-rw-r--r--  1 lisa  staff  2048 Jan 16 10:15 artikel_draft.md' },
  { type: 'output', content: '-rw-r--r--  1 lisa  staff  1024 Jan 15 09:30 notes.txt' },
  { type: 'output', content: 'drwxr-xr-x  2 lisa  staff    64 Jan 14 16:00 research' },
  { type: 'command', content: 'cat notes.txt', prompt: PROMPT },
  { type: 'output', content: 'Recherche Notizen...' },
  { type: 'output', content: 'Quelle A: bestätigt' },
  { type: 'output', content: 'Quelle B: noch offen' },
  { type: 'command', content: 'cd research', prompt: PROMPT },
  { type: 'output', content: '' },
  { type: 'command', content: 'ls', prompt: PROMPT },
  { type: 'output', content: 'quelle_interview.txt  dokumente.pdf  bilder/' },
  { type: 'command', content: 'grep -i "wichtig" quelle_interview.txt', prompt: PROMPT },
  { type: 'output', content: 'keine Treffer' },
  { type: 'command', content: 'whoami', prompt: PROMPT },
  { type: 'output', content: 'lisa' },
  { type: 'command', content: 'pwd', prompt: PROMPT },
  { type: 'output', content: '/Users/lisa/Documents/research' },
  { type: 'command', content: 'cd ~', prompt: PROMPT },
  { type: 'output', content: '' },
  { type: 'command', content: 'history | tail -20', prompt: PROMPT },
  { type: 'output', content: '...' },
  { type: 'command', content: 'date', prompt: PROMPT },
  { type: 'output', content: 'Sat Jan 17 23:42:15 CET 2024' },
  { type: 'command', content: 'mkdir temp', prompt: PROMPT },
  { type: 'output', content: '' },
  { type: 'command', content: 'cd temp', prompt: PROMPT },
  { type: 'output', content: '' },
  { type: 'command', content: 'echo "test" > test.txt', prompt: PROMPT },
  { type: 'output', content: '' },
  { type: 'command', content: 'cat test.txt', prompt: PROMPT },
  { type: 'output', content: 'test' },
  { type: 'command', content: 'rm test.txt', prompt: PROMPT },
  { type: 'output', content: '' },
  { type: 'command', content: 'cd ..', prompt: PROMPT },
  { type: 'output', content: '' },
  { type: 'command', content: 'rmdir temp', prompt: PROMPT },
  { type: 'output', content: '' },
  { type: 'output', content: 'letzter Buchstabe = **T**' },
  { type: 'command', content: 'open .', prompt: PROMPT },
  { type: 'output', content: '' },
  { type: 'command', content: 'ping -c 1 google.com', prompt: PROMPT },
  { type: 'output', content: 'PING google.com (142.250.185.14): 56 data bytes' },
  { type: 'output', content: '64 bytes from 142.250.185.14: icmp_seq=0 ttl=118 time=12.345 ms' },
  { type: 'output', content: '--- google.com ping statistics ---' },
  { type: 'output', content: '1 packets transmitted, 1 received, 0.0% packet loss' },
  { type: 'command', content: 'curl -I https://example.com', prompt: PROMPT },
  { type: 'output', content: 'HTTP/2 200' },
  { type: 'output', content: 'content-type: text/html' },
  { type: 'command', content: 'grep -r "keyword" ~/Documents', prompt: PROMPT },
  { type: 'output', content: 'grep: Documents/research/bilder: Is a directory' },
  { type: 'output', content: 'Documents/artikel_draft.md:3:keyword found here' },
  { type: 'command', content: 'find ~/Documents -name "*.txt"', prompt: PROMPT },
  { type: 'output', content: '/Users/lisa/Documents/notes.txt' },
  { type: 'command', content: 'wc -l ~/Documents/notes.txt', prompt: PROMPT },
  { type: 'output', content: '      12 /Users/lisa/Documents/notes.txt' },
  { type: 'command', content: 'head -5 ~/Documents/notes.txt', prompt: PROMPT },
  { type: 'output', content: 'Recherche Notizen...' },
  { type: 'output', content: 'Quelle A: bestätigt' },
  { type: 'output', content: 'Quelle B: noch offen' },
  { type: 'command', content: 'tail -3 ~/Documents/notes.txt', prompt: PROMPT },
  { type: 'output', content: 'Treffe Quelle – Bahnhof?' },
  { type: 'command', content: 'ls -lh ~/Documents', prompt: PROMPT },
  { type: 'output', content: 'total 3.0K' },
  { type: 'output', content: '-rw-r--r--  1 lisa  staff  2.0K Jan 16 10:15 artikel_draft.md' },
  { type: 'output', content: '-rw-r--r--  1 lisa  staff  1.0K Jan 15 09:30 notes.txt' },
  { type: 'output', content: 'drwxr-xr-x  3 lisa  staff    96 Jan 14 16:00 research' },
  { type: 'command', content: 'cat ~/Documents/artikel_draft.md | head -10', prompt: PROMPT },
  { type: 'output', content: '# Artikel Entwurf' },
  { type: 'output', content: '' },
  { type: 'output', content: 'Einleitung...' },
  { type: 'command', content: 'which python3', prompt: PROMPT },
  { type: 'output', content: '/usr/bin/python3' },
  { type: 'command', content: 'python3 --version', prompt: PROMPT },
  { type: 'output', content: 'Python 3.9.6' },
  { type: 'command', content: 'echo $SHELL', prompt: PROMPT },
  { type: 'output', content: '/bin/zsh' },
  { type: 'command', content: 'env | grep USER', prompt: PROMPT },
  { type: 'output', content: 'USER=lisa' },
  { type: 'command', content: 'uname -a', prompt: PROMPT },
  { type: 'output', content: 'Darwin macbook.local 21.6.0 Darwin Kernel Version 21.6.0' },
  { type: 'command', content: 'df -h /', prompt: PROMPT },
  { type: 'output', content: 'Filesystem      Size   Used  Avail Capacity  Mounted on' },
  { type: 'output', content: '/dev/disk1s1   250Gi   180Gi   65Gi    74%    /' },
  { type: 'command', content: 'ps aux | grep -i terminal', prompt: PROMPT },
  { type: 'output', content: 'lisa  1234  0.1  0.5  terminal' },
  { type: 'command', content: 'top -l 1 | head -5', prompt: PROMPT },
  { type: 'output', content: 'Processes: 234 total, 2 running, 232 sleeping' },
  { type: 'output', content: 'CPU usage: 12.5% user, 5.2% sys, 82.3% idle' },
  { type: 'command', content: 'system_profiler SPSoftwareDataType | grep "System Version"', prompt: PROMPT },
  { type: 'output', content: '      System Version: macOS 12.6' },
  { type: 'command', content: 'defaults read com.apple.Terminal', prompt: PROMPT },
  { type: 'output', content: '...' },
  { type: 'command', content: 'cd ~/Desktop', prompt: PROMPT },
  { type: 'output', content: '' },
  { type: 'command', content: 'ls', prompt: PROMPT },
  { type: 'output', content: 'Melina  Projekte  Dokumente  Downloads  Bilder  Musik  Videos' },
  { type: 'command', content: 'file Melina', prompt: PROMPT },
  { type: 'output', content: 'Melina: directory' },
  { type: 'command', content: 'du -sh ~/Documents', prompt: PROMPT },
  { type: 'output', content: '2.5M  /Users/lisa/Documents' },
  { type: 'command', content: 'tar -czf backup.tar.gz ~/Documents', prompt: PROMPT },
  { type: 'output', content: '' },
  { type: 'command', content: 'ls -lh backup.tar.gz', prompt: PROMPT },
  { type: 'output', content: '-rw-r--r--  1 lisa  staff  2.1M Jan 17 23:45 backup.tar.gz' },
  { type: 'command', content: 'rm backup.tar.gz', prompt: PROMPT },
  { type: 'output', content: '' },
  { type: 'command', content: 'cd ~', prompt: PROMPT },
  { type: 'output', content: '' },
  { type: 'command', content: 'history | wc -l', prompt: PROMPT },
  { type: 'output', content: '     487' },
  { type: 'command', content: 'alias', prompt: PROMPT },
  { type: 'output', content: 'll=ls -la' },
  { type: 'output', content: 'g=git' },
  { type: 'command', content: 'type ls', prompt: PROMPT },
  { type: 'output', content: 'ls is /bin/ls' },
  { type: 'command', content: 'which git', prompt: PROMPT },
  { type: 'output', content: '/usr/bin/git' },
  { type: 'command', content: 'git --version', prompt: PROMPT },
  { type: 'output', content: 'git version 2.32.0' },
  { type: 'command', content: 'cd ~/Documents/research', prompt: PROMPT },
  { type: 'output', content: '' },
  { type: 'command', content: 'ls -la bilder/', prompt: PROMPT },
  { type: 'output', content: 'total 0' },
  { type: 'output', content: 'drwxr-xr-x  3 lisa  staff   96 Jan 14 16:00 .' },
  { type: 'output', content: 'drwxr-xr-x  3 lisa  staff   96 Jan 14 16:00 ..' },
  { type: 'command', content: 'cat quelle_interview.txt | wc -w', prompt: PROMPT },
  { type: 'output', content: '     234' },
  { type: 'command', content: 'grep -n "wichtig" quelle_interview.txt', prompt: PROMPT },
  { type: 'output', content: 'keine Treffer' },
  { type: 'command', content: 'head -1 quelle_interview.txt', prompt: PROMPT },
  { type: 'output', content: 'Interview mit Quelle A – vertraulich' },
  { type: 'command', content: 'cd ~', prompt: PROMPT },
  { type: 'output', content: '' },
  { type: 'command', content: 'echo $PATH', prompt: PROMPT },
  { type: 'output', content: '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin' },
  { type: 'command', content: 'export TEST_VAR="test"', prompt: PROMPT },
  { type: 'output', content: '' },
  { type: 'command', content: 'echo $TEST_VAR', prompt: PROMPT },
  { type: 'output', content: 'test' },
  { type: 'command', content: 'unset TEST_VAR', prompt: PROMPT },
  { type: 'output', content: '' },
  { type: 'command', content: 'cd ~/Desktop', prompt: PROMPT },
  { type: 'output', content: 'key fragment: ?' },
  { type: 'command', content: 'ls -1', prompt: PROMPT },
  { type: 'output', content: 'Melina' },
  { type: 'output', content: 'Projekte' },
  { type: 'output', content: 'Dokumente' },
  { type: 'output', content: 'Downloads' },
  { type: 'output', content: 'Bilder' },
  { type: 'output', content: 'Musik' },
  { type: 'output', content: 'Videos' },
  { type: 'command', content: 'cd ~', prompt: PROMPT },
  { type: 'output', content: '' },
  { type: 'output', content: 'checking permissions…' },
  { type: 'output', content: 'access denied' },
  { type: 'output', content: 'retrying…' },
  { type: 'command', content: 'clear', prompt: PROMPT },
]

export default function Terminal({ windowId }: { windowId: string }) {
  const { markTFound, unlockVault, vaultUnlocked, foundV, foundA, foundU, foundL, foundT } = usePuzzle()
  const [history, setHistory] = useState<TerminalLine[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [input, setInput] = useState('')
  const [currentPath, setCurrentPath] = useState('~')
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Initialisiere History beim ersten Mount
  useEffect(() => {
    if (!isInitialized) {
      const initialHistory = getInitialHistory()
      setHistory(initialHistory)
      setIsInitialized(true)
      // Markiere T als gefunden beim Öffnen (implizit über History)
      markTFound()
    }
  }, [isInitialized, markTFound])

  useEffect(() => {
    // Auto-focus Input beim Öffnen
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    // Scroll to bottom when history changes
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim()
    
    if (!trimmed) {
      // Leere Eingabe - nur neue Prompt-Zeile
      return
    }

    // Füge Command zur History hinzu
    setHistory(prev => [...prev, { type: 'command', content: cmd, prompt: PROMPT }])

    const trimmedLower = trimmed.toLowerCase()
    
    // WICHTIG: Prüfe unlock VAULT ZUERST (case-insensitive, exakt)
    if (trimmedLower === 'unlock vault') {
      // Schrittweise Ausgabe mit Verzögerung
      setHistory(prev => [...prev, { type: 'output', content: 'verifying…' }])
      
      setTimeout(() => {
        setHistory(prev => [...prev, { type: 'output', content: 'assembling keys…' }])
        
        setTimeout(() => {
          setHistory(prev => [...prev, { type: 'output', content: 'VAULT accepted' }])
          
          setTimeout(() => {
            setHistory(prev => [...prev, { type: 'output', content: 'access granted' }])
            
            setTimeout(() => {
              unlockVault()
              setHistory(prev => [...prev, { type: 'output', content: 'Archiv freigeschaltet.' }])
            }, 300)
          }, 300)
        }, 300)
      }, 300)
      return
    }

    // Parse Command für andere Checks
    const parts = trimmedLower.split(/\s+/)
    const command = parts[0]
    const args = parts.slice(1)

    // Falsche unlock-Versuche
    if (command === 'unlock') {
      if (args.length === 0) {
        // Nur "unlock" ohne Argument
        setHistory(prev => [...prev, { type: 'error', content: 'permission denied' }])
        return
      } else {
        // unlock mit falschem Codewort
        setHistory(prev => [...prev, { type: 'error', content: 'invalid command' }])
        return
      }
    }

    // Optional: Nur "vault" ohne unlock
    if (command === 'vault') {
      setHistory(prev => [...prev, { type: 'error', content: 'permission denied' }])
      return
    }

    // Fake Commands - verwirrende, aber harmlose Antworten
    switch (command) {
      case 'ls':
        setHistory(prev => [...prev, {
          type: 'output',
          content: 'nothing to see here'
        }])
        break

      case 'pwd':
        setHistory(prev => [...prev, {
          type: 'output',
          content: 'permission denied'
        }])
        break

      case 'whoami':
        setHistory(prev => [...prev, {
          type: 'output',
          content: 'command not found'
        }])
        break

      case 'help':
        setHistory(prev => [...prev, {
          type: 'output',
          content: 'nothing to see here'
        }])
        break

      case 'clear':
        setHistory(prev => [])
        return

      case 'cd':
        if (args.length === 0 || args[0] === '~' || args[0] === '') {
          setCurrentPath('~')
          setHistory(prev => [...prev, { type: 'output', content: '' }])
        } else {
          setHistory(prev => [...prev, {
            type: 'error',
            content: 'permission denied'
          }])
        }
        return

      case 'echo':
        const echoText = cmd.substring(5).trim()
        setHistory(prev => [...prev, {
          type: 'output',
          content: echoText || ''
        }])
        break

      case 'date':
        const now = new Date()
        setHistory(prev => [...prev, {
          type: 'output',
          content: now.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            year: 'numeric',
            timeZoneName: 'short'
          })
        }])
        break

      default:
        // Unbekannter Command
        setHistory(prev => [...prev, {
          type: 'error',
          content: `zsh: command not found: ${command}`
        }])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    executeCommand(input)
    setInput('')
    // Focus bleibt auf Input
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
    // Arrow keys für History könnten hier implementiert werden
  }

  return (
    <div className="term-root" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div
        ref={terminalRef}
        className="term-screen"
        style={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          background: '#111318',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '10px',
          fontFamily: 'ui-monospace, monospace',
          fontSize: '13px',
          lineHeight: '1.5',
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((line, i) => (
          <div key={i} className="term-line" style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', margin: '4px 0' }}>
            {line.prompt ? (
              <>
                <div className="term-prompt" style={{ color: '#22d3ee', flexShrink: 0 }}>
                  {line.prompt}
                </div>
                <div style={{ color: 'var(--text)', flex: 1 }}>{line.content}</div>
              </>
            ) : (
              <>
                <div style={{ flexShrink: 0, width: '0' }}></div>
                <div
                  style={{
                    color: line.type === 'error' ? '#ef4444' : line.type === 'output' ? 'var(--text)' : 'var(--text)',
                    flex: 1,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {(() => {
                    const parts = line.content.split(/(\*\*[A-Z]\*\*)/g).filter(p => p !== '')
                    return parts.map((part, idx) => {
                      const boldMatch = part.match(/^\*\*([A-Z])\*\*$/)
                      if (boldMatch) {
                        return <strong key={idx} style={{ fontWeight: 700, color: 'inherit' }}>{boldMatch[1]}</strong>
                      }
                      return <span key={idx}>{part}</span>
                    })
                  })()}
                </div>
              </>
            )}
          </div>
        ))}

        {/* Aktive Input-Zeile */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginTop: '4px' }}>
          <div className="term-prompt" style={{ color: '#22d3ee', flexShrink: 0 }}>
            {PROMPT}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text)',
              fontFamily: 'ui-monospace, monospace',
              fontSize: '13px',
              caretColor: '#22d3ee',
            }}
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  )
}
