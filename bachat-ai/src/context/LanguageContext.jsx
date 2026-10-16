import { createContext, useContext, useState, useEffect } from 'react'
import translations from '../i18n/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('bachat_language') || null
  })

  useEffect(() => {
    // Urdu is the only one written in a right-to-left script.
    // Roman Urdu and English are both Latin script, so both stay left-to-right.
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr'
    document.documentElement.lang = language || 'en'
  }, [language])

  function setLanguage(lang) {
    localStorage.setItem('bachat_language', lang)
    setLanguageState(lang)
  }

  // t('dashboard.greeting') looks up translations[language].dashboard.greeting
  function t(path) {
    const activeLang = language || 'en'
    const keys = path.split('.')
    let value = translations[activeLang]
    for (const key of keys) {
      value = value?.[key]
    }
    return value || path
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
