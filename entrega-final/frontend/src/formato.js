const GENEROS = {
  'CIENCIA FICCION': 'Ciencia ficción',
  ANIMACION: 'Animación',
  AVENTURA: 'Aventura',
  COMEDIA: 'Comedia',
  DRAMA: 'Drama',
}

const IDIOMAS = { INGLES: 'Inglés', ESPANOL: 'Español' }

export function nombreGenero(genero) {
  return GENEROS[genero] ?? genero
}

export function nombreIdioma(idioma) {
  return IDIOMAS[idioma] ?? idioma
}

export function duracion(minutos) {
  const horas = Math.floor(minutos / 60)
  const resto = minutos % 60
  if (horas === 0) return `${resto} min`
  return resto === 0 ? `${horas} h` : `${horas} h ${resto} min`
}

export function clasificacionCorta(edadMinima) {
  return edadMinima === 0 ? 'TP' : `+${edadMinima}`
}
