import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import Calculator from './Calculator'

const languageLabels = { en: 'EN', ur: 'اردو', roman: 'Roman' }

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [calculatorOpen, setCalculatorOpen] = useState(false)
  const { pathname } = useLocation()
  const { language, setLanguage, t } = useLanguage()
  const isDashboard = pathname === '/dashboard'

  return (
    <header className="border-b border-ink/10">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-20">
        <Link to="/" className="font-display text-2xl text-ink" onClick={() => setOpen(false)}>
          Bachat AI
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {!isDashboard && (
            <>
              <a href="#how-it-works" className="text-sm text-ink/70 hover:text-ink transition-colors">
                {t('nav.howItWorks')}
              </a>
              <a href="#features" className="text-sm text-ink/70 hover:text-ink transition-colors">
                {t('nav.features')}
              </a>
            </>
          )}

          {/* Calculator */}
          <button
            onClick={() => setCalculatorOpen(true)}
            aria-label="Open calculator"
            className="text-sm text-ink/70 hover:text-ink transition-colors border border-ink/15 rounded-full px-3 py-1.5"
          >
            🧮
          </button>

          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="text-sm text-ink/70 hover:text-ink transition-colors border border-ink/15 rounded-full px-3 py-1.5"
            >
              {languageLabels[language]}
            </button>
            {langMenuOpen && (
              <div className="absolute right-0 mt-2 bg-paper border border-ink/10 rounded-xl shadow-lg overflow-hidden z-10">
                {Object.entries(languageLabels).map(([code, label]) => (
                  <button
                    key={code}
                    onClick={() => {
                      setLanguage(code)
                      setLangMenuOpen(false)
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-sand transition-colors ${
                      code === language ? 'text-marigold font-medium' : 'text-ink/80'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isDashboard ? (
            <Link to="/" className="text-sm text-ink/70 hover:text-ink transition-colors">
              {t('nav.logout')}
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm text-ink/70 hover:text-ink transition-colors">
                {t('nav.login')}
              </Link>
              <Link
                to="/signup"
                className="text-sm bg-ink text-paper px-5 py-2.5 rounded-full hover:bg-ink/90 transition-colors"
              >
                {t('nav.getStarted')}
              </Link>
            </>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className={`block w-6 h-0.5 bg-ink transition-transform ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-ink transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-ink transition-transform ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden flex flex-col gap-1 px-6 pb-6 border-t border-ink/10 pt-4">
          {!isDashboard && (
            <>
              <a href="#how-it-works" className="py-3 text-ink/80" onClick={() => setOpen(false)}>
                {t('nav.howItWorks')}
              </a>
              <a href="#features" className="py-3 text-ink/80" onClick={() => setOpen(false)}>
                {t('nav.features')}
              </a>
            </>
          )}

          <button
            onClick={() => {
              setCalculatorOpen(true)
              setOpen(false)
            }}
            className="py-3 text-left text-ink/80"
          >
            🧮 Calculator
          </button>

          <div className="py-3 flex gap-2">
            {Object.entries(languageLabels).map(([code, label]) => (
              <button
                key={code}
                onClick={() => setLanguage(code)}
                className={`text-sm border rounded-full px-3 py-1.5 ${
                  code === language ? 'border-marigold text-marigold' : 'border-ink/15 text-ink/70'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {isDashboard ? (
            <Link to="/" className="py-3 text-ink/80" onClick={() => setOpen(false)}>
              {t('nav.logout')}
            </Link>
          ) : (
            <>
              <Link to="/login" className="py-3 text-ink/80" onClick={() => setOpen(false)}>
                {t('nav.login')}
              </Link>
              <Link
                to="/signup"
                className="mt-2 text-center bg-ink text-paper px-5 py-3 rounded-full"
                onClick={() => setOpen(false)}
              >
                {t('nav.getStarted')}
              </Link>
            </>
          )}
        </nav>
      )}

      {calculatorOpen && <Calculator onClose={() => setCalculatorOpen(false)} />}
    </header>
  )
}