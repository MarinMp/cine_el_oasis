import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { useModoTecnico } from '../modoTecnico.jsx'
import { hayCarteles } from './Afiche.jsx'
import { Emblema } from './Logo.jsx'

function Servicio({ nombre, estado }) {
  const textos = { ok: 'conectado', error: 'sin conexión', cargando: 'verificando' }
  const colores = { ok: 'bg-success', error: 'bg-error', cargando: 'bg-arena/40' }
  return (
    <li className="flex items-center gap-2">
      <span className={`inline-block h-2 w-2 rounded-full ${colores[estado]}`} aria-hidden="true" />
      <span>
        {nombre} <span className="text-arena/60">{textos[estado]}</span>
      </span>
    </li>
  )
}

export default function PiePagina() {
  const { tecnico, cambiar } = useModoTecnico()
  const [estado, setEstado] = useState({ postgresql: 'cargando', mongodb: 'cargando' })

  useEffect(() => {
    api
      .salud()
      .then((r) => setEstado({ postgresql: r.postgresql.estado, mongodb: r.mongodb.estado }))
      .catch(() => setEstado({ postgresql: 'error', mongodb: 'error' }))
  }, [])

  return (
    <footer className="bg-noche text-sm text-arena/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <Emblema className="h-8 w-8" />
          <p>
            Cine El Oasis · Proyecto integrador de Bases de Datos 2
            <br />
            <span className="text-arena/60">Universidad El Bosque · 2026-2</span>
            {hayCarteles && (
              <>
                <br />
                <span className="text-xs text-arena/60">
                  Afiches: The Movie Database (TMDB). Este producto usa la API de TMDB, pero no está avalado ni
                  certificado por TMDB.
                </span>
              </>
            )}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <ul className="flex flex-col gap-1" aria-label="Estado de las bases de datos">
            <Servicio nombre="PostgreSQL" estado={estado.postgresql} />
            <Servicio nombre="MongoDB" estado={estado.mongodb} />
          </ul>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-arena/70">
            <input
              type="checkbox"
              className="toggle toggle-xs border-arena/40 bg-transparent text-arena checked:border-agua checked:bg-agua checked:text-noche"
              checked={tecnico}
              onChange={cambiar}
            />
            Modo técnico
          </label>
        </div>
      </div>
    </footer>
  )
}
