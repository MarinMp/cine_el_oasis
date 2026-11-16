import { NavLink } from 'react-router-dom'
import Logo from './Logo.jsx'

const enlaces = [
  { ruta: '/', texto: 'Cartelera' },
  { ruta: '/reportes', texto: 'Reportes' },
]

export default function Encabezado() {
  return (
    <header className="bg-noche text-arena">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6" aria-label="Principal">
        <NavLink to="/" aria-label="Cine El Oasis, inicio">
          <Logo />
        </NavLink>
        <ul className="flex items-center gap-6 text-sm font-semibold uppercase tracking-[0.2em]">
          {enlaces.map((enlace) => (
            <li key={enlace.ruta}>
              <NavLink
                to={enlace.ruta}
                end
                className={({ isActive }) =>
                  `border-b-2 pb-1 transition-colors ${
                    isActive ? 'border-duna text-arena' : 'border-transparent text-arena/70 hover:text-arena'
                  }`
                }
              >
                {enlace.texto}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
