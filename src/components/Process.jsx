import SectionHeading from './SectionHeading'
import { processSteps } from '../data/siteData'

export default function Process() {
  return (
    <section id="process" className="relative overflow-hidden bg-navy-gradient py-24 lg:py-32">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="container-px relative">
        <SectionHeading
          light
          center
          eyebrow="Our Process"
          title="From site to handover — a proven five-step path"
          description="A structured, transparent development process that keeps every project predictable, accountable and on standard."
        />

        <div className="relative mt-16">
          {/* connecting line */}
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent lg:block" />

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            {processSteps.map((step, i) => (
              <div
                key={step.step}
                className="reveal relative text-center lg:text-left"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold-400/50 bg-navy-900 font-display text-lg font-extrabold text-gold-400 lg:mx-0">
                  {step.step}
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-200">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
