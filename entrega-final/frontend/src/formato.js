const GENEROS = {
  'CIENCIA FICCION': 'Ciencia ficción',
  ANIMACION: 'Animación',
  AVENTURA: 'Aventura',
  COMEDIA: 'Comedia',
  DRAMA: 'Drama',
}

const IDIOMAS = { INGLES: 'Inglés', ESPANOL: 'Español' }

const VERSIONES = {
  ORIGINAL: 'Original',
  'ORIGINAL SUBTITULADA': 'Original subtitulada',
  'DOBLADA AL ESPANOL': 'Doblada al español',
}

const CATEGORIAS = { GENERAL: 'General', NINO: 'Niño', 'ADULTO MAYOR': 'Adulto mayor' }

const TIPOS_DOCUMENTO = {
  'CEDULA DE CIUDADANIA': 'Cédula de ciudadanía',
  'TARJETA DE IDENTIDAD': 'Tarjeta de identidad',
  'CEDULA DE EXTRANJERIA': 'Cédula de extranjería',
  PASAPORTE: 'Pasaporte',
}

const PAISES = { CO: 'Colombia', US: 'Estados Unidos', MX: 'México', ES: 'España' }

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

export const nombreGenero = (valor) => GENEROS[valor] ?? valor
export const nombreIdioma = (valor) => IDIOMAS[valor] ?? valor
export const nombreVersion = (valor) => VERSIONES[valor] ?? valor
export const nombreCategoria = (valor) => CATEGORIAS[valor] ?? valor
export const nombreTipoDocumento = (valor) => TIPOS_DOCUMENTO[valor] ?? valor
export const nombrePais = (codigo) => PAISES[codigo] ?? codigo

export function capitalizar(texto) {
  const minusculas = String(texto).toLowerCase()
  return minusculas.charAt(0).toUpperCase() + minusculas.slice(1)
}

// 'MAYORES DE 12' -> 'Mayores de 12', 'TODO PUBLICO' -> 'Todo público'; 'PG-13' se deja igual
export function clasificacionPais(valor) {
  if (valor === 'TODO PUBLICO') return 'Todo público'
  return valor.includes(' ') ? capitalizar(valor) : valor
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

// '2026-10-12' -> 'lunes 12 de octubre'
export function fechaLarga(fechaIso, conAnio = false) {
  const [anio, mes, dia] = fechaIso.slice(0, 10).split('-').map(Number)
  const fecha = new Date(anio, mes - 1, dia)
  const texto = `${DIAS[fecha.getDay()]} ${dia} de ${MESES[mes - 1]}`
  return conAnio ? `${texto} de ${anio}` : texto
}

// '15:00:00' -> '3:00 p. m.'
export function hora(horaIso) {
  const [h, m] = horaIso.split(':').map(Number)
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${h < 12 ? 'a. m.' : 'p. m.'}`
}

const formatoPesos = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
export const pesos = (valor) => formatoPesos.format(Number(valor))
