// Todas las peticiones pasan por el proxy de Vite hacia FastAPI
async function pedir(ruta) {
  const respuesta = await fetch(`/api${ruta}`)
  if (!respuesta.ok && respuesta.status !== 503) {
    throw new Error(`La API respondió con el código ${respuesta.status}`)
  }
  return respuesta.json()
}

export const api = {
  salud: () => pedir('/salud'),
  peliculas: () => pedir('/peliculas'),
  pelicula: (id) => pedir(`/peliculas/${id}`),
}
