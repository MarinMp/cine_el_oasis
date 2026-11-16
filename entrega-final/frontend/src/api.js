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

// Todas las peticiones pasan por el proxy de Vite hacia FastAPI
async function pedir(ruta, opciones) {
  let respuesta
  try {
    respuesta = await fetch(`/api${ruta}`, opciones)
  } catch {
    throw new ErrorApi(0, 'No se pudo conectar con la API.')
  }
  const datos = await respuesta.json().catch(() => null)
  if (!respuesta.ok && respuesta.status !== 503) {
    throw new ErrorApi(respuesta.status, datos?.detail ?? null)
  }
  return datos
}

export const api = {
  salud: () => pedir('/salud'),
  reloj: () => pedir('/reloj'),
  peliculas: () => pedir('/peliculas'),
  pelicula: (id) => pedir(`/peliculas/${id}`),
  funcion: (id) => pedir(`/funciones/${id}`),
  tiposDocumento: () => pedir('/tipos-documento'),
  espectador: (documento) =>
    pedir(`/espectadores/${encodeURIComponent(documento)}`).catch((error) => {
      if (error.status === 404) return null
      throw error
    }),
  reporte: (ruta) => pedir(`/reportes/${ruta}`),
  administrar: (ruta, datos) =>
    pedir(`/admin/${ruta}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    }),
  comprar: (compra) =>
    pedir('/ventas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(compra),
    }),
}
