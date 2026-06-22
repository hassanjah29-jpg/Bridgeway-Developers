import SectionHeading from './SectionHeading'
import Icon from './Icon'
import { whyChooseUs } from '../data/siteData'

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="bg-white py-24 lg:py-32">
      <div className="container-px">
        <SectionHeading
          center
          eyebrow="Why Choose Us"
          title="The Bridgeway difference investors trust"
          description="We pair local Lahore expertise with disciplined execution and a genuinely investor-focused mindset — the reasons clients keep building with us."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseUs.map((item, i) => (
            <div
              key={item.title}
              className="reveal group relative flex gap-5 rounded-2xl border border-navy-100 bg-navy-50/50 p-7 transition-all duration-500 hover:border-gold-300/60 hover:bg-white hover:shadow-card"
              style={{ transitionDelay: `${(i % 3) * 80}ms` }}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-gold-400 transition-all duration-500 group-hover:bg-gold-gradient group-hover:text-navy-900">
                <Icon name={item.icon} className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-navy-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
