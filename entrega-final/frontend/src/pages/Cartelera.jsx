import { useEffect, useMemo, useState } from 'react'
import { api } from '../api.js'
import TarjetaPelicula from '../components/TarjetaPelicula.jsx'
import { nombreGenero } from '../formato.js'

function Portada({ enSala }) {
  return (
    <section className="relative overflow-hidden bg-noche text-arena">
      {/* Haces de luz del proyector, tomados del logo */}
      <svg
        viewBox="0 0 300 300"
        className="pointer-events-none absolute -top-10 right-[-6rem] hidden h-[34rem] w-[34rem] md:block"
        aria-hidden="true"
      >
        <polygon points="150,190 40,0 95,0" fill="#F1DDB8" fillOpacity="0.07" />
        <polygon points="150,190 128,0 172,0" fill="#F1DDB8" fillOpacity="0.07" />
        <polygon points="150,190 205,0 260,0" fill="#F1DDB8" fillOpacity="0.07" />
        <path
          d="M150 128 C150 128, 128 160, 128 176 C128 189, 138 198, 150 198 C162 198, 172 189, 172 176 C172 160, 150 128, 150 128 Z"
          fill="#4FB3D9"
        />
      </svg>

      <div className="relative mx-auto max-w-6xl px-4 pb-36 pt-14 sm:px-6 sm:pt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-duna">Esta semana</p>
        <h1 className="mt-4 font-display text-5xl leading-none sm:text-7xl">En cartelera</h1>
        <p className="mt-6 max-w-lg text-lg text-arena/80">
          {enSala === null
            ? 'Cargando las películas en sala…'
            : `${enSala} películas en nuestras salas 2D, 3D, VIP y 4D.`}
        </p>
      </div>

      {/* Dunas que bajan hasta el fondo de la página */}
      <svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-24 w-full sm:h-32"
        aria-hidden="true"
      >
        <path d="M0 70 C 240 20, 480 40, 720 80 C 960 120, 1200 60, 1440 50 L1440 160 L0 160 Z" fill="#A86A2C" />
        <path d="M0 105 C 300 70, 620 90, 900 110 C 1140 128, 1300 100, 1440 92 L1440 160 L0 160 Z" fill="#C8873E" />
        <path d="M0 140 C 360 112, 760 150, 1080 132 C 1250 122, 1360 128, 1440 134 L1440 160 L0 160 Z" fill="#FBF4E6" />
      </svg>
    </section>
  )
}

function Cargando() {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5" aria-label="Cargando películas">
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className="skeleton aspect-[2/3] bg-base-200" />
          <div className="skeleton h-4 w-2/3 bg-base-200" />
        </div>
      ))}
    </div>
  )
}

function ErrorApi({ mensaje }) {
  return (
    <div role="alert" className="alert alert-error items-start">
      <div>
        <p className="font-semibold">No pudimos conectar con la API.</p>
        <p className="mt-1 text-sm">
          Revisa que FastAPI esté encendida (<code>uvicorn main:app --reload</code> en la carpeta backend).
          Detalle: {mensaje}
        </p>
      </div>
    </div>
  )
}

export default function Cartelera() {
  const [peliculas, setPeliculas] = useState(null)
  const [error, setError] = useState(null)
  const [vista, setVista] = useState('cartelera')
  const [genero, setGenero] = useState('TODOS')

  useEffect(() => {
    api
      .peliculas()
      .then(setPeliculas)
      .catch((e) => setError(e.message))
  }, [])

  const enSala = useMemo(() => (peliculas ? peliculas.filter((p) => p.en_cartelera) : []), [peliculas])
  const base = vista === 'cartelera' ? enSala : peliculas ?? []
  const generos = useMemo(() => [...new Set(base.map((p) => p.genero))].sort(), [base])
  const visibles = genero === 'TODOS' ? base : base.filter((p) => p.genero === genero)

  function cambiarVista(nueva) {
    setVista(nueva)
    setGenero('TODOS')
  }

  return (
    <>
      <Portada enSala={peliculas ? enSala.length : null} />

      <section className="mx-auto max-w-6xl px-4 pb-20 pt-4 sm:px-6" aria-labelledby="titulo-peliculas">
        <h2 id="titulo-peliculas" className="sr-only">
          Películas
        </h2>

        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div role="tablist" aria-label="Qué películas ver" className="tabs tabs-box w-fit bg-base-200">
            <button
              role="tab"
              aria-selected={vista === 'cartelera'}
              className={`tab font-semibold ${vista === 'cartelera' ? 'tab-active' : 'text-base-content/80'}`}
              onClick={() => cambiarVista('cartelera')}
            >
              En cartelera{peliculas && ` (${enSala.length})`}
            </button>
            <button
              role="tab"
              aria-selected={vista === 'catalogo'}
              className={`tab font-semibold ${vista === 'catalogo' ? 'tab-active' : 'text-base-content/80'}`}
              onClick={() => cambiarVista('catalogo')}
            >
              Catálogo completo{peliculas && ` (${peliculas.length})`}
            </button>
          </div>

          {peliculas && (
            <div className="flex flex-wrap gap-2" aria-label="Filtrar por género">
              {['TODOS', ...generos].map((g) => (
                <button
                  key={g}
                  type="button"
                  aria-pressed={genero === g}
                  onClick={() => setGenero(g)}
                  className={`btn btn-sm ${genero === g ? 'btn-secondary' : 'btn-ghost border-base-300'}`}
                >
                  {g === 'TODOS' ? 'Todos' : nombreGenero(g)}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && <ErrorApi mensaje={error} />}
        {!error && !peliculas && <Cargando />}
        {peliculas && (
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
            {visibles.map((pelicula) => (
              <TarjetaPelicula key={pelicula.id_pelicula} pelicula={pelicula} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
