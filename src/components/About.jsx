import SectionHeading from './SectionHeading'
import Icon from './Icon'

const pillars = [
  { title: 'Quality First', description: 'Premium materials and certified engineering on every build.' },
  { title: 'Timely Delivery', description: 'Disciplined scheduling that respects your time and capital.' },
  { title: 'Smart Planning', description: 'Thoughtful master-planning for lasting, liveable communities.' },
  { title: 'Long-Term Value', description: 'Developments designed to appreciate for years to come.' },
]

const aboutImage =
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1100&q=80'

export default function About() {
  return (
    <section id="about" className="relative bg-white py-24 lg:py-32">
      <div className="container-px grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Image */}
        <div className="reveal relative">
          <div className="overflow-hidden rounded-3xl shadow-premium">
            <img
              src={aboutImage}
              alt="Bridgeway Developers construction site in Lahore"
              className="h-[460px] w-full object-cover transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />
          </div>
          {/* Floating experience badge */}
          <div className="absolute -bottom-8 -right-4 flex items-center gap-4 rounded-2xl bg-navy-900 px-7 py-6 shadow-premium sm:-right-8">
            <span className="font-display text-5xl font-extrabold text-gold-400">15+</span>
            <span className="text-sm font-medium leading-tight text-navy-100">
              Years building
              <br />
              across Lahore
            </span>
          </div>
          <div className="absolute -left-5 -top-5 -z-10 h-32 w-32 rounded-2xl border-2 border-gold-300/40" />
        </div>

        {/* Content */}
        <div>
          <SectionHeading
            eyebrow="About Bridgeway Developers"
            title="A Lahore developer built on trust, quality and vision"
            description="Bridgeway Developers is a Lahore-based real estate development and construction firm specialising in modern buildings, apartment projects and residential and commercial developments. We turn prime land into landmark communities — guided by precise planning, premium construction and an unwavering commitment to delivering on our promises."
          />

          <p className="reveal mt-5 text-base leading-relaxed text-navy-500">
            From first concept to final handover, our focus stays on quality, transparency and
            long-term value — so every home we build and every investment our clients make stands the
            test of time.
          </p>

          <div className="reveal mt-9 grid gap-5 sm:grid-cols-2">
            {pillars.map((p) => (
              <div key={p.title} className="flex gap-4">
                <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-50 text-gold-600">
                  <Icon name="check" className="h-5 w-5" strokeWidth={2.5} />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-navy-900">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-navy-500">{p.description}</p>
                </div>
              </div>
            ))}
          </div>

          <a href="#projects" className="btn-navy reveal mt-10">
            Explore Our Work
            <Icon name="arrow" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
