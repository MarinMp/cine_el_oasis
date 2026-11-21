import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api.js'
import Afiche from '../components/Afiche.jsx'
import { AvisoError, Fuente } from '../components/Avisos.jsx'
import Dunas from '../components/Dunas.jsx'
import useDatos from '../useDatos.js'
import {
  clasificacionCorta,
  clasificacionPais,
  duracion,
  fechaHora,
  fechaLarga,
  hora,
  nombreGenero,
  nombreIdioma,
  nombrePais,
  nombreVersion,
} from '../formato.js'
import NoEncontrada from './NoEncontrada.jsx'

function agruparPorFecha(funciones) {
  const grupos = new Map()
  for (const funcion of funciones) {
    if (!grupos.has(funcion.fecha)) grupos.set(funcion.fecha, [])
    grupos.get(funcion.fecha).push(funcion)
  }
  return [...grupos.entries()]
}

function Funcion({ funcion }) {
  const agotada = funcion.disponibles <= 0
  return (
    <li className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-box border border-base-300 bg-base-100 p-4">
      <div className="w-28">
        <p className="font-display text-2xl leading-none">{hora(funcion.hora_inicio)}</p>
        <p className="mt-1 text-xs text-base-content/80">termina {hora(funcion.hora_fin)}</p>
      </div>
      <div className="min-w-44 flex-1 text-sm">
        <p className="font-semibold">
          {funcion.sala} <span className="badge badge-sm badge-secondary ml-1">{funcion.tipo_sala}</span>
        </p>
        <p className="mt-1 text-base-content/80">
          {nombreVersion(funcion.version_proyeccion)} · {agotada ? 'Agotada' : `${funcion.disponibles} sillas libres`}
        </p>
      </div>
      {agotada ? (
        <button type="button" className="btn btn-sm" disabled>
          Agotada
        </button>
      ) : (
        <Link to={`/comprar/${funcion.id_funcion}`} className="btn btn-primary btn-sm">
          Comprar boletas
        </Link>
      )}
    </li>
  )
}

function Dato({ titulo, children }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-duna-profunda">{titulo}</dt>
      <dd className="mt-2">{children}</dd>
    </div>
  )
}

function FichaTecnica({ ficha }) {
  if (!ficha) {
    return <p className="text-sm">La ficha técnica no está disponible en este momento: MongoDB no respondió.</p>
  }
  const direccion = ficha.elenco.filter((persona) => persona.rol === 'DIRECTOR')
  const reparto = ficha.elenco.filter((persona) => persona.rol === 'ACTOR')

  return (
    <dl className="flex flex-col gap-6 text-sm">
      {direccion.length > 0 && <Dato titulo="Dirección">{direccion.map((p) => p.nombre).join(', ')}</Dato>}
      {reparto.length > 0 && (
        <Dato titulo="Reparto">
          <ul className="flex flex-col gap-1">
            {reparto.map((actor) => (
              <li key={`${actor.nombre}-${actor.personaje}`}>
                <span className="font-semibold">{actor.nombre}</span>
                {actor.personaje && <span className="text-base-content/80"> como {actor.personaje}</span>}
              </li>
            ))}
          </ul>
        </Dato>
      )}
      <Dato titulo="Versiones">
        <ul className="flex flex-col gap-1">
          {ficha.versiones.map((version, i) => (
            <li key={i}>
              {version.formato} · audio en {nombreIdioma(version.idioma_audio).toLowerCase()}
              {version.subtitulos.length > 0 &&
                ` · subtítulos en ${version.subtitulos.map((s) => nombreIdioma(s).toLowerCase()).join(', ')}`}
            </li>
          ))}
        </ul>
      </Dato>
      <Dato titulo="Clasificación por país">
        <ul className="grid grid-cols-2 gap-3">
          {Object.entries(ficha.clasificacion_por_pais).map(([pais, clasificacion]) => (
            <li key={pais}>
              <span className="block text-base-content/80">{nombrePais(pais)}</span>
              <span className="font-semibold">{clasificacionPais(clasificacion)}</span>
            </li>
          ))}
        </ul>
      </Dato>
      {ficha.saga && (
        <Dato titulo="Saga">
          {ficha.saga.nombre}, entrega {ficha.saga.entrega}
        </Dato>
      )}
      {ficha.premios?.oscar > 0 && (
        <Dato titulo="Premios">
          {ficha.premios.oscar} {ficha.premios.oscar === 1 ? 'premio Óscar' : 'premios Óscar'}
        </Dato>
      )}
    </dl>
  )
}

function Resenas({ idPelicula }) {
  const cargar = useCallback(() => api.resenas(idPelicula), [idPelicula])
  const { datos, error, cargando } = useDatos(cargar)

  return (
    <section className="mt-12" aria-labelledby="titulo-resenas">
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h2 id="titulo-resenas" className="font-display text-3xl">
          Reseñas
        </h2>
        <Fuente base="MongoDB" />
        <Fuente base="PostgreSQL" />
      </div>
      <p className="mb-6 text-sm text-base-content/80">
        Las reseñas vienen de MongoDB; el nombre del espectador y la compra que las respalda, de PostgreSQL.
      </p>
      {cargando && <div className="skeleton h-28 w-full bg-base-200" />}
      {error && <AvisoError error={error} titulo="No se pudieron cargar las reseñas." />}
      {datos && datos.total === 0 && <p className="rounded-box bg-base-200 p-6">Esta película todavía no tiene reseñas.</p>}
      {datos && datos.total > 0 && (
        <>
          <p className="mb-4 text-sm">
            <span className="font-display text-2xl">{datos.promedio}</span> de 5 · {datos.total}{' '}
            {datos.total === 1 ? 'reseña' : 'reseñas'}
          </p>
          <ul className="flex flex-col gap-4">
            {datos.resenas.map((resena) => (
              <li key={`${resena.id_espectador}-${resena.fecha}`} className="rounded-box border border-base-300 bg-base-100 p-5 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">
                    <span aria-hidden="true">{'★'.repeat(resena.calificacion)}{'☆'.repeat(5 - resena.calificacion)}</span>
                    <span className="sr-only">{resena.calificacion} de 5 estrellas</span>
                    <span className="ml-2">{resena.espectador ?? 'Espectador'}</span>
                  </p>
                  {resena.compra_verificada ? (
                    <span className="badge badge-sm badge-secondary">Compra verificada</span>
                  ) : (
                    <span className="badge badge-sm badge-outline">Sin compra asociada</span>
                  )}
                </div>
                <p className="mt-3 font-display text-lg">{resena.titulo}</p>
                <p className="mt-1">{resena.texto}</p>
                {resena.compra && (
                  <p className="mt-3 text-xs text-base-content/80">
                    Compra N.º {resena.compra.id_venta} · {resena.compra.boletas}{' '}
                    {resena.compra.boletas === 1 ? 'boleta' : 'boletas'} para el {fechaLarga(resena.compra.fecha_funcion)} en{' '}
                    {resena.compra.sala}
                  </p>
                )}
                {resena.respuesta_empresa && (
                  <p className="mt-3 rounded-box bg-base-200 p-3 text-xs">
                    <span className="font-semibold">Respuesta del cine:</span> {resena.respuesta_empresa.texto}
                  </p>
                )}
                <p className="mt-2 text-xs text-base-content/70">{fechaHora(resena.fecha)}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

export default function DetallePelicula() {
  const { id } = useParams()
  const [pelicula, setPelicula] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    setPelicula(null)
    setError(null)
    api.pelicula(id).then(setPelicula).catch(setError)
  }, [id])

  if (error?.detalle === 'Pelicula no encontrada' || error?.status === 422) return <NoEncontrada />

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <AvisoError error={error} titulo="No pudimos cargar la película." />
      </div>
    )
  }

  if (!pelicula) {
    return (
      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-16 sm:px-6" aria-label="Cargando película">
        <div className="skeleton aspect-[2/3] w-56 bg-base-200" />
        <div className="flex flex-1 flex-col gap-4">
          <div className="skeleton h-12 w-2/3 bg-base-200" />
          <div className="skeleton h-5 w-1/2 bg-base-200" />
        </div>
      </div>
    )
  }

  return (
    <>
      <section className="relative overflow-hidden bg-noche text-arena">
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-32 pt-8 sm:flex-row sm:items-end sm:px-6 sm:pb-36">
          <Afiche pelicula={pelicula} className="w-40 shrink-0 shadow-xl ring-1 ring-arena/20 sm:w-56" />
          <div className="sm:pb-4">
            <Link to="/" className="text-sm font-semibold uppercase tracking-[0.2em] text-arena/70 hover:text-arena">
              ← Cartelera
            </Link>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.4em] text-duna">
              {nombreGenero(pelicula.genero)}
            </p>
            <h1 className="mt-3 font-display text-4xl leading-none sm:text-6xl">{pelicula.titulo}</h1>
            <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-arena/80">
              <span>{duracion(pelicula.duracion_min)}</span>
              <span aria-hidden="true">·</span>
              <span>{nombreIdioma(pelicula.idioma)}</span>
              <span aria-hidden="true">·</span>
              <span>Estreno {pelicula.fecha_estreno.slice(0, 4)}</span>
              <span className="badge badge-outline border-arena/50 text-arena" title={pelicula.clasificacion}>
                {clasificacionCorta(pelicula.edad_minima)}
              </span>
            </p>
          </div>
        </div>
        <Dunas />
      </section>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-6 sm:px-6 lg:grid-cols-3">
        <section className="lg:col-span-2" aria-labelledby="titulo-funciones">
          <div className="mb-6 flex items-center gap-3">
            <h2 id="titulo-funciones" className="font-display text-3xl">
              Funciones
            </h2>
            <Fuente base="PostgreSQL" />
          </div>
          {pelicula.funciones.length === 0 ? (
            <p className="rounded-box bg-base-200 p-6">
              Esta película está en el catálogo, pero no tiene funciones programadas.
            </p>
          ) : (
            agruparPorFecha(pelicula.funciones).map(([fecha, funciones]) => (
              <div key={fecha} className="mb-8">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-duna-profunda">
                  {fechaLarga(fecha)}
                </h3>
                <ul className="flex flex-col gap-3">
                  {funciones.map((funcion) => (
                    <Funcion key={funcion.id_funcion} funcion={funcion} />
                  ))}
                </ul>
              </div>
            ))
          )}
          <Resenas idPelicula={pelicula.id_pelicula} />
        </section>

        <aside aria-labelledby="titulo-ficha">
          <div className="rounded-box bg-base-200 p-6">
            <div className="mb-6 flex items-center gap-3">
              <h2 id="titulo-ficha" className="font-display text-3xl">
                Ficha técnica
              </h2>
              <Fuente base="MongoDB" />
            </div>
            <FichaTecnica ficha={pelicula.ficha_tecnica} />
          </div>
        </aside>
      </div>
    </>
  )
}
