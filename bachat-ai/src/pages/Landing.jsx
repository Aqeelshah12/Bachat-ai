import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function Landing() {
  const { t } = useLanguage()

  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-20 grid md:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <div>
          <h1 className="font-display text-[2.75rem] leading-[1.05] md:text-[3.75rem] md:leading-[1.05] text-ink">
            {t('landing.heroLine1')}
            <br />
            {t('landing.heroLine2')}
            <br />
            <span className="text-marigold">{t('landing.heroLine3')}</span>
          </h1>
          <p className="mt-7 text-lg text-ink/70 max-w-md">{t('landing.heroSub')}</p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/signup"
              className="bg-ink text-paper px-7 py-3.5 rounded-full text-sm font-medium hover:bg-ink/90 transition-colors"
            >
              {t('landing.ctaStart')}
            </Link>
            <a
              href="#how-it-works"
              className="text-sm text-ink/70 hover:text-ink transition-colors underline decoration-ink/30 underline-offset-4"
            >
              {t('landing.ctaSee')}
            </a>
          </div>
        </div>

        {/* Chat mockup illustration */}
        <div className="relative">
          <div className="bg-paper border border-ink/10 rounded-3xl p-6 shadow-[6px_6px_0_0_rgba(22,48,43,0.08)]">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-marigold/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-ink/20" />
            </div>

            <div className="flex justify-end mb-4">
              <p className="bg-ink text-paper text-sm rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%]">
                {t('landing.chatUser')}
              </p>
            </div>

            <div className="flex justify-start">
              <div className="bg-sand rounded-2xl rounded-tl-sm px-4 py-3 max-w-[90%] space-y-2">
                <p className="text-sm text-ink/80">{t('landing.chatReplyLine1')}</p>
                <p className="text-sm text-ink/60">{t('landing.chatReplyLine2')}</p>
              </div>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute -bottom-4 -left-4 w-full h-full border-2 border-marigold/40 rounded-3xl -z-10"
          />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20 border-t border-ink/10">
        <h2 className="font-display text-3xl md:text-4xl text-ink max-w-lg">{t('landing.howTitle')}</h2>
        <div className="mt-14 grid md:grid-cols-3 gap-10">
          {[
            { n: '1', title: t('landing.step1Title'), body: t('landing.step1Body') },
            { n: '2', title: t('landing.step2Title'), body: t('landing.step2Body') },
            { n: '3', title: t('landing.step3Title'), body: t('landing.step3Body') },
          ].map((step) => (
            <div key={step.n}>
              <span className="font-display text-5xl text-marigold">{step.n}</span>
              <h3 className="mt-4 text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-ink/65 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features - staggered */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20 border-t border-ink/10">
        <h2 className="font-display text-3xl md:text-4xl text-ink max-w-lg">{t('landing.featuresTitle')}</h2>

        <div className="mt-14 grid md:grid-cols-12 gap-6">
          <div className="md:col-span-7 bg-ink text-paper rounded-3xl p-8 md:p-10">
            <h3 className="font-display text-2xl">{t('landing.feature1Title')}</h3>
            <p className="mt-3 text-paper/75 leading-relaxed max-w-md">{t('landing.feature1Body')}</p>
          </div>
          <div className="md:col-span-5 bg-marigold/15 border border-marigold/30 rounded-3xl p-8 md:p-10">
            <h3 className="font-display text-2xl text-ink">{t('landing.feature2Title')}</h3>
            <p className="mt-3 text-ink/70 leading-relaxed">{t('landing.feature2Body')}</p>
          </div>

          <div className="md:col-span-5 bg-rose/10 border border-rose/25 rounded-3xl p-8 md:p-10">
            <h3 className="font-display text-2xl text-ink">{t('landing.feature3Title')}</h3>
            <p className="mt-3 text-ink/70 leading-relaxed">{t('landing.feature3Body')}</p>
          </div>
          <div className="md:col-span-7 bg-paper border border-ink/10 rounded-3xl p-8 md:p-10">
            <h3 className="font-display text-2xl text-ink">{t('landing.feature4Title')}</h3>
            <p className="mt-3 text-ink/70 leading-relaxed max-w-md">{t('landing.feature4Body')}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-24 border-t border-ink/10 text-center">
        <h2 className="font-display text-3xl md:text-4xl text-ink">{t('landing.ctaTitle')}</h2>
        <Link
          to="/signup"
          className="mt-8 inline-block bg-ink text-paper px-8 py-4 rounded-full text-sm font-medium hover:bg-ink/90 transition-colors"
        >
          {t('landing.ctaButton')}
        </Link>
      </section>
    </div>
  )
}
