import { useState } from 'react'
import carteles from '../carteles.json'
import { nombreGenero } from '../formato.js'

// Rutas de los afiches de TMDB por id_pelicula (las genera scripts/carteles.mjs)
const URL_IMAGENES = 'https://image.tmdb.org/t/p/'

export const hayCarteles = Object.keys(carteles).length > 0

// Cada genero tiene su propio cielo y sus propias dunas
const ESTILOS = {
  'CIENCIA FICCION': { cielo: '#0E2A47', texto: '#FBF4E6', sol: '#F1DDB8', duna: '#C8873E', frente: '#A86A2C' },
  AVENTURA: { cielo: '#C8873E', texto: '#0E2A47', sol: '#FBF4E6', duna: '#A86A2C', frente: '#0E2A47' },
  ANIMACION: { cielo: '#4FB3D9', texto: '#0E2A47', sol: '#FBF4E6', duna: '#F1DDB8', frente: '#C8873E' },
  DRAMA: { cielo: '#F1DDB8', texto: '#0E2A47', sol: '#C8873E', duna: '#C8873E', frente: '#A86A2C' },
  COMEDIA: { cielo: '#E9B44C', texto: '#0E2A47', sol: '#FBF4E6', duna: '#C8873E', frente: '#A86A2C' },
}

// Tres perfiles de dunas para que los afiches no se vean iguales
const DUNAS = [
  ['M0 228 C 45 200, 95 214, 130 226 C 160 236, 185 222, 200 216 L200 300 L0 300 Z', 'M0 260 C 60 242, 130 272, 200 250 L200 300 L0 300 Z'],
  ['M0 214 C 40 226, 80 236, 120 222 C 150 211, 180 204, 200 210 L200 300 L0 300 Z', 'M0 252 C 70 270, 120 238, 200 262 L200 300 L0 300 Z'],
  ['M0 236 C 30 214, 70 206, 110 220 C 150 234, 175 226, 200 230 L200 300 L0 300 Z', 'M0 266 C 50 250, 110 250, 200 270 L200 300 L0 300 Z'],
]

export default function Afiche({ pelicula, className = '', tamano = 'w342' }) {
  const ruta = carteles[pelicula.id_pelicula]
  const [fallo, setFallo] = useState(false)

  // Si el afiche de TMDB no existe o no carga, se dibuja el afiche del género
  if (ruta && !fallo) {
    return (
      <div className={`relative aspect-[2/3] overflow-hidden rounded-box bg-base-300 ${className}`}>
        <img
          src={`${URL_IMAGENES}${tamano}${ruta}`}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          onError={() => setFallo(true)}
        />
      </div>
    )
  }

  const estilo = ESTILOS[pelicula.genero] ?? ESTILOS.DRAMA
  const [dunaAtras, dunaFrente] = DUNAS[pelicula.id_pelicula % DUNAS.length]
  const solX = 40 + ((pelicula.id_pelicula * 37) % 120)

  return (
    <div
      className={`relative aspect-[2/3] overflow-hidden rounded-box ${className}`}
      style={{ backgroundColor: estilo.cielo, color: estilo.texto }}
    >
      <svg viewBox="0 0 200 300" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <circle cx={solX} cy="224" r="22" fill={estilo.sol} fillOpacity="0.85" />
        <path d={dunaAtras} fill={estilo.duna} />
        <path d={dunaFrente} fill={estilo.frente} />
      </svg>
      <p className="absolute left-4 right-4 top-4 text-[0.65rem] font-semibold uppercase tracking-[0.3em]">
        {nombreGenero(pelicula.genero)}
      </p>
      <p className="absolute bottom-[34%] left-4 right-4 font-display text-[1.45rem] leading-[1.1]" aria-hidden="true">
        {pelicula.titulo}
      </p>
    </div>
  )
}
