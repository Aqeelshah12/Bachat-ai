import { useLanguage } from '../context/LanguageContext'

const options = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ur', label: 'Urdu', native: 'اردو' },
  { code: 'roman', label: 'Roman Urdu', native: 'Roman Urdu' },
]

export default function LanguagePicker() {
  const { setLanguage } = useLanguage()

  return (
    <div className="fixed inset-0 z-50 bg-ink flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <p className="font-display text-3xl text-paper">Bachat AI</p>
        <h1 className="mt-8 font-display text-2xl text-paper">Choose your language</h1>
        <p className="mt-2 text-paper/60 text-sm">
          آپ اسے بعد میں بدل سکتے ہیں · Aap ise baad mein badal sakte hain
        </p>

        <div className="mt-8 space-y-3">
          {options.map((opt) => (
            <button
              key={opt.code}
              onClick={() => setLanguage(opt.code)}
              className="group w-full bg-paper/10 hover:bg-marigold border border-paper/20 text-paper hover:text-ink rounded-xl py-4 text-lg font-medium transition-colors"
            >
              {opt.native}
              {opt.native !== opt.label && (
                <span className="block text-sm text-paper/50 group-hover:text-ink/60 mt-0.5">
                  {opt.label}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
