// Emblema del logo "Amanecer en las dunas"
export function Emblema({ className = 'h-10 w-10' }) {
  return (
    <svg viewBox="0 0 300 300" className={className} aria-hidden="true">
      <defs>
        <clipPath id="emblema-interior">
          <circle cx="150" cy="150" r="128" />
        </clipPath>
      </defs>
      <circle cx="150" cy="150" r="142" fill="#C8873E" />
      <circle cx="150" cy="150" r="134" fill="#F1DDB8" />
      <circle cx="150" cy="150" r="128" fill="#0E2A47" />
      <g clipPath="url(#emblema-interior)">
        <polygon points="150,170 70,60 100,45" fill="#F1DDB8" fillOpacity="0.18" />
        <polygon points="150,170 135,28 165,28" fill="#F1DDB8" fillOpacity="0.18" />
        <polygon points="150,170 200,45 230,60" fill="#F1DDB8" fillOpacity="0.18" />
        <path
          d="M150 105 C150 105, 122 145, 122 165 C122 181, 135 193, 150 193 C165 193, 178 181, 178 165 C178 145, 150 105, 150 105 Z"
          fill="#4FB3D9"
        />
        <ellipse cx="141" cy="165" rx="4" ry="9" fill="#D6F0FA" />
        <path d="M10 215 C 70 185, 120 200, 160 215 C 200 230, 250 205, 290 200 L290 300 L10 300 Z" fill="#C8873E" />
        <path d="M10 248 C 80 226, 170 258, 290 236 L290 300 L10 300 Z" fill="#A86A2C" />
      </g>
    </svg>
  )
}

export default function Logo() {
  return (
    <span className="flex items-center gap-3">
      <Emblema className="h-9 w-9 sm:h-10 sm:w-10" />
      <span className="hidden flex-col leading-none min-[440px]:flex">
        <span className="whitespace-nowrap font-display text-xl sm:text-2xl">El Oasis</span>
        <span className="mt-1 hidden text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-duna sm:block">
          Cine · Bogotá
        </span>
      </span>
    </span>
  )
}
