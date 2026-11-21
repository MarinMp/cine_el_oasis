import { NavLink } from 'react-router-dom'
import { useSesion } from '../sesion.jsx'
import Logo from './Logo.jsx'

const enlaces = [
  { ruta: '/', texto: 'Cartelera' },
  { ruta: '/reportes', texto: 'Reportes' },
]

export default function Encabezado() {
  const { sesion, cerrar } = useSesion()
  return (
    <header className="bg-noche text-arena">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6" aria-label="Principal">
        <NavLink to="/" aria-label="Cine El Oasis, inicio" className="shrink-0">
          <Logo />
        </NavLink>
        <ul className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.12em] sm:gap-6 sm:text-sm sm:tracking-[0.2em]">
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
          {sesion && (
            <li>
              <button type="button" onClick={cerrar} className="btn btn-ghost btn-xs uppercase tracking-[0.12em] text-arena/80 hover:bg-arena/10 hover:text-arena sm:btn-sm sm:tracking-[0.2em]">
                Salir
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}
