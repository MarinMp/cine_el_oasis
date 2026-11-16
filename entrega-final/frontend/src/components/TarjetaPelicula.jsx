import { Link } from 'react-router-dom'
import { clasificacionCorta, duracion, nombreIdioma } from '../formato.js'
import Afiche from './Afiche.jsx'

export default function TarjetaPelicula({ pelicula }) {
  return (
    <article>
      <Link
        to={`/pelicula/${pelicula.id_pelicula}`}
        className="group flex flex-col gap-3 rounded-box focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-noche"
      >
        <Afiche
          pelicula={pelicula}
          className="transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none"
        />
        <h3 className="sr-only">{pelicula.titulo}</h3>
        <div className="flex items-start justify-between gap-2 text-sm">
          <p className="text-base-content/80">
            {duracion(pelicula.duracion_min)} · {nombreIdioma(pelicula.idioma)}
          </p>
          <span className="badge badge-sm badge-outline shrink-0 font-semibold" title={pelicula.clasificacion}>
            {clasificacionCorta(pelicula.edad_minima)}
          </span>
        </div>
        {!pelicula.en_cartelera && (
          <p className="-mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-duna-profunda">Solo en catálogo</p>
        )}
      </Link>
    </article>
  )
}
