import { useCallback, useMemo, useState } from 'react'
import { api } from '../api.js'
import { AvisoError } from '../components/Avisos.jsx'
import { Barra, Reporte, Tabla } from '../components/Reporte.jsx'
import {
  capitalizar,
  etiqueta,
  fechaHora,
  fechaLarga,
  hora,
  pesos,
} from '../formato.js'
import useDatos from '../useDatos.js'

const PESTANAS = [
  { id: 'postgresql', texto: 'PostgreSQL' },
  { id: 'mongodb', texto: 'MongoDB' },
  { id: 'administracion', texto: 'Administración' },
]

const cargarOcupacion = () => api.reporte('ocupacion')
const cargarEspectadores = () => api.reporte('espectadores-top')
const cargarElenco = () => api.reporte('elenco-repetido')
const cargarAuditoria = () => api.reporte('auditoria?limite=20')
const cargarCalificaciones = () => api.reporte('calificaciones')
const cargarIncidentes = () => api.reporte('incidentes')
const cargar3D = () => api.reporte('peliculas-3d-subtituladas')
const cargarResenas = () => Promise.all([api.reporte('resenas-sin-respuesta'), api.peliculas()])
const cargarEspeciales = () => api.reporte('funciones-especiales')

function CampoFecha({ etiqueta: texto, valor, onCambio }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-semibold">
      {texto}
      <input type="date" className="input input-sm w-44" value={valor} onChange={(e) => onCambio(e.target.value)} />
    </label>
  )
}

// ---------------------------------------------------------------- PostgreSQL

function VentasPorPelicula() {
  const [borrador, setBorrador] = useState({ inicio: '2026-10-12', fin: '2026-10-18' })
  const [periodo, setPeriodo] = useState(borrador)
  const cargar = useCallback(
    () => api.reporte(`ventas-por-pelicula?inicio=${periodo.inicio}&fin=${periodo.fin}`),
    [periodo],
  )
  const estado = useDatos(cargar)
  const filas = estado.datos ?? []
  const maximo = Math.max(0, ...filas.map((f) => f.recaudo))
  const total = filas.reduce((suma, f) => suma + f.recaudo, 0)

  return (
    <Reporte
      titulo="Ventas por película"
      base="PostgreSQL"
      descripcion="Funciones, boletas y dinero recaudado por película en un periodo, separando taquilla y venta en línea."
      tecnica="Procedimiento sp_reporte_ventas_pelicula · resultado en un cursor (REFCURSOR)"
      estado={estado}
      controles={
        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            setPeriodo({ ...borrador })
          }}
        >
          <CampoFecha etiqueta="Desde" valor={borrador.inicio} onCambio={(v) => setBorrador({ ...borrador, inicio: v })} />
          <CampoFecha etiqueta="Hasta" valor={borrador.fin} onCambio={(v) => setBorrador({ ...borrador, fin: v })} />
          <button type="submit" className="btn btn-secondary btn-sm">
            Generar reporte
          </button>
        </form>
      }
    >
      <Tabla
        clave={(f) => f.pelicula}
        filas={filas}
        columnas={[
          { titulo: 'Película', valor: (f) => <span className="font-semibold">{f.pelicula}</span> },
          { titulo: 'Funciones', derecha: true, valor: (f) => f.funciones },
          { titulo: 'Boletas', derecha: true, valor: (f) => f.boletas },
          { titulo: 'Taquilla', derecha: true, valor: (f) => f.boletas_taquilla },
          { titulo: 'En línea', derecha: true, valor: (f) => f.boletas_en_linea },
          { titulo: 'Recaudo', derecha: true, valor: (f) => <Barra valor={f.recaudo} maximo={maximo} texto={pesos(f.recaudo)} /> },
        ]}
      />
      {filas.length > 0 && (
        <p className="mt-4 text-right text-sm">
          Recaudo total del periodo: <span className="font-display text-xl">{pesos(total)}</span>
        </p>
      )}
    </Reporte>
  )
}

function Ocupacion() {
  const estado = useDatos(cargarOcupacion)
  const [todas, setTodas] = useState(false)
  const filas = estado.datos ?? []
  const visibles = todas ? filas : filas.slice(0, 10)

  return (
    <Reporte
      titulo="Ocupación por función"
      base="PostgreSQL"
      descripcion="Boletas vendidas frente a la capacidad de la sala, de la función menos llena a la más llena."
      tecnica="Consulta 3 · LEFT JOIN con subconsulta agregada"
      estado={estado}
    >
      <Tabla
        clave={(f) => f.id_funcion}
        filas={visibles}
        columnas={[
          { titulo: 'Película', valor: (f) => <span className="font-semibold">{f.titulo}</span> },
          { titulo: 'Función', valor: (f) => `${capitalizar(fechaLarga(f.fecha))}, ${hora(f.hora_inicio)}` },
          { titulo: 'Sala', valor: (f) => f.sala },
          { titulo: 'Vendidas', derecha: true, valor: (f) => `${f.boletas_vendidas} de ${f.capacidad}` },
          { titulo: 'Ocupación', derecha: true, valor: (f) => <Barra valor={f.pct_ocupacion} maximo={100} texto={`${f.pct_ocupacion} %`} /> },
        ]}
      />
      {filas.length > 10 && (
        <button type="button" className="btn btn-ghost btn-sm mt-3" onClick={() => setTodas(!todas)}>
          {todas ? 'Ver solo las 10 primeras' : `Ver las ${filas.length} funciones`}
        </button>
      )}
    </Reporte>
  )
}

function EspectadoresTop() {
  const estado = useDatos(cargarEspectadores)
  return (
    <Reporte
      titulo="Espectadores que gastan más que el promedio"
      base="PostgreSQL"
      descripcion="Clientes cuyo gasto total supera el promedio de gasto por espectador, con su posición en el ranking."
      tecnica="Consulta 1 · subconsulta en el WHERE + función de ventana RANK()"
      estado={estado}
    >
      <Tabla
        clave={(f) => f.correo}
        filas={estado.datos}
        columnas={[
          { titulo: 'Puesto', derecha: true, valor: (f) => f.posicion },
          {
            titulo: 'Espectador',
            valor: (f) => (
              <>
                <span className="font-semibold">{f.espectador}</span>
                <span className="block text-xs text-base-content/70">{f.correo}</span>
              </>
            ),
          },
          { titulo: 'Compras', derecha: true, valor: (f) => f.compras },
          { titulo: 'Boletas', derecha: true, valor: (f) => f.boletas },
          { titulo: 'Total gastado', derecha: true, valor: (f) => pesos(f.total_gastado) },
        ]}
      />
    </Reporte>
  )
}

function ElencoRepetido() {
  const estado = useDatos(cargarElenco)
  return (
    <Reporte
      titulo="Actores y directores en varias películas"
      base="PostgreSQL"
      descripcion="Personas que participan en más de una película en la cartelera del 12 al 18 de octubre."
      tecnica="Consulta 2 · GROUP BY + HAVING + STRING_AGG"
      estado={estado}
    >
      <Tabla
        clave={(f) => `${f.persona}-${f.rol}`}
        filas={estado.datos}
        columnas={[
          { titulo: 'Persona', valor: (f) => <span className="font-semibold">{f.persona}</span> },
          { titulo: 'Rol', valor: (f) => etiqueta(f.rol) },
          { titulo: 'Nacionalidad', valor: (f) => etiqueta(f.nacionalidad) },
          { titulo: 'Películas', derecha: true, valor: (f) => f.peliculas },
          { titulo: 'En cartelera', valor: (f) => <span className="text-sm">{f.peliculas_en_cartelera}</span> },
        ]}
      />
    </Reporte>
  )
}

function Auditoria() {
  const estado = useDatos(cargarAuditoria)
  return (
    <Reporte
      titulo="Auditoría"
      base="PostgreSQL"
      descripcion="Últimos 20 cambios registrados en LOG_AUDITORIA. Haz una compra y vuelve a cargar: aparecen la inserción de la venta y una actualización por cada tipo de boleta."
      tecnica="Trigger fn_auditoria sobre VENTA, CONTRATO, TIPO_BOLETA y STAFF"
      estado={estado}
      controles={
        <button type="button" className="btn btn-secondary btn-sm" onClick={estado.recargar}>
          Volver a cargar
        </button>
      }
    >
      <Tabla
        clave={(f) => f.id_log_auditoria}
        filas={estado.datos}
        columnas={[
          { titulo: 'N.º', derecha: true, valor: (f) => f.id_log_auditoria },
          { titulo: 'Tabla', valor: (f) => <code>{f.tabla_afectada.toUpperCase()}</code> },
          { titulo: 'Operación', valor: (f) => <span className="badge badge-sm badge-outline">{f.operacion}</span> },
          { titulo: 'Registro', derecha: true, valor: (f) => f.id_registro ?? '—' },
          { titulo: 'Usuario', valor: (f) => f.usuario_de_sesion },
          { titulo: 'Fecha', valor: (f) => fechaHora(f.fecha_hora) },
        ]}
      />
    </Reporte>
  )
}

// ---------------------------------------------------------------- MongoDB

function Calificaciones() {
  const estado = useDatos(cargarCalificaciones)
  return (
    <Reporte
      titulo="Calificación de cada película"
      base="MongoDB"
      descripcion="Promedio de estrellas, cantidad de reseñas, porcentaje de compras verificadas y reseñas negativas."
      tecnica="Consulta 1 · aggregate con $group y $lookup a las fichas técnicas"
      estado={estado}
    >
      <Tabla
        clave={(f) => f.id_pelicula}
        filas={estado.datos}
        columnas={[
          { titulo: 'Película', valor: (f) => <span className="font-semibold">{f.titulo}</span> },
          { titulo: 'Promedio', derecha: true, valor: (f) => <Barra valor={f.promedio} maximo={5} texto={`${f.promedio} de 5`} /> },
          { titulo: 'Reseñas', derecha: true, valor: (f) => f.resenas },
          { titulo: 'Verificadas', derecha: true, valor: (f) => `${f.pct_verificadas} %` },
          { titulo: 'Negativas', derecha: true, valor: (f) => f.negativas },
        ]}
      />
    </Reporte>
  )
}

function Incidentes() {
  const estado = useDatos(cargarIncidentes)
  return (
    <Reporte
      titulo="Incidentes por tipo"
      base="MongoDB"
      descripcion="Cuántos incidentes hubo de cada tipo, cuántos siguen pendientes y, en las fallas técnicas, el retraso promedio y las funciones reprogramadas."
      tecnica="Consulta 2 · aggregate con $group, $addToSet y $filter"
      estado={estado}
    >
      <Tabla
        clave={(f) => f.tipo}
        filas={estado.datos}
        columnas={[
          { titulo: 'Tipo', valor: (f) => <span className="font-semibold">{etiqueta(f.tipo)}</span> },
          { titulo: 'Total', derecha: true, valor: (f) => f.total },
          { titulo: 'Pendientes', derecha: true, valor: (f) => f.pendientes },
          { titulo: 'Resueltos', derecha: true, valor: (f) => f.resueltos },
          { titulo: 'Retraso promedio', derecha: true, valor: (f) => (f.retraso_promedio_min == null ? '—' : `${f.retraso_promedio_min} min`) },
          { titulo: 'Reprogramadas', derecha: true, valor: (f) => f.funciones_reprogramadas },
          { titulo: 'Salas afectadas', derecha: true, valor: (f) => f.salas_afectadas },
        ]}
      />
    </Reporte>
  )
}

function Peliculas3D() {
  const estado = useDatos(cargar3D)
  return (
    <Reporte
      titulo="Películas en 3D subtituladas al español"
      base="MongoDB"
      descripcion="Películas que tienen una misma versión que es 3D y además trae subtítulos en español."
      tecnica="Consulta 3 · find con $elemMatch sobre el arreglo de versiones"
      estado={estado}
    >
      <ul className="flex flex-wrap gap-2">
        {(estado.datos ?? []).map((p) => (
          <li key={p.id_pelicula} className="badge badge-lg gap-2 border-base-300 bg-base-200 py-4">
            {p.titulo}
            {p.en_cartelera && <span className="text-xs text-duna-profunda">en cartelera</span>}
          </li>
        ))}
      </ul>
    </Reporte>
  )
}

function ResenasSinRespuesta() {
  const estado = useDatos(cargarResenas)
  const [resenas, peliculas] = estado.datos ?? [[], []]
  const titulos = useMemo(() => Object.fromEntries(peliculas.map((p) => [p.id_pelicula, p.titulo])), [peliculas])

  return (
    <Reporte
      titulo="Reseñas negativas sin respuesta"
      base="MongoDB"
      descripcion="Reseñas de 1 o 2 estrellas que el cine todavía no ha respondido."
      tecnica="Consulta 4 · find con $lte y $exists"
      estado={estado}
    >
      {resenas.length === 0 ? (
        <p className="text-sm">No hay reseñas negativas pendientes.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {resenas.map((r) => (
            <li key={`${r.id_venta}-${r.fecha}`} className="rounded-box bg-base-200 p-4 text-sm">
              <p className="font-semibold">
                {'★'.repeat(r.calificacion)}
                <span className="sr-only">{r.calificacion} de 5 estrellas</span> · {titulos[r.id_pelicula] ?? `Película ${r.id_pelicula}`}
              </p>
              <p className="mt-2 font-display text-lg">{r.titulo}</p>
              <p className="mt-1">{r.texto}</p>
              <p className="mt-2 text-xs text-base-content/80">{fechaHora(r.fecha)}</p>
            </li>
          ))}
        </ul>
      )}
    </Reporte>
  )
}

function FuncionesEspeciales() {
  const estado = useDatos(cargarEspeciales)
  return (
    <Reporte
      titulo="Funciones 4D y VIP con sus incidentes"
      base="MongoDB"
      descripcion="Requisitos de proyección de las funciones especiales y los incidentes que tuvieron."
      tecnica="Consulta 5 · aggregate con dos $lookup (incidentes y fichas técnicas)"
      estado={estado}
    >
      <Tabla
        clave={(f) => f.id_funcion}
        filas={estado.datos}
        columnas={[
          { titulo: 'Función', derecha: true, valor: (f) => f.id_funcion },
          { titulo: 'Película', valor: (f) => <span className="font-semibold">{f.pelicula}</span> },
          { titulo: 'Formato', valor: (f) => <span className="badge badge-sm badge-secondary">{f.formato}</span> },
          { titulo: 'Sonido', valor: (f) => f.sonido },
          { titulo: 'Efectos', valor: (f) => (f.efectos?.length ? f.efectos.join(', ') : '—') },
          { titulo: 'Incidentes', derecha: true, valor: (f) => f.incidentes },
          { titulo: 'Tipos', valor: (f) => (f.tipos_incidente?.length ? f.tipos_incidente.map(etiqueta).join(', ') : '—') },
        ]}
      />
    </Reporte>
  )
}

// ---------------------------------------------------------------- Administracion

function Procedimiento({ titulo, descripcion, nota, campos, valoresIniciales, ruta }) {
  const [valores, setValores] = useState(valoresIniciales)
  const [confirmado, setConfirmado] = useState(false)
  const [estado, setEstado] = useState({ ejecutando: false, resultado: null, error: null })

  async function ejecutar(e) {
    e.preventDefault()
    setEstado({ ejecutando: true, resultado: null, error: null })
    try {
      const resultado = await api.administrar(ruta, valores)
      setEstado({ ejecutando: false, resultado, error: null })
    } catch (error) {
      setEstado({ ejecutando: false, resultado: null, error })
    }
    setConfirmado(false)
  }

  return (
    <Reporte titulo={titulo} base="PostgreSQL" descripcion={descripcion} tecnica={nota}>
      <form onSubmit={ejecutar} className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-3">
          {campos.map((campo) => (
            <CampoFecha
              key={campo.nombre}
              etiqueta={campo.etiqueta}
              valor={valores[campo.nombre]}
              onCambio={(v) => setValores({ ...valores, [campo.nombre]: v })}
            />
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="checkbox checkbox-sm"
            checked={confirmado}
            onChange={(e) => setConfirmado(e.target.checked)}
          />
          Entiendo que este procedimiento modifica la base de datos.
        </label>
        <div>
          <button type="submit" className="btn btn-primary btn-sm" disabled={!confirmado || estado.ejecutando}>
            {estado.ejecutando ? 'Ejecutando…' : 'Ejecutar procedimiento'}
          </button>
        </div>
      </form>

      {estado.resultado && (
        <div role="status" className="mt-5 rounded-box bg-base-200 p-4 text-sm">
          <p className="font-semibold">El procedimiento terminó. Mensajes de PostgreSQL (RAISE NOTICE):</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {estado.resultado.mensajes.map((mensaje) => (
              <li key={mensaje}>{mensaje}</li>
            ))}
          </ul>
        </div>
      )}
      {estado.error && (
        <div className="mt-5">
          <AvisoError error={estado.error} titulo="El procedimiento no se ejecutó." />
          {estado.error.detalle?.origen === 'procedimiento' && (
            <p className="mt-2 text-xs text-base-content/80">
              Lo rechazó el propio procedimiento (RAISE EXCEPTION). No se guardó ningún cambio.
            </p>
          )}
        </div>
      )}
    </Reporte>
  )
}

// ---------------------------------------------------------------- Pagina

export default function Reportes() {
  const [pestana, setPestana] = useState('postgresql')

  return (
    <>
      <section className="bg-noche text-arena">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-duna">Administración</p>
          <h1 className="mt-4 font-display text-5xl leading-none sm:text-6xl">Reportes</h1>
          <p className="mt-5 max-w-2xl text-lg text-arena/80">
            Los procedimientos y consultas de las dos bases de datos, ejecutados en vivo a través de la API.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6">
        <div role="tablist" aria-label="Base de datos" className="tabs tabs-box mb-8 w-fit bg-base-200">
          {PESTANAS.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={pestana === p.id}
              className={`tab font-semibold ${pestana === p.id ? 'tab-active' : 'text-base-content/80'}`}
              onClick={() => setPestana(p.id)}
            >
              {p.texto}
            </button>
          ))}
        </div>

        {pestana === 'postgresql' && (
          <div className="flex flex-col gap-6">
            <VentasPorPelicula />
            <Ocupacion />
            <EspectadoresTop />
            <ElencoRepetido />
            <Auditoria />
          </div>
        )}

        {pestana === 'mongodb' && (
          <div className="flex flex-col gap-6">
            <Calificaciones />
            <Incidentes />
            <Peliculas3D />
            <ResenasSinRespuesta />
            <FuncionesEspeciales />
          </div>
        )}

        {pestana === 'administracion' && (
          <div className="flex flex-col gap-6">
            <div role="alert" className="alert alert-warning">
              <p className="text-sm">
                Estos procedimientos <strong>cambian datos en Neon</strong>. Antes de la sustentación la base se deja como
                nueva corriendo otra vez los scripts 01 → 03 → 02 → 04.
              </p>
            </div>
            <Procedimiento
              titulo="Reprogramar la función más vendida"
              ruta="reprogramar-funcion-mas-vendida"
              descripcion="Busca la función con más boletas vendidas en la semana y crea una copia, con el mismo personal, el sábado o domingo siguiente."
              nota="sp_reprogramar_funcion_mas_vendida · valida las fechas, y el trigger de programación revisa la sala y los 20 minutos entre funciones"
              valoresIniciales={{ inicio: '2026-10-12', fin: '2026-10-16', nueva_fecha: '2026-10-18' }}
              campos={[
                { nombre: 'inicio', etiqueta: 'Semana desde' },
                { nombre: 'fin', etiqueta: 'Semana hasta' },
                { nombre: 'nueva_fecha', etiqueta: 'Nueva fecha (sábado o domingo)' },
              ]}
            />
            <Procedimiento
              titulo="Retirar la película menos vista"
              ruta="retirar-pelicula-menos-vista"
              descripcion="Busca la película con menos boletas vendidas en el periodo y cancela sus funciones futuras sin ventas."
              nota="sp_retirar_pelicula_menos_vista · usa la fecha real del servidor: como las funciones de prueba ya pasaron, informa cuál es la menos vista pero no cancela funciones"
              valoresIniciales={{ inicio: '2026-10-12', fin: '2026-10-18' }}
              campos={[
                { nombre: 'inicio', etiqueta: 'Desde' },
                { nombre: 'fin', etiqueta: 'Hasta' },
              ]}
            />
          </div>
        )}
      </div>
    </>
  )
}
