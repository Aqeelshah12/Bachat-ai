import { useState } from 'react'

export default function Calculator({ onClose }) {
  const [display, setDisplay] = useState('0')
  const [prevValue, setPrevValue] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  function inputDigit(digit) {
    if (waitingForOperand) {
      setDisplay(String(digit))
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit)
    }
  }

  function inputDecimal() {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
      return
    }
    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  function clearAll() {
    setDisplay('0')
    setPrevValue(null)
    setOperator(null)
    setWaitingForOperand(false)
  }

  function toggleSign() {
    setDisplay(String(parseFloat(display) * -1))
  }

  function inputPercent() {
    setDisplay(String(parseFloat(display) / 100))
  }

  function calculate(a, b, op) {
    switch (op) {
      case '+':
        return a + b
      case '−':
        return a - b
      case '×':
        return a * b
      case '÷':
        return b === 0 ? NaN : a / b
      default:
        return b
    }
  }

  function performOperation(nextOperator) {
    const inputValue = parseFloat(display)

    if (prevValue === null) {
      setPrevValue(inputValue)
    } else if (operator) {
      const result = calculate(prevValue, inputValue, operator)
      setDisplay(String(Number.isNaN(result) ? 'Error' : result))
      setPrevValue(Number.isNaN(result) ? null : result)
    }

    setWaitingForOperand(true)
    setOperator(nextOperator)
  }

  function handleEquals() {
    const inputValue = parseFloat(display)
    if (operator === null || prevValue === null) return
    const result = calculate(prevValue, inputValue, operator)
    setDisplay(String(Number.isNaN(result) ? 'Error' : result))
    setPrevValue(null)
    setOperator(null)
    setWaitingForOperand(true)
  }

  const buttons = [
    { label: 'C', onClick: clearAll },
    { label: '+/-', onClick: toggleSign },
    { label: '%', onClick: inputPercent },
    { label: '÷', onClick: () => performOperation('÷'), className: 'bg-marigold text-ink hover:bg-marigold/90' },

    { label: '7', onClick: () => inputDigit(7) },
    { label: '8', onClick: () => inputDigit(8) },
    { label: '9', onClick: () => inputDigit(9) },
    { label: '×', onClick: () => performOperation('×'), className: 'bg-marigold text-ink hover:bg-marigold/90' },

    { label: '4', onClick: () => inputDigit(4) },
    { label: '5', onClick: () => inputDigit(5) },
    { label: '6', onClick: () => inputDigit(6) },
    { label: '−', onClick: () => performOperation('−'), className: 'bg-marigold text-ink hover:bg-marigold/90' },

    { label: '1', onClick: () => inputDigit(1) },
    { label: '2', onClick: () => inputDigit(2) },
    { label: '3', onClick: () => inputDigit(3) },
    { label: '+', onClick: () => performOperation('+'), className: 'bg-marigold text-ink hover:bg-marigold/90' },

    { label: '0', onClick: () => inputDigit(0), className: 'col-span-2 bg-paper/10 text-paper hover:bg-paper/20' },
    { label: '.', onClick: inputDecimal },
    { label: '=', onClick: handleEquals, className: 'bg-marigold text-ink hover:bg-marigold/90' },
  ]

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/60 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs bg-ink rounded-3xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-paper/70 text-sm font-medium">Calculator</p>
          <button
            onClick={onClose}
            aria-label="Close calculator"
            className="text-paper/60 hover:text-paper text-xl leading-none px-2"
          >
            ×
          </button>
        </div>

        <div className="bg-paper/10 rounded-xl px-4 py-5 mb-4 text-right">
          <p className="text-paper text-3xl font-display truncate">{display}</p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {buttons.map((btn) => (
            <button
              key={btn.label}
              onClick={btn.onClick}
              className={`py-3.5 rounded-xl text-sm font-medium transition-colors ${
                btn.className || 'bg-paper/10 text-paper hover:bg-paper/20'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}