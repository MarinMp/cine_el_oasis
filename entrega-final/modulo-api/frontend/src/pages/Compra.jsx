import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api.js'
import { AvisoError, Fuente } from '../components/Avisos.jsx'
import {
  capitalizar,
  fechaLarga,
  hora,
  nombreCategoria,
  nombreTipoDocumento,
  nombreVersion,
  pesos,
} from '../formato.js'
import NoEncontrada from './NoEncontrada.jsx'

const MAXIMO_BOLETAS = 10

const MEDIOS_PAGO = [
  { valor: 'TARJETA DEBITO', texto: 'Tarjeta débito' },
  { valor: 'TARJETA CREDITO', texto: 'Tarjeta crédito' },
  { valor: 'TRANSFERENCIA', texto: 'Transferencia' },
]

const DATOS_VACIOS = { id_tipo_documento: '', primer_nombre: '', primer_apellido: '', correo: '', telefono: '' }

// Requisitos de la sala que le sirven al espectador (los internos del cine no se muestran)
function textosRequisitos(requisitos = {}) {
  const textos = []
  if (requisitos.proyector) textos.push(`Proyector ${requisitos.proyector}`)
  if (requisitos.sonido) textos.push(`Sonido ${requisitos.sonido}`)
  if (requisitos.gafas_3d) textos.push(`Gafas 3D ${String(requisitos.gafas_3d.tipo ?? '').toLowerCase()}`.trim())
  if (requisitos.efectos?.length) textos.push(`Efectos: ${requisitos.efectos.join(', ')}`)
  if (requisitos.butacas_reclinables) textos.push('Butacas reclinables')
  if (requisitos.servicio_a_la_silla) textos.push('Servicio a la silla')
  if (requisitos.menu) textos.push(`Menú: ${requisitos.menu}`)
  if (requisitos.estatura_minima_cm) textos.push(`Estatura mínima ${requisitos.estatura_minima_cm} cm`)
  if (requisitos.advertencia_salud) textos.push('Con advertencia de salud')
  return textos
}

const aFechaHoraLocal = (iso) => iso.slice(0, 16)
const esMiercoles = (fechaIso) => {
  const [a, m, d] = fechaIso.slice(0, 10).split('-').map(Number)
  return new Date(a, m - 1, d).getDay() === 3
}

function Paso({ numero, titulo, children }) {
  return (
    <fieldset className="rounded-box border border-base-300 bg-base-100 p-5 sm:p-6">
      <legend className="px-2 font-display text-2xl">
        <span className="mr-2 text-duna-profunda">{numero}.</span>
        {titulo}
      </legend>
      {children}
    </fieldset>
  )
}

function Campo({ etiqueta, children, ayuda }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-semibold">
      {etiqueta}
      {children}
      {ayuda && <span className="font-normal text-base-content/80">{ayuda}</span>}
    </label>
  )
}

function Comprobante({ venta }) {
  const actualizaciones = venta.auditoria.UPDATE ?? 0
  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-duna-profunda">Compra confirmada</p>
      <h1 className="mt-3 font-display text-5xl leading-none">¡Listo, {venta.espectador.split(' ')[0]}!</h1>
      <p className="mt-4 text-lg">
        Tus boletas para <strong>{venta.titulo}</strong> quedaron registradas.
      </p>

      <div className="mt-10 rounded-box bg-base-200 p-6 sm:p-8">
        <div className="flex flex-wrap justify-between gap-4 border-b border-base-300 pb-5">
          <div>
            <p className="text-sm text-base-content/80">Compra</p>
            <p className="font-display text-3xl">N.º {venta.id_venta}</p>
          </div>
          <div className="text-sm sm:text-right">
            <p className="font-semibold">{capitalizar(fechaLarga(venta.fecha))}</p>
            <p>
              {hora(venta.hora_inicio)} · {venta.sala} ({venta.tipo_sala})
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table mt-2">
            <thead>
              <tr>
                <th>Boleta</th>
                <th className="text-right">Cantidad</th>
                <th className="text-right">Precio</th>
                <th className="text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {venta.detalle.map((linea) => (
                <tr key={linea.categoria}>
                  <td>{nombreCategoria(linea.categoria)}</td>
                  <td className="text-right">{linea.cantidad}</td>
                  <td className="text-right">
                    {pesos(linea.precio_unitario)}
                    {linea.precio_unitario < linea.precio_base && (
                      <span className="block text-xs text-base-content/70 line-through">{pesos(linea.precio_base)}</span>
                    )}
                  </td>
                  <td className="text-right">{pesos(linea.subtotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="text-base text-base-content">
                  Total
                </td>
                <td className="text-right font-display text-2xl text-base-content">{pesos(venta.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        {venta.descuento_miercoles && (
          <p className="badge badge-accent mt-4">Descuento del 50 % por comprar el mismo miércoles de la función</p>
        )}
      </div>

      <div className="mt-8 rounded-box border border-base-300 p-6 text-sm">
        <div className="mb-3 flex items-center gap-3">
          <h2 className="font-semibold uppercase tracking-[0.2em]">Lo que hicieron las bases de datos</h2>
          <Fuente base="PostgreSQL" />
          <Fuente base="MongoDB" />
        </div>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Comprobó que la función no hubiera empezado (<code>trg_venta_validar</code>).
          </li>
          <li>
            Validó el tipo de sala, el aforo y el máximo de 10 boletas, y calculó el precio de cada boleta
            {venta.descuento_miercoles ? ' con el descuento del miércoles' : ''} (<code>trg_detalle_venta_boleta</code>).
          </li>
          <li>
            Calculó el total de {pesos(venta.total)} (<code>trg_detalle_venta_total</code>).
          </li>
          <li>
            Registró {venta.auditoria.INSERT ?? 0} inserción y {actualizaciones}{' '}
            {actualizaciones === 1 ? 'actualización' : 'actualizaciones'} en <code>LOG_AUDITORIA</code> (
            <code>trg_auditoria_venta</code>).
          </li>
          {venta.mongodb && (
            <li>
              Guardó el comprobante de la misma compra en MongoDB (colección <code>comprobantes_venta</code>, documento{' '}
              <code>{venta.mongodb.id}</code>). Si MongoDB hubiera fallado, la venta se habría deshecho en PostgreSQL.
            </li>
          )}
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/" className="btn btn-secondary">
          Volver a la cartelera
        </Link>
        <Link to={`/pelicula/${venta.id_pelicula}`} className="btn btn-ghost border-base-300">
          Ver otras funciones de esta película
        </Link>
      </div>
    </section>
  )
}

export default function Compra() {
  const { idFuncion } = useParams()
  const [funcion, setFuncion] = useState(null)
  const [tiposDocumento, setTiposDocumento] = useState([])
  const [errorCarga, setErrorCarga] = useState(null)

  const [cantidades, setCantidades] = useState({})
  const [documento, setDocumento] = useState('')
  const [comprador, setComprador] = useState({ estado: 'sin-buscar', espectador: null })
  const [datosNuevo, setDatosNuevo] = useState(DATOS_VACIOS)
  const [medioPago, setMedioPago] = useState('')
  const [fechaHora, setFechaHora] = useState('')

  const [enviando, setEnviando] = useState(false)
  const [errorCompra, setErrorCompra] = useState(null)
  const [comprobante, setComprobante] = useState(null)

  useEffect(() => {
    Promise.all([api.funcion(idFuncion), api.tiposDocumento(), api.reloj()])
      .then(([datosFuncion, tipos, reloj]) => {
        setFuncion(datosFuncion)
        setTiposDocumento(tipos)
        setFechaHora(aFechaHoraLocal(reloj.fecha_hora))
      })
      .catch(setErrorCarga)
  }, [idFuncion])

  const totalBoletas = useMemo(() => Object.values(cantidades).reduce((a, b) => a + b, 0), [cantidades])

  if (errorCarga?.detalle === 'Funcion no encontrada' || errorCarga?.status === 422) return <NoEncontrada />
  if (errorCarga) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <AvisoError error={errorCarga} titulo="No pudimos cargar la función." />
      </div>
    )
  }
  if (!funcion) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-label="Cargando función">
        <div className="skeleton h-12 w-1/2 bg-base-200" />
        <div className="skeleton mt-6 h-64 w-full bg-base-200" />
      </div>
    )
  }
  if (comprobante) return <Comprobante venta={comprobante} />

  const inicioFuncion = `${funcion.fecha}T${funcion.hora_inicio.slice(0, 5)}`
  const yaEmpezo = fechaHora && fechaHora >= inicioFuncion
  const conDescuento = fechaHora && esMiercoles(fechaHora) && fechaHora.slice(0, 10) === funcion.fecha
  const limite = Math.min(MAXIMO_BOLETAS, funcion.disponibles)
  const totalEstimado = funcion.tipos_boleta.reduce(
    (suma, tipo) => suma + (cantidades[tipo.id_tipo_boleta] ?? 0) * tipo.precio_base * (conDescuento ? 0.5 : 1),
    0,
  )
  const requisitos = textosRequisitos(funcion.proyeccion?.requisitos)

  const datosNuevoCompletos =
    datosNuevo.id_tipo_documento && datosNuevo.primer_nombre.trim() && datosNuevo.primer_apellido.trim() && datosNuevo.correo.trim()
  const compradorListo = comprador.estado === 'registrado' || (comprador.estado === 'nuevo' && datosNuevoCompletos)
  const puedeComprar = totalBoletas > 0 && compradorListo && medioPago && !enviando

  function cambiarCantidad(idTipo, valor) {
    setCantidades((actuales) => ({ ...actuales, [idTipo]: Math.max(0, valor) }))
  }

  async function buscarComprador() {
    const valor = documento.trim()
    if (valor.length < 3) return
    setComprador({ estado: 'buscando', espectador: null })
    try {
      const espectador = await api.espectador(valor)
      setComprador(espectador ? { estado: 'registrado', espectador } : { estado: 'nuevo', espectador: null })
    } catch (error) {
      setComprador({ estado: 'sin-buscar', espectador: null })
      setErrorCompra(error)
    }
  }

  async function comprar(evento) {
    evento.preventDefault()
    if (!puedeComprar) return
    setEnviando(true)
    setErrorCompra(null)
    const datosComprador =
      comprador.estado === 'registrado'
        ? { documento: documento.trim() }
        : { documento: documento.trim(), ...datosNuevo, id_tipo_documento: Number(datosNuevo.id_tipo_documento) }
    try {
      const venta = await api.comprar({
        id_funcion: funcion.id_funcion,
        medio_pago: medioPago,
        comprador: datosComprador,
        boletas: Object.entries(cantidades)
          .filter(([, cantidad]) => cantidad > 0)
          .map(([id, cantidad]) => ({ id_tipo_boleta: Number(id), cantidad })),
        fecha_hora: `${fechaHora}:00`,
      })
      setComprobante(venta)
    } catch (error) {
      setErrorCompra(error)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <section className="bg-noche text-arena">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6">
          <Link
            to={`/pelicula/${funcion.id_pelicula}`}
            className="text-sm font-semibold uppercase tracking-[0.2em] text-arena/70 hover:text-arena"
          >
            ← {funcion.titulo}
          </Link>
          <h1 className="mt-5 font-display text-4xl leading-none sm:text-5xl">Comprar boletas</h1>
          <p className="mt-4 text-arena/80">
            {capitalizar(fechaLarga(funcion.fecha))} · {hora(funcion.hora_inicio)} · {funcion.sala} (
            {funcion.tipo_sala}) · {nombreVersion(funcion.version_proyeccion)}
          </p>
          {requisitos.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Características de la sala">
              {requisitos.map((texto) => (
                <li key={texto} className="badge border-arena/30 bg-arena/10 text-arena">
                  {texto}
                </li>
              ))}
              <li>
                <span className="badge border-arena/30 bg-transparent text-arena/80">Desde MongoDB</span>
              </li>
            </ul>
          )}
        </div>
      </section>

      <form onSubmit={comprar} className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Paso numero={1} titulo="Boletas">
            <p className="text-sm text-base-content/80">
              Máximo {MAXIMO_BOLETAS} por compra · {funcion.disponibles} sillas libres en esta función.
            </p>
            <ul className="divide-y divide-base-300">
              {funcion.tipos_boleta.map((tipo) => {
                const cantidad = cantidades[tipo.id_tipo_boleta] ?? 0
                const nombre = nombreCategoria(tipo.categoria)
                return (
                  <li key={tipo.id_tipo_boleta} className="flex items-center justify-between gap-4 py-4">
                    <div>
                      <p className="font-semibold">{nombre}</p>
                      <p className="text-sm text-base-content/80">{pesos(tipo.precio_base)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="btn btn-circle btn-sm btn-outline"
                        aria-label={`Quitar una boleta ${nombre}`}
                        disabled={cantidad === 0}
                        onClick={() => cambiarCantidad(tipo.id_tipo_boleta, cantidad - 1)}
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-lg font-semibold" aria-live="polite">
                        {cantidad}
                      </span>
                      <button
                        type="button"
                        className="btn btn-circle btn-sm btn-outline"
                        aria-label={`Agregar una boleta ${nombre}`}
                        disabled={totalBoletas >= limite}
                        onClick={() => cambiarCantidad(tipo.id_tipo_boleta, cantidad + 1)}
                      >
                        +
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          </Paso>

          <Paso numero={2} titulo="Tus datos">
            <div className="flex flex-wrap items-end gap-3">
              <Campo etiqueta="Número de documento">
                <input
                  className="input w-64 max-w-full"
                  inputMode="numeric"
                  autoComplete="off"
                  value={documento}
                  onChange={(e) => {
                    setDocumento(e.target.value)
                    setComprador({ estado: 'sin-buscar', espectador: null })
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      buscarComprador()
                    }
                  }}
                />
              </Campo>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={buscarComprador}
                disabled={documento.trim().length < 3 || comprador.estado === 'buscando'}
              >
                {comprador.estado === 'buscando' ? 'Buscando…' : 'Continuar'}
              </button>
            </div>

            {comprador.estado === 'registrado' && (
              <p className="mt-4 rounded-box bg-base-200 p-4 text-sm">
                Hola, <strong>{comprador.espectador.primer_nombre} {comprador.espectador.primer_apellido}</strong>. Ya
                estás registrado en El Oasis.
              </p>
            )}

            {comprador.estado === 'nuevo' && (
              <div className="mt-5">
                <p className="mb-4 text-sm">Este documento no está registrado. Completa tus datos para crear tu cuenta:</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Campo etiqueta="Tipo de documento">
                    <select
                      className="select w-full"
                      value={datosNuevo.id_tipo_documento}
                      onChange={(e) => setDatosNuevo({ ...datosNuevo, id_tipo_documento: e.target.value })}
                    >
                      <option value="">Elige uno</option>
                      {tiposDocumento.map((tipo) => (
                        <option key={tipo.id_tipo_documento} value={tipo.id_tipo_documento}>
                          {nombreTipoDocumento(tipo.nombre)}
                        </option>
                      ))}
                    </select>
                  </Campo>
                  <Campo etiqueta="Correo">
                    <input
                      type="email"
                      className="input w-full"
                      autoComplete="email"
                      value={datosNuevo.correo}
                      onChange={(e) => setDatosNuevo({ ...datosNuevo, correo: e.target.value })}
                    />
                  </Campo>
                  <Campo etiqueta="Nombre">
                    <input
                      className="input w-full"
                      autoComplete="given-name"
                      value={datosNuevo.primer_nombre}
                      onChange={(e) => setDatosNuevo({ ...datosNuevo, primer_nombre: e.target.value })}
                    />
                  </Campo>
                  <Campo etiqueta="Apellido">
                    <input
                      className="input w-full"
                      autoComplete="family-name"
                      value={datosNuevo.primer_apellido}
                      onChange={(e) => setDatosNuevo({ ...datosNuevo, primer_apellido: e.target.value })}
                    />
                  </Campo>
                  <Campo etiqueta="Celular (opcional)" ayuda="10 números, sin espacios.">
                    <input
                      className="input w-full"
                      inputMode="numeric"
                      autoComplete="tel"
                      value={datosNuevo.telefono}
                      onChange={(e) => setDatosNuevo({ ...datosNuevo, telefono: e.target.value })}
                    />
                  </Campo>
                </div>
              </div>
            )}
          </Paso>

          <Paso numero={3} titulo="Medio de pago">
            <div className="flex flex-wrap gap-x-6 gap-y-3" role="radiogroup" aria-label="Medio de pago">
              {MEDIOS_PAGO.map((medio) => (
                <label key={medio.valor} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    className="radio radio-sm"
                    name="medio-pago"
                    value={medio.valor}
                    checked={medioPago === medio.valor}
                    onChange={() => setMedioPago(medio.valor)}
                  />
                  {medio.texto}
                </label>
              ))}
            </div>
            <p className="mt-3 text-sm text-base-content/80">
              Es una simulación académica: no se cobra nada ni se piden datos de tarjeta.
            </p>
          </Paso>

          <details className="rounded-box border border-dashed border-base-300 p-5 text-sm">
            <summary className="cursor-pointer font-semibold">Modo demostración: fecha y hora de la compra</summary>
            <div className="mt-4 flex flex-col gap-3">
              <p>
                Las funciones de prueba son del 12 al 21 de octubre de 2026, así que las compras se registran con una fecha
                simulada. Para ver el descuento de los miércoles, elige el 14 de octubre antes de una función de ese día.
              </p>
              <Campo etiqueta="Fecha y hora de la compra">
                <input
                  type="datetime-local"
                  className="input w-64 max-w-full"
                  value={fechaHora}
                  onChange={(e) => setFechaHora(e.target.value)}
                />
              </Campo>
              {yaEmpezo && (
                <p className="text-duna-profunda">
                  Con esta fecha la función ya habría empezado: la base de datos va a rechazar la compra.
                </p>
              )}
            </div>
          </details>
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-box bg-base-200 p-6">
            <h2 className="font-display text-2xl">{funcion.titulo}</h2>
            <p className="mt-1 text-sm text-base-content/80">
              {capitalizar(fechaLarga(funcion.fecha))} · {hora(funcion.hora_inicio)}
            </p>

            <ul className="mt-5 flex flex-col gap-2 border-t border-base-300 pt-4 text-sm">
              {funcion.tipos_boleta
                .filter((tipo) => cantidades[tipo.id_tipo_boleta])
                .map((tipo) => (
                  <li key={tipo.id_tipo_boleta} className="flex justify-between">
                    <span>
                      {cantidades[tipo.id_tipo_boleta]} × {nombreCategoria(tipo.categoria)}
                    </span>
                    <span>
                      {pesos(cantidades[tipo.id_tipo_boleta] * tipo.precio_base * (conDescuento ? 0.5 : 1))}
                    </span>
                  </li>
                ))}
              {totalBoletas === 0 && <li className="text-base-content/80">Aún no has elegido boletas.</li>}
            </ul>

            <div className="mt-4 flex items-baseline justify-between border-t border-base-300 pt-4">
              <span className="font-semibold">Total estimado</span>
              <span className="font-display text-3xl">{pesos(totalEstimado)}</span>
            </div>
            {conDescuento && <p className="badge badge-accent mt-3">Incluye 50 % de descuento de miércoles</p>}
            <p className="mt-3 text-xs text-base-content/80">
              El precio final lo calcula la base de datos al registrar la compra.
            </p>

            <button type="submit" className="btn btn-primary btn-block mt-6" disabled={!puedeComprar}>
              {enviando ? 'Registrando…' : 'Confirmar compra'}
            </button>
            {!compradorListo && totalBoletas > 0 && (
              <p className="mt-2 text-xs text-base-content/80">Completa tus datos para continuar.</p>
            )}
          </div>

          {errorCompra && (
            <div className="mt-4">
              <AvisoError error={errorCompra} titulo="No se pudo registrar la compra." />
            </div>
          )}
        </aside>
      </form>
    </>
  )
}
