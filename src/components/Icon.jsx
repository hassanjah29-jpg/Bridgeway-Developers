// Lightweight inline SVG icon set (stroke-based, inherits currentColor).
const paths = {
  building: (
    <>
      <path d="M3 21h18" />
      <path d="M6 21V7l6-3 6 3v14" />
      <path d="M10 12h4M10 16h4M10 8h4" />
    </>
  ),
  apartment: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v16" />
      <path d="M14 9h4a1 1 0 0 1 1 1v11" />
      <path d="M8 8h2M8 12h2M8 16h2" />
    </>
  ),
  home: (
    <>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v11h14V10" />
      <path d="M10 21v-6h4v6" />
    </>
  ),
  commercial: (
    <>
      <path d="M3 21h18" />
      <path d="M4 21V8l8-4 8 4v13" />
      <path d="M9 21v-5h6v5" />
      <path d="M8 11h.01M12 11h.01M16 11h.01" />
    </>
  ),
  planning: (
    <>
      <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" />
      <path d="M14 3h7v7" />
      <path d="M21 3 11 13" />
      <path d="M7 17v-3h3" />
    </>
  ),
  management: (
    <>
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    </>
  ),
  map: (
    <>
      <path d="M9 4 3 6v15l6-2 6 2 6-2V4l-6 2-6-2Z" />
      <path d="M9 4v15M15 6v15" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  trend: (
    <>
      <path d="M3 17 9 11l4 4 8-8" />
      <path d="M17 7h4v4" />
    </>
  ),
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  check: <path d="m5 12 4 4 10-10" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  quote: (
    <path d="M7 7h4v6c0 2-1 3.5-3.5 4.5L7 16c1.3-.6 2-1.4 2-2.5H7V7Zm9 0h4v6c0 2-1 3.5-3.5 4.5L16 16c1.3-.6 2-1.4 2-2.5h-2V7Z" />
  ),
}

export default function Icon({ name, className = 'h-6 w-6', strokeWidth = 1.7 }) {
  const fillIcons = ['phone', 'quote']
  const isFill = fillIcons.includes(name)
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={isFill ? 'currentColor' : 'none'}
      stroke={isFill ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || null}
    </svg>
  )
}
