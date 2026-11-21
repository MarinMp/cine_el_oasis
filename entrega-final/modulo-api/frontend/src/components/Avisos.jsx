// Mensajes de estado reutilizables
export function AvisoError({ error, titulo = 'No pudimos completar la solicitud.' }) {
  const deTrigger = error?.detalle?.origen === 'trigger'
  return (
    <div role="alert" className={`alert items-start ${deTrigger ? 'alert-warning' : 'alert-error'}`}>
      <div>
        <p className="font-semibold">{deTrigger ? 'La base de datos rechazó la compra.' : titulo}</p>
        <p className="mt-1 text-sm">{error?.message}</p>
        {error?.detalle?.sugerencia && <p className="mt-1 text-sm">Sugerencia: {error.detalle.sugerencia}.</p>}
        {deTrigger && <p className="mt-2 text-xs opacity-80">Validación hecha por un trigger de PostgreSQL. No se guardó nada.</p>}
        {error?.status === 0 || error?.status === 502 ? (
          <p className="mt-1 text-sm">
            Revisa que FastAPI esté encendida (<code>uvicorn main:app --reload</code> en la carpeta backend).
          </p>
        ) : null}
        {error?.status === 404 && error?.detalle === 'Not Found' ? (
          <p className="mt-1 text-sm">
            La API que está corriendo no tiene esta ruta: probablemente es una versión anterior. Reiníciala con
            Ctrl + C y <code>uvicorn main:app --reload</code>.
          </p>
        ) : null}
      </div>
    </div>
  )
}

// Etiqueta que indica de que base de datos viene cada bloque
export function Fuente({ base }) {
  return (
    <span className="badge badge-sm border-base-300 bg-base-100 font-semibold normal-case tracking-normal">
      {base}
    </span>
  )
}
