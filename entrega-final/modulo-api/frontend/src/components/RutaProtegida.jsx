import { Navigate, useLocation } from 'react-router-dom'
import { useSesion } from '../sesion.jsx'

export default function RutaProtegida({ children }) {
  const { sesion } = useSesion()
  const { pathname } = useLocation()
  if (!sesion) return <Navigate to={`/ingresar?volver=${encodeURIComponent(pathname)}`} replace />
  return children
}
