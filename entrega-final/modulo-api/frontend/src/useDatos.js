import { useCallback, useEffect, useState } from 'react'

// Carga datos de la API y expone el estado de la peticion
export default function useDatos(cargar) {
  const [estado, setEstado] = useState({ datos: null, error: null, cargando: true })

  const recargar = useCallback(() => {
    setEstado((actual) => ({ ...actual, error: null, cargando: true }))
    cargar()
      .then((datos) => setEstado({ datos, error: null, cargando: false }))
      .catch((error) => setEstado({ datos: null, error, cargando: false }))
  }, [cargar])

  useEffect(() => {
    recargar()
  }, [recargar])

  return { ...estado, recargar }
}
