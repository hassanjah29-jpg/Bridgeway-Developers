import { useEffect, useState } from 'react'
import Logo from './Logo'
import Icon from './Icon'
import { navLinks, company } from '../data/siteData'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const solid = scrolled || open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? 'bg-navy-900/95 shadow-lg backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="container-px flex h-20 items-center justify-between">
        <Logo light />

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="relative rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:text-gold-300"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={company.phoneHref}
            className="flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-gold-300"
          >
            <Icon name="phone" className="h-4 w-4 text-gold-400" />
            {company.phone}
          </a>
          <a href="#contact" className="btn-gold px-5 py-2.5 text-xs">
            Get a Quote
          </a>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative z-50 flex h-11 w-11 items-center justify-center rounded-lg text-white lg:hidden"
        >
          <div className="flex w-6 flex-col gap-1.5">
            <span
              className={`h-0.5 w-full rounded bg-current transition-all duration-300 ${
                open ? 'translate-y-2 rotate-45' : ''
              }`}
            />
            <span
              className={`h-0.5 w-full rounded bg-current transition-all duration-300 ${
                open ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`h-0.5 w-full rounded bg-current transition-all duration-300 ${
                open ? '-translate-y-2 -rotate-45' : ''
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 top-20 z-40 origin-top bg-navy-900/98 backdrop-blur-md transition-all duration-300 lg:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <ul className="container-px flex flex-col gap-1 pt-6">
          {navLinks.map((link, i) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${i * 50}ms` : '0ms' }}
                className={`block border-b border-white/10 py-4 text-lg font-medium text-white transition-all duration-300 hover:text-gold-300 ${
                  open ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="container-px mt-8 flex flex-col gap-3">
          <a href={company.phoneHref} className="btn-outline w-full">
            <Icon name="phone" className="h-4 w-4" /> {company.phone}
          </a>
          <a href="#contact" onClick={() => setOpen(false)} className="btn-gold w-full">
            Get a Quote
          </a>
        </div>
      </div>
    </header>
  )
}
