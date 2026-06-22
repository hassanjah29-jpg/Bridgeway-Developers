export default function Logo({ light = false, className = '' }) {
  const textColor = light ? 'text-white' : 'text-navy-900'
  const subColor = light ? 'text-gold-300' : 'text-gold-600'
  return (
    <a href="#home" className={`group flex items-center gap-3 ${className}`}>
      <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 shadow-md transition-transform duration-300 group-hover:scale-105">
        <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden="true">
          <path
            d="M16 44V20l16-8 16 8v24"
            fill="none"
            stroke="#d4a23f"
            strokeWidth="3.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d="M24 44V30h16v14"
            fill="none"
            stroke="#d4a23f"
            strokeWidth="3.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path d="M32 44V30" stroke="#d4a23f" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-display text-lg font-extrabold tracking-tight ${textColor}`}>
          Bridgeway
        </span>
        <span className={`text-[0.65rem] font-semibold uppercase tracking-[0.3em] ${subColor}`}>
          Developers
        </span>
      </span>
    </a>
  )
}
