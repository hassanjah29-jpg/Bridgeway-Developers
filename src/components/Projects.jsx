import { useState } from 'react'
import SectionHeading from './SectionHeading'
import Icon from './Icon'
import { projects, projectFilters } from '../data/siteData'

const statusStyles = {
  'Now Selling': 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
  'Under Construction': 'bg-gold-400/15 text-gold-300 border-gold-400/30',
  Planning: 'bg-sky-500/15 text-sky-300 border-sky-400/30',
}

export default function Projects() {
  const [filter, setFilter] = useState('All')

  const filtered =
    filter === 'All' ? projects : projects.filter((p) => p.type === filter)

  return (
    <section id="projects" className="relative overflow-hidden bg-navy-950 py-24 lg:py-32">
      {/* subtle grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container-px relative">
        <SectionHeading
          light
          center
          eyebrow="Featured Projects"
          title="Developments shaping the Lahore skyline"
          description="A selection of our residential, commercial and apartment projects — each delivered with the quality and care Bridgeway is known for."
        />

        {/* Filters */}
        <div className="reveal mt-10 flex flex-wrap justify-center gap-3">
          {projectFilters.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                filter === cat
                  ? 'border-gold-400 bg-gold-gradient text-navy-900 shadow-gold-glow'
                  : 'border-white/15 text-white/70 hover:border-gold-300/50 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <article
              key={project.title}
              className="reveal group relative overflow-hidden rounded-2xl bg-navy-900 shadow-premium"
              style={{ transitionDelay: `${(i % 3) * 80}ms` }}
            >
              <div className="relative h-60 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${project.accent}`} />
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent" />
                <span
                  className={`absolute right-4 top-4 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm ${
                    statusStyles[project.status] || 'bg-white/10 text-white border-white/20'
                  }`}
                >
                  {project.status}
                </span>
                <span className="absolute left-4 top-4 rounded-full bg-navy-950/70 px-3 py-1 text-xs font-semibold text-gold-300 backdrop-blur-sm">
                  {project.type}
                </span>
              </div>

              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-white">{project.title}</h3>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-navy-200">
                  <Icon name="pin" className="h-4 w-4 text-gold-400" />
                  {project.location}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-navy-300">{project.description}</p>
                <a
                  href="#contact"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-400 transition-all hover:gap-2.5"
                >
                  Enquire about this project
                  <Icon name="arrow" className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="reveal mt-14 text-center">
          <a href="#contact" className="btn-gold">
            Request the Full Project Portfolio
            <Icon name="arrow" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
