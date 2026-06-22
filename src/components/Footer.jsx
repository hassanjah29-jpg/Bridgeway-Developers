import Logo from './Logo'
import Icon from './Icon'
import { company, navLinks, services } from '../data/siteData'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-navy-950 text-navy-200">
      <div className="container-px py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo light />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-navy-300">
              A Lahore-based real estate development and construction company building premium
              apartments, residential communities and commercial landmarks — with quality and trust
              at the core.
            </p>
            <div className="mt-6 flex gap-3">
              {['facebook', 'instagram', 'linkedin'].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white transition-colors hover:bg-gold-gradient hover:text-navy-900"
                >
                  <SocialIcon name={s} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="transition-colors hover:text-gold-300">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Services
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {services.slice(0, 5).map((s) => (
                <li key={s.title}>
                  <a href="#services" className="transition-colors hover:text-gold-300">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Contact
            </h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Icon name="pin" className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
                <span>{company.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <a href={company.phoneHref} className="transition-colors hover:text-gold-300">
                  {company.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="mail" className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
                <a href={company.emailHref} className="transition-colors hover:text-gold-300">
                  {company.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-px flex flex-col items-center justify-between gap-3 py-6 text-xs text-navy-400 sm:flex-row">
          <p>
            © {year} {company.name}. All rights reserved.
          </p>
          <p className="flex gap-5">
            <a href="#" className="transition-colors hover:text-gold-300">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-gold-300">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ name }) {
  const icons = {
    facebook: 'M14 9h2.5V6H14c-2 0-3.5 1.5-3.5 3.5V11H8v3h2.5v6h3v-6H16l.5-3h-3V9.8c0-.5.3-.8.8-.8Z',
    instagram:
      'M12 8.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Zm0 5.5A2 2 0 1 1 12 10a2 2 0 0 1 0 4Zm4-7.8a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8ZM7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Zm0 1.5A1.5 1.5 0 0 0 5.5 7v10A1.5 1.5 0 0 0 7 18.5h10a1.5 1.5 0 0 0 1.5-1.5V7A1.5 1.5 0 0 0 17 5.5Z',
    linkedin:
      'M7 9v9H4V9h3Zm-1.5-1.3A1.7 1.7 0 1 1 5.5 4.3a1.7 1.7 0 0 1 0 3.4ZM20 18h-3v-4.7c0-1.2-.4-2-1.5-2-.8 0-1.3.5-1.5 1.1-.1.2-.1.5-.1.8V18h-3V9h3v1.3c.4-.6 1.1-1.5 2.8-1.5 2 0 3.3 1.3 3.3 4.1V18Z',
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d={icons[name]} />
    </svg>
  )
}
