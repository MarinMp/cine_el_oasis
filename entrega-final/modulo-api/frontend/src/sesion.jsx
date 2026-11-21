import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { usarSesion } from './api.js'

const CLAVE = 'oasis-sesion'
const ContextoSesion = createContext(null)

// La sesion dura mientras la pestana del navegador este abierta (sessionStorage)
function leerGuardada() {
  try {
    const sesion = JSON.parse(sessionStorage.getItem(CLAVE))
    return sesion && sesion.expira * 1000 > Date.now() ? sesion : null
  } catch {
    return null
  }
}

export function ProveedorSesion({ children }) {
  const [sesion, setSesion] = useState(leerGuardada)

  const cerrar = useCallback(() => {
    try {
      sessionStorage.removeItem(CLAVE)
    } catch {
      // sin almacenamiento disponible: basta con olvidar la sesion en memoria
    }
    setSesion(null)
  }, [])

  const iniciar = useCallback((datos) => {
    try {
      sessionStorage.setItem(CLAVE, JSON.stringify(datos))
    } catch {
      // la sesion queda solo en memoria
    }
    setSesion(datos)
  }, [])

  // El token se registra antes de que las paginas hijas hagan sus peticiones
  usarSesion(sesion?.token ?? null, cerrar)
  useEffect(() => usarSesion(sesion?.token ?? null, cerrar), [sesion, cerrar])

  const valor = useMemo(() => ({ sesion, iniciar, cerrar }), [sesion, iniciar, cerrar])
  return <ContextoSesion.Provider value={valor}>{children}</ContextoSesion.Provider>
}

export const useSesion = () => useContext(ContextoSesion)
