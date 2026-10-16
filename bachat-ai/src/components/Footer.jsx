import { useLanguage } from '../context/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-ink/10 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p className="font-display text-xl text-ink">Bachat AI</p>
          <p className="text-sm text-ink/60 mt-1">{t('footer.tagline')}</p>
        </div>
        <p className="text-sm text-ink/50">{t('footer.line')}</p>
      </div>
    </footer>
  )
}
