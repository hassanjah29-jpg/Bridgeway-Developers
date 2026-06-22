import Icon from './Icon'
import { company } from '../data/siteData'

const heroImage =
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80'

const highlights = [
  '15+ years of trusted delivery',
  'Premium Lahore locations',
  'Quality-certified construction',
]

export default function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden bg-navy-900">
      {/* Background image with gradient fallback */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 animate-slow-zoom bg-navy-gradient">
          <img
            src={heroImage}
            alt="Modern Lahore skyline development"
            className="h-full w-full object-cover opacity-40"
            loading="eager"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/60" />
      </div>

      {/* Decorative gold orb */}
      <div className="pointer-events-none absolute -right-32 top-1/4 h-96 w-96 animate-float rounded-full bg-gold-500/10 blur-3xl" />

      <div className="container-px relative z-10 pt-28 pb-20">
        <div className="max-w-3xl">
          <span
            className="inline-flex animate-fade-in items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300 opacity-0"
            style={{ animationDelay: '0.1s' }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            Lahore-Based Real Estate Developers
          </span>

          <h1
            className="mt-6 animate-fade-up font-display text-4xl font-extrabold leading-[1.1] text-white opacity-0 sm:text-5xl lg:text-6xl xl:text-7xl"
            style={{ animationDelay: '0.2s' }}
          >
            Building Lahore&apos;s Future,
            <span className="block bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">
              One Development at a Time
            </span>
          </h1>

          <p
            className="mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-navy-100 opacity-0"
            style={{ animationDelay: '0.35s' }}
          >
            {company.name} crafts premium apartments, residential communities and commercial
            landmarks — combining modern architecture with quality construction and reliable delivery
            you can invest in with confidence.
          </p>

          <div
            className="mt-9 flex animate-fade-up flex-col gap-3 opacity-0 sm:flex-row sm:items-center"
            style={{ animationDelay: '0.5s' }}
          >
            <a href="#projects" className="btn-gold">
              View Projects
              <Icon name="arrow" className="h-4 w-4" />
            </a>
            <a href="#contact" className="btn-outline">
              Contact Us
            </a>
          </div>

          <ul
            className="mt-12 flex animate-fade-up flex-wrap gap-x-8 gap-y-3 opacity-0"
            style={{ animationDelay: '0.65s' }}
          >
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm font-medium text-navy-100">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-500/20 text-gold-300">
                  <Icon name="check" className="h-3 w-3" strokeWidth={2.5} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#about"
        aria-label="Scroll to about"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/50 transition-colors hover:text-gold-300 md:flex"
      >
        <span className="text-[0.6rem] font-semibold uppercase tracking-[0.3em]">Scroll</span>
        <span className="flex h-9 w-5 justify-center rounded-full border border-white/30 pt-1.5">
          <span className="h-2 w-1 animate-bounce rounded-full bg-gold-400" />
        </span>
      </a>
    </section>
  )
}
