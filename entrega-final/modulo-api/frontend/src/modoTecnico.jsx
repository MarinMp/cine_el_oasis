import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const CLAVE = 'oasis-modo-tecnico'
const ContextoModoTecnico = createContext({ tecnico: false, cambiar: () => {} })

// Muestra de qué base sale cada dato y qué hizo cada motor. Apagado por defecto.
function leerGuardado() {
  try {
    return localStorage.getItem(CLAVE) === 'si'
  } catch {
    return false
  }
}

export function ProveedorModoTecnico({ children }) {
  const [tecnico, setTecnico] = useState(leerGuardado)

  const cambiar = useCallback(() => {
    setTecnico((actual) => {
      try {
        localStorage.setItem(CLAVE, actual ? 'no' : 'si')
      } catch {
        // sin almacenamiento disponible: el cambio dura mientras la página esté abierta
      }
      return !actual
    })
  }, [])

  const valor = useMemo(() => ({ tecnico, cambiar }), [tecnico, cambiar])
  return <ContextoModoTecnico.Provider value={valor}>{children}</ContextoModoTecnico.Provider>
}

export const useModoTecnico = () => useContext(ContextoModoTecnico)

export function SoloTecnico({ children }) {
  const { tecnico } = useModoTecnico()
  return tecnico ? children : null
}
