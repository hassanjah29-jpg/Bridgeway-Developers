import { useState } from 'react'
import SectionHeading from './SectionHeading'
import Icon from './Icon'
import { company } from '../data/siteData'

const initialForm = { name: '', phone: '', email: '', message: '' }

const contactDetails = [
  { icon: 'phone', label: 'Call Us', value: company.phone, href: company.phoneHref },
  { icon: 'mail', label: 'Email Us', value: company.email, href: company.emailHref },
  { icon: 'pin', label: 'Visit Us', value: company.address, href: '#map' },
]

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Please enter your name'
    if (!form.phone.trim()) next.phone = 'Please enter your phone number'
    if (!form.email.trim()) {
      next.email = 'Please enter your email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Please enter a valid email'
    }
    if (!form.message.trim()) next.message = 'Please tell us about your project'
    return next
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = validate()
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }
    // No backend — show success state. Wire to an API/email service when ready.
    setSubmitted(true)
    setForm(initialForm)
  }

  const fieldClass = (name) =>
    `w-full rounded-xl border bg-navy-50/60 px-4 py-3 text-sm text-navy-900 placeholder:text-navy-400 transition-colors focus:border-gold-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-400/30 ${
      errors[name] ? 'border-red-400' : 'border-navy-200'
    }`

  return (
    <section id="contact" className="bg-white py-24 lg:py-32">
      <div className="container-px">
        <div className="overflow-hidden rounded-3xl bg-navy-gradient shadow-premium">
          <div className="grid lg:grid-cols-5">
            {/* Info panel */}
            <div className="relative lg:col-span-2">
              <div className="pointer-events-none absolute -right-16 top-10 h-48 w-48 rounded-full bg-gold-500/10 blur-2xl" />
              <div className="relative flex h-full flex-col p-8 sm:p-10 lg:p-12">
                <span className="eyebrow !text-gold-300">
                  <span className="h-px w-8 bg-gold-400" />
                  Get In Touch
                </span>
                <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
                  Start Your Project With Us
                </h2>
                <p className="mt-4 text-navy-100">
                  Have a development, apartment or construction project in mind? Our Lahore team is
                  ready to help you plan, build and invest with confidence.
                </p>

                <ul className="mt-9 space-y-5">
                  {contactDetails.map((item) => (
                    <li key={item.label}>
                      <a href={item.href} className="group flex items-start gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold-300 transition-colors group-hover:bg-gold-gradient group-hover:text-navy-900">
                          <Icon name={item.icon} className="h-5 w-5" />
                        </span>
                        <span>
                          <span className="block text-xs font-semibold uppercase tracking-wider text-gold-300">
                            {item.label}
                          </span>
                          <span className="mt-0.5 block text-sm font-medium text-white transition-colors group-hover:text-gold-200">
                            {item.value}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex gap-3 pt-9">
                  {['facebook', 'instagram', 'linkedin'].map((s) => (
                    <a
                      key={s}
                      href="#"
                      aria-label={s}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-gold-gradient hover:text-navy-900"
                    >
                      <SocialIcon name={s} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Form panel */}
            <div className="bg-white p-8 sm:p-10 lg:col-span-3 lg:p-12">
              {submitted ? (
                <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-center">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                    <Icon name="check" className="h-10 w-10" strokeWidth={2.5} />
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-bold text-navy-900">
                    Thank you — message received!
                  </h3>
                  <p className="mt-3 max-w-sm text-navy-500">
                    Our team will get back to you within one business day to discuss your project.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="btn-navy mt-8"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <h3 className="font-display text-2xl font-bold text-navy-900">
                    Send us a message
                  </h3>
                  <p className="mt-2 text-sm text-navy-500">
                    Fill in the form and we&apos;ll be in touch shortly.
                  </p>

                  <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-navy-700">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className={fieldClass('name')}
                      />
                      {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-navy-700">
                        Phone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+92 3xx xxxxxxx"
                        className={fieldClass('phone')}
                      />
                      {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="mt-5">
                    <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-navy-700">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={fieldClass('email')}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>

                  <div className="mt-5">
                    <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-navy-700">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project..."
                      className={`${fieldClass('message')} resize-none`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                    )}
                  </div>

                  <button type="submit" className="btn-gold mt-7 w-full">
                    Start Your Project With Us
                    <Icon name="arrow" className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Map placeholder */}
        <div id="map" className="reveal mt-8 overflow-hidden rounded-3xl border border-navy-100 shadow-card">
          <iframe
            title="Bridgeway Developers location in Lahore"
            src="https://www.openstreetmap.org/export/embed.html?bbox=74.30%2C31.49%2C74.38%2C31.55&layer=mapnik&marker=31.52%2C74.34"
            className="h-80 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
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
