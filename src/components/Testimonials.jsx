import SectionHeading from './SectionHeading'
import Icon from './Icon'
import { testimonials } from '../data/siteData'

export default function Testimonials() {
  return (
    <section className="bg-navy-50 py-24 lg:py-32">
      <div className="container-px">
        <SectionHeading
          center
          eyebrow="Testimonials"
          title="Trusted by homeowners and investors alike"
          description="Our reputation is built on relationships — here is what clients and partners say about working with Bridgeway Developers."
        />

        <div className="mt-14 grid gap-7 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure
              key={t.name}
              className="reveal card-hover relative flex flex-col rounded-2xl border border-navy-100 bg-white p-8 shadow-card"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <span className="text-gold-400">
                <Icon name="quote" className="h-10 w-10" />
              </span>
              <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-navy-600">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-4 border-t border-navy-100 pt-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-900 font-display text-lg font-bold text-gold-400">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <div className="font-display font-bold text-navy-900">{t.name}</div>
                  <div className="text-sm text-navy-500">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
