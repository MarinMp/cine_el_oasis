export class ErrorApi extends Error {
  constructor(status, detalle) {
    let mensaje = `La API respondió con el código ${status}`
    if (typeof detalle === 'string') mensaje = detalle
    else if (Array.isArray(detalle)) mensaje = 'Revisa los datos del formulario.'
    else if (detalle?.mensaje) mensaje = detalle.mensaje
    super(mensaje)
    this.status = status
    this.detalle = detalle
  }
}

// Sesion del administrador: la pagina la guarda aqui para enviarla en cada peticion
let token = null
let alVencerSesion = () => {}

export function usarSesion(nuevoToken, alVencer) {
  token = nuevoToken
  alVencerSesion = alVencer ?? (() => {})
}

// Todas las peticiones pasan por el proxy de Vite hacia FastAPI
async function pedir(ruta, opciones = {}) {
  const encabezados = { ...(opciones.headers ?? {}) }
  if (token) encabezados.Authorization = `Bearer ${token}`

  let respuesta
  try {
    respuesta = await fetch(`/api${ruta}`, { ...opciones, headers: encabezados })
  } catch {
    throw new ErrorApi(0, 'No se pudo conectar con la API.')
  }
  const datos = await respuesta.json().catch(() => null)
  if (respuesta.status === 401 && token) alVencerSesion()
  if (!respuesta.ok && respuesta.status !== 503) {
    throw new ErrorApi(respuesta.status, datos?.detail ?? null)
  }
  if (respuesta.status === 503 && ruta !== '/salud') {
    throw new ErrorApi(503, datos?.detail ?? null)
  }
  return datos
}

const enviar = (ruta, datos) =>
  pedir(ruta, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })

export const api = {
  salud: () => pedir('/salud'),
  reloj: () => pedir('/reloj'),
  peliculas: () => pedir('/peliculas'),
  pelicula: (id) => pedir(`/peliculas/${id}`),
  resenas: (idPelicula) => pedir(`/integracion/resenas/${idPelicula}`),
  funcion: (id) => pedir(`/funciones/${id}`),
  tiposDocumento: () => pedir('/tipos-documento'),
  espectador: (documento) =>
    pedir(`/espectadores/${encodeURIComponent(documento)}`).catch((error) => {
      if (error.status === 404) return null
      throw error
    }),
  comprar: (compra) => enviar('/ventas', compra),
  iniciarSesion: (credenciales) => enviar('/auth/login', credenciales),
  reporte: (ruta) => pedir(`/reportes/${ruta}`),
  integracion: (ruta) => pedir(`/integracion/${ruta}`),
  administrar: (ruta, datos) => enviar(`/admin/${ruta}`, datos),
}
