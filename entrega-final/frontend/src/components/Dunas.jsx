// Dunas que cierran las secciones oscuras y bajan hasta el fondo arena de la pagina
export default function Dunas({ className = 'h-24 sm:h-32' }) {
  return (
    <svg
      viewBox="0 0 1440 160"
      preserveAspectRatio="none"
      className={`absolute inset-x-0 bottom-0 w-full ${className}`}
      aria-hidden="true"
    >
      <path d="M0 70 C 240 20, 480 40, 720 80 C 960 120, 1200 60, 1440 50 L1440 160 L0 160 Z" fill="#A86A2C" />
      <path d="M0 105 C 300 70, 620 90, 900 110 C 1140 128, 1300 100, 1440 92 L1440 160 L0 160 Z" fill="#C8873E" />
      <path d="M0 140 C 360 112, 760 150, 1080 132 C 1250 122, 1360 128, 1440 134 L1440 160 L0 160 Z" fill="#FBF4E6" />
    </svg>
  )
}
