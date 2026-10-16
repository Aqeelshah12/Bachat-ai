import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function Signup() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      setError(t('signup.errorFields'))
      return
    }
    if (form.password.length < 6) {
      setError(t('signup.errorPassword'))
      return
    }
    setError('')

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || t('signup.errorFields'))
        return
      }

      localStorage.setItem('bachat_token', data.token)
      localStorage.setItem('bachat_user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch (err) {
      setError(t('signup.errorServer'))
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Brand panel */}
      <div className="hidden md:flex flex-col justify-between bg-ink text-paper p-12">
        <Link to="/" className="font-display text-2xl">
          Bachat AI
        </Link>
        <div>
          <p className="font-display text-3xl leading-snug">{t('signup.quote')}</p>
          <p className="mt-4 text-paper/60 text-sm">{t('signup.quoteSub')}</p>
        </div>
        <p className="text-paper/40 text-xs">Site by Toheed Saif and Aqeel Naqvi</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="md:hidden font-display text-2xl text-ink block mb-10">
            Bachat AI
          </Link>
          <h1 className="font-display text-3xl text-ink">{t('signup.title')}</h1>
          <p className="mt-2 text-ink/60 text-sm">{t('signup.subtitle')}</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-ink/80 mb-1.5">
                {t('signup.name')}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-marigold/60"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink/80 mb-1.5">
                {t('signup.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-marigold/60"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink/80 mb-1.5">
                {t('signup.password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-marigold/60"
                placeholder="At least 6 characters"
              />
            </div>

            {error && (
              <p className="text-sm text-rose" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-ink text-paper py-3.5 rounded-xl text-sm font-medium hover:bg-ink/90 transition-colors"
            >
              {t('signup.submit')}
            </button>
          </form>

          <p className="mt-8 text-sm text-ink/60">
            {t('signup.haveAccount')}{' '}
            <Link to="/login" className="text-ink font-medium underline underline-offset-4">
              {t('signup.login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
