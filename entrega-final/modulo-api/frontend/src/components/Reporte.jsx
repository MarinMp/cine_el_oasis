import { AvisoError, Fuente } from './Avisos.jsx'

// Tarjeta de un reporte: que muestra, con que tecnica y de que base sale
export function Reporte({ titulo, descripcion, tecnica, base, controles, estado, children }) {
  return (
    <section className="rounded-box border border-base-300 bg-base-100 p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="font-display text-2xl">{titulo}</h3>
        <Fuente base={base} />
      </div>
      <p className="mt-2 max-w-3xl text-sm">{descripcion}</p>
      {tecnica && <p className="mt-2 text-xs font-semibold text-duna-profunda">{tecnica}</p>}
      {controles && <div className="mt-5">{controles}</div>}
      <div className="mt-5">
        {estado?.cargando && <div className="skeleton h-32 w-full bg-base-200" aria-label="Cargando reporte" />}
        {estado?.error && <AvisoError error={estado.error} titulo="No se pudo generar el reporte." />}
        {(!estado || (!estado.cargando && !estado.error)) && children}
      </div>
    </section>
  )
}

// Tabla generica. columnas: [{ titulo, valor: (fila) => contenido, derecha }]
export function Tabla({ columnas, filas, clave, vacio = 'No hay datos para mostrar.' }) {
  if (!filas?.length) return <p className="text-sm text-base-content/80">{vacio}</p>
  return (
    <div className="overflow-x-auto">
      <table className="table table-sm">
        <thead>
          <tr>
            {columnas.map((columna) => (
              <th key={columna.titulo} className={columna.derecha ? 'text-right' : ''}>
                {columna.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, i) => (
            <tr key={clave ? clave(fila) : i}>
              {columnas.map((columna) => (
                <td key={columna.titulo} className={columna.derecha ? 'text-right tabular-nums' : ''}>
                  {columna.valor(fila)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Barra horizontal de una sola serie para comparar magnitudes dentro de una tabla
export function Barra({ valor, maximo, texto }) {
  const ancho = maximo > 0 ? Math.max(0, Math.min(100, (valor / maximo) * 100)) : 0
  return (
    <span className="flex items-center justify-end gap-3" title={texto}>
      <span className="tabular-nums">{texto}</span>
      <span className="hidden h-2 w-28 shrink-0 sm:block" aria-hidden="true">
        <span className="block h-2 rounded-r-[4px] bg-duna-oscura" style={{ width: `${ancho}%` }} />
      </span>
    </span>
  )
}
