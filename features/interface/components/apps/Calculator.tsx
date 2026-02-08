'use client'

import { useState } from 'react'

export default function Calculator({ windowId }: { windowId: string }) {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForNewValue, setWaitingForNewValue] = useState(false)

  const handleNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num)
      setWaitingForNewValue(false)
    } else {
      setDisplay(display === '0' ? num : display + num)
    }
  }

  const handleOperation = (op: string) => {
    const currentValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(currentValue)
    } else if (operation) {
      const result = calculate(previousValue, currentValue, operation)
      setDisplay(String(result))
      setPreviousValue(result)
    }

    setWaitingForNewValue(true)
    setOperation(op)
  }

  const calculate = (prev: number, current: number, op: string): number => {
    switch (op) {
      case '+':
        return prev + current
      case '-':
        return prev - current
      case '×':
        return prev * current
      case '÷':
        return prev / current
      default:
        return current
    }
  }

  const handleEquals = () => {
    if (previousValue !== null && operation) {
      const currentValue = parseFloat(display)
      const result = calculate(previousValue, currentValue, operation)
      setDisplay(String(result))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForNewValue(true)
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForNewValue(false)
  }

  const handleDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.')
      setWaitingForNewValue(false)
    } else if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const handleToggleSign = () => {
    if (display !== '0') {
      setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display)
    }
  }

  const handlePercent = () => {
    const value = parseFloat(display) / 100
    setDisplay(String(value))
  }

  const buttonStyle = (isOperator = false, isZero = false) => ({
    gridColumn: isZero ? 'span 2' : 'span 1',
    padding: '16px',
    fontSize: '20px',
    fontWeight: 500,
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    background: isOperator 
      ? '#ff9500' 
      : isZero 
        ? '#2a2b33' 
        : '#3a3b44',
    color: isOperator ? '#fff' : 'var(--text)',
    transition: 'all 0.1s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  })

  const buttonHoverStyle = {
    filter: 'brightness(1.1)',
    transform: 'scale(0.98)',
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
    }}>
      {/* Display */}
      <div style={{
        background: '#000',
        borderRadius: '12px',
        padding: '24px 20px',
        marginBottom: '20px',
        minHeight: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}>
        <div style={{
          fontSize: '48px',
          fontWeight: 300,
          color: '#fff',
          fontFamily: 'ui-monospace, monospace',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '100%',
        }}>
          {display}
        </div>
      </div>

      {/* Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        flex: 1,
      }}>
        {/* Row 1 */}
        <button
          onClick={handleClear}
          style={buttonStyle(false, false)}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = ''
            e.currentTarget.style.transform = ''
          }}
        >
          C
        </button>
        <button
          onClick={handleToggleSign}
          style={buttonStyle(false, false)}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = ''
            e.currentTarget.style.transform = ''
          }}
        >
          ±
        </button>
        <button
          onClick={handlePercent}
          style={buttonStyle(false, false)}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = ''
            e.currentTarget.style.transform = ''
          }}
        >
          %
        </button>
        <button
          onClick={() => handleOperation('÷')}
          style={buttonStyle(true, false)}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = ''
            e.currentTarget.style.transform = ''
          }}
        >
          ÷
        </button>

        {/* Row 2 */}
        <button
          onClick={() => handleNumber('7')}
          style={buttonStyle(false, false)}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = ''
            e.currentTarget.style.transform = ''
          }}
        >
          7
        </button>
        <button
          onClick={() => handleNumber('8')}
          style={buttonStyle(false, false)}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = ''
            e.currentTarget.style.transform = ''
          }}
        >
          8
        </button>
        <button
          onClick={() => handleNumber('9')}
          style={buttonStyle(false, false)}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = ''
            e.currentTarget.style.transform = ''
          }}
        >
          9
        </button>
        <button
          onClick={() => handleOperation('×')}
          style={buttonStyle(true, false)}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = ''
            e.currentTarget.style.transform = ''
          }}
        >
          ×
        </button>

        {/* Row 3 */}
        <button
          onClick={() => handleNumber('4')}
          style={buttonStyle(false, false)}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = ''
            e.currentTarget.style.transform = ''
          }}
        >
          4
        </button>
        <button
          onClick={() => handleNumber('5')}
          style={buttonStyle(false, false)}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = ''
            e.currentTarget.style.transform = ''
          }}
        >
          5
        </button>
        <button
          onClick={() => handleNumber('6')}
          style={buttonStyle(false, false)}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = ''
            e.currentTarget.style.transform = ''
          }}
        >
          6
        </button>
        <button
          onClick={() => handleOperation('-')}
          style={buttonStyle(true, false)}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = ''
            e.currentTarget.style.transform = ''
          }}
        >
          −
        </button>

        {/* Row 4 */}
        <button
          onClick={() => handleNumber('1')}
          style={buttonStyle(false, false)}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = ''
            e.currentTarget.style.transform = ''
          }}
        >
          1
        </button>
        <button
          onClick={() => handleNumber('2')}
          style={buttonStyle(false, false)}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = ''
            e.currentTarget.style.transform = ''
          }}
        >
          2
        </button>
        <button
          onClick={() => handleNumber('3')}
          style={buttonStyle(false, false)}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = ''
            e.currentTarget.style.transform = ''
          }}
        >
          3
        </button>
        <button
          onClick={() => handleOperation('+')}
          style={buttonStyle(true, false)}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = ''
            e.currentTarget.style.transform = ''
          }}
        >
          +
        </button>

        {/* Row 5 */}
        <button
          onClick={() => handleNumber('0')}
          style={buttonStyle(false, true)}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = ''
            e.currentTarget.style.transform = ''
          }}
        >
          0
        </button>
        <button
          onClick={handleDecimal}
          style={buttonStyle(false, false)}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = ''
            e.currentTarget.style.transform = ''
          }}
        >
          .
        </button>
        <button
          onClick={handleEquals}
          style={buttonStyle(true, false)}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = ''
            e.currentTarget.style.transform = ''
          }}
        >
          =
        </button>
      </div>
    </div>
  )
}
