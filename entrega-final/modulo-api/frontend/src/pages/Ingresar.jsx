import { useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../api.js'
import { AvisoError } from '../components/Avisos.jsx'
import { Emblema } from '../components/Logo.jsx'
import { useSesion } from '../sesion.jsx'

export default function Ingresar() {
  const { sesion, iniciar } = useSesion()
  const [parametros] = useSearchParams()
  const navegar = useNavigate()
  const destino = parametros.get('volver') || '/reportes'

  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)

  if (sesion) return <Navigate to={destino} replace />

  async function ingresar(e) {
    e.preventDefault()
    setEnviando(true)
    setError(null)
    try {
      const datos = await api.iniciarSesion({ usuario: usuario.trim(), clave })
      iniciar(datos)
      navegar(destino, { replace: true })
    } catch (err) {
      setError(err)
      setClave('')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="mx-auto flex max-w-6xl justify-center px-4 py-16 sm:px-6">
      <form onSubmit={ingresar} className="w-full max-w-sm rounded-box border border-base-300 bg-base-100 p-8">
        <Emblema className="h-14 w-14" />
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.4em] text-duna-profunda">Administración</p>
        <h1 className="mt-2 font-display text-4xl leading-none">Iniciar sesión</h1>
        <p className="mt-3 text-sm">Los reportes y los procedimientos son solo para el administrador del cine.</p>

        <div className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Usuario
            <input
              className="input w-full"
              autoComplete="username"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Contraseña
            <input
              type="password"
              className="input w-full"
              autoComplete="current-password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn btn-primary mt-2" disabled={enviando || !usuario || !clave}>
            {enviando ? 'Verificando…' : 'Ingresar'}
          </button>
        </div>

        {error && (
          <div className="mt-5">
            <AvisoError error={error} titulo="No se pudo iniciar sesión." />
          </div>
        )}
      </form>
    </section>
  )
}
