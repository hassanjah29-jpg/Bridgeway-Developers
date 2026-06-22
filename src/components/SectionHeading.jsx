export default function SectionHeading({ eyebrow, title, description, light = false, center = false }) {
  return (
    <div className={`reveal max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <span className="eyebrow">
          <span className="h-px w-8 bg-gold-500" />
          {eyebrow}
        </span>
      )}
      <h2 className={`mt-4 section-title ${light ? '!text-white' : ''}`}>{title}</h2>
      {description && (
        <p className={`mt-5 text-base leading-relaxed sm:text-lg ${light ? 'text-navy-100' : 'text-navy-500'}`}>
          {description}
        </p>
      )}
    </div>
  )
}
