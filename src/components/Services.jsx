import SectionHeading from './SectionHeading'
import Icon from './Icon'
import { services } from '../data/siteData'

export default function Services() {
  return (
    <section id="services" className="relative bg-navy-50 py-24 lg:py-32">
      <div className="container-px">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="What We Do"
            title="Comprehensive development & construction services"
            description="A full spectrum of capabilities under one trusted Lahore developer — from raw land to finished, move-in ready landmarks."
          />
          <a href="#contact" className="btn-navy reveal shrink-0">
            Discuss Your Project
            <Icon name="arrow" className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <article
              key={service.title}
              className="reveal card-hover group relative overflow-hidden rounded-2xl border border-navy-100 bg-white p-8 shadow-card"
              style={{ transitionDelay: `${(i % 3) * 80}ms` }}
            >
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gold-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 text-gold-400 transition-transform duration-500 group-hover:scale-110 group-hover:bg-gold-gradient group-hover:text-navy-900">
                <Icon name={service.icon} className="h-7 w-7" />
              </span>
              <h3 className="relative mt-6 font-display text-xl font-bold text-navy-900">
                {service.title}
              </h3>
              <p className="relative mt-3 text-sm leading-relaxed text-navy-500">
                {service.description}
              </p>
              <span className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600 opacity-0 transition-all duration-300 group-hover:opacity-100">
                Learn more
                <Icon name="arrow" className="h-4 w-4" />
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
