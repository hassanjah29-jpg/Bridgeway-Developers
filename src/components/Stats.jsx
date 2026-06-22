import { useEffect, useRef, useState } from 'react'
import { stats } from '../data/siteData'

function useCountUp(target, active, duration = 1800) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setValue(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target, duration])
  return value
}

function StatItem({ stat, active }) {
  const value = useCountUp(stat.value, active)
  return (
    <div className="text-center">
      <div className="font-display text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
        {value.toLocaleString()}
        <span className="text-gold-400">{stat.suffix}</span>
      </div>
      <div className="mt-3 text-sm font-medium uppercase tracking-[0.15em] text-navy-200">
        {stat.label}
      </div>
    </div>
  )
}

export default function Stats() {
  const [active, setActive] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="relative overflow-hidden bg-navy-900 py-20">
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 to-navy-800" />
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute right-10 top-10 h-40 w-40 rounded-full border border-gold-400/40" />
        <div className="absolute bottom-6 left-1/4 h-24 w-24 rounded-full border border-gold-400/30" />
      </div>
      <div className="container-px relative grid grid-cols-2 gap-y-12 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatItem key={stat.label} stat={stat} active={active} />
        ))}
      </div>
    </section>
  )
}
