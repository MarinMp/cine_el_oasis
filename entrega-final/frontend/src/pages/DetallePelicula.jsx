import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api.js'
import Afiche from '../components/Afiche.jsx'
import { AvisoError, Fuente } from '../components/Avisos.jsx'
import Dunas from '../components/Dunas.jsx'
import {
  clasificacionCorta,
  clasificacionPais,
  duracion,
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
