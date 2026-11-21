"""Casos de uso que combinan, en una misma respuesta, datos de PostgreSQL y de MongoDB."""
from datetime import date, datetime, time, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from pymongo.errors import PyMongoError

from auth import requiere_admin
from db import conexion_pg, mongo

router = APIRouter(tags=["Integracion"])

# Colombia no tiene horario de verano: UTC-5 todo el ano
HORA_COLOMBIA = timezone(timedelta(hours=-5))


def error_mongo(error: PyMongoError):
    return HTTPException(
        status_code=503,
        detail={"mensaje": "MongoDB no respondió: " + str(error)[:150], "origen": "mongodb"},
    )


# ---------------------------------------------------------------------
# Caso de uso: resenas de una pelicula (MongoDB) con el espectador y la
# compra que las respalda (PostgreSQL)
# ---------------------------------------------------------------------

SQL_ESPECTADORES = """
    SELECT id_espectador, primer_nombre || ' ' || primer_apellido AS nombre
      FROM espectador
     WHERE id_espectador = ANY(%s)
"""

SQL_COMPRAS = """
    SELECT v.id_venta,
           v.id_espectador,
           v.fecha_hora,
           v.canal,
           f.id_pelicula,
           f.fecha AS fecha_funcion,
           f.hora_inicio,
           s.nombre AS sala,
           COALESCE(SUM(d.cantidad), 0) AS boletas
      FROM venta v
      JOIN funcion f ON f.id_funcion = v.id_funcion
      JOIN sala s    ON s.id_sala = f.id_sala
      LEFT JOIN detalle_venta d ON d.id_venta = v.id_venta
     WHERE v.id_venta = ANY(%s)
     GROUP BY v.id_venta, v.id_espectador, v.fecha_hora, v.canal, f.id_pelicula, f.fecha, f.hora_inicio, s.nombre
"""


@router.get("/integracion/resenas/{id_pelicula}")
def resenas_con_compra(id_pelicula: int):
    """Resenas de la pelicula (MongoDB) + nombre del espectador y compra verificada (PostgreSQL)."""
    try:
        resenas = list(
            mongo.resenas_peliculas.find({"id_pelicula": id_pelicula}, {"_id": 0}).sort("fecha", -1)
        )
    except PyMongoError as error:
        raise error_mongo(error)

    ids_espectador = sorted({r["id_espectador"] for r in resenas})
    ids_venta = sorted({r["id_venta"] for r in resenas if r.get("id_venta")})
    with conexion_pg() as conn:
        nombres = {
            fila["id_espectador"]: fila["nombre"]
            for fila in conn.execute(SQL_ESPECTADORES, (ids_espectador,)).fetchall()
        }
        compras = {fila["id_venta"]: fila for fila in conn.execute(SQL_COMPRAS, (ids_venta,)).fetchall()}

    for resena in resenas:
        resena["espectador"] = nombres.get(resena["id_espectador"])
        compra = compras.get(resena.get("id_venta"))
        # La compra respalda la resena si es del mismo espectador y de una funcion de esta pelicula
        resena["compra_verificada"] = bool(
            compra and compra["id_espectador"] == resena["id_espectador"] and compra["id_pelicula"] == id_pelicula
        )
        resena["compra"] = compra

    promedio = round(sum(r["calificacion"] for r in resenas) / len(resenas), 2) if resenas else None
    return {"id_pelicula": id_pelicula, "total": len(resenas), "promedio": promedio, "resenas": resenas}


# ---------------------------------------------------------------------
# Caso de uso: cruce de ventas por sala (PostgreSQL) con los incidentes
# de cada sala (MongoDB) en un periodo
# ---------------------------------------------------------------------

SQL_VENTAS_POR_SALA = """
    SELECT s.id_sala,
           s.nombre AS sala,
           ts.nombre AS tipo_sala,
           s.capacidad,
           COUNT(DISTINCT f.id_funcion) AS funciones,
           COALESCE(SUM(d.cantidad), 0) AS boletas,
           COALESCE(SUM(d.cantidad * d.precio_unitario), 0) AS recaudo
      FROM sala s
      JOIN tipo_sala ts ON ts.id_tipo_sala = s.id_tipo_sala
      LEFT JOIN funcion f       ON f.id_sala = s.id_sala AND f.fecha BETWEEN %s AND %s
      LEFT JOIN venta v         ON v.id_funcion = f.id_funcion
      LEFT JOIN detalle_venta d ON d.id_venta = v.id_venta
     GROUP BY s.id_sala, s.nombre, ts.nombre, s.capacidad
     ORDER BY s.id_sala
"""


@router.get("/integracion/salas", dependencies=[Depends(requiere_admin)])
def ventas_e_incidentes_por_sala(inicio: date = date(2026, 10, 12), fin: date = date(2026, 10, 21)):
    """Boletas y recaudo de cada sala (PostgreSQL) frente a sus incidentes (MongoDB)."""
    if inicio > fin:
        raise HTTPException(
            status_code=422,
            detail={"mensaje": "La fecha de inicio no puede ser posterior a la fecha de fin.", "origen": "api"},
        )

    desde = datetime.combine(inicio, time.min, HORA_COLOMBIA)
    hasta = datetime.combine(fin + timedelta(days=1), time.min, HORA_COLOMBIA)
    filtro_periodo = {"fecha": {"$gte": desde, "$lt": hasta}}
    try:
        incidentes = {
            fila["_id"]: fila
            for fila in mongo.reportes_incidentes.aggregate([
                {"$match": {**filtro_periodo, "id_sala": {"$ne": None}}},
                {"$group": {
                    "_id": "$id_sala",
                    "incidentes": {"$sum": 1},
                    "pendientes": {"$sum": {"$cond": [{"$in": ["$estado", ["ABIERTO", "EN_PROCESO"]]}, 1, 0]}},
                    "fallas_tecnicas": {"$sum": {"$cond": [{"$eq": ["$tipo", "FALLA_TECNICA"]}, 1, 0]}},
                    "minutos_retraso": {"$sum": {"$ifNull": ["$detalle.minutos_retraso", 0]}},
                    "tipos": {"$addToSet": "$tipo"},
                }},
            ])
        }
        sin_sala = mongo.reportes_incidentes.count_documents({**filtro_periodo, "id_sala": None})
    except PyMongoError as error:
        raise error_mongo(error)

    with conexion_pg() as conn:
        salas = conn.execute(SQL_VENTAS_POR_SALA, (inicio, fin)).fetchall()

    for sala in salas:
        datos = incidentes.get(sala["id_sala"], {})
        sala["incidentes"] = datos.get("incidentes", 0)
        sala["pendientes"] = datos.get("pendientes", 0)
        sala["fallas_tecnicas"] = datos.get("fallas_tecnicas", 0)
        sala["minutos_retraso"] = datos.get("minutos_retraso", 0)
        sala["tipos_incidente"] = sorted(datos.get("tipos", []))
        sala["incidentes_por_100_boletas"] = (
            round(sala["incidentes"] * 100 / sala["boletas"], 1) if sala["boletas"] else None
        )

    return {"inicio": inicio, "fin": fin, "salas": salas, "incidentes_sin_sala": sin_sala}


# ---------------------------------------------------------------------
# Comprobantes que dejo la transaccion cruzada, comparados con PostgreSQL
# ---------------------------------------------------------------------

@router.get("/integracion/comprobantes", dependencies=[Depends(requiere_admin)])
def comprobantes_recientes(limite: int = 10):
    """Ultimos comprobantes de MongoDB y si coinciden con la venta guardada en PostgreSQL."""
    try:
        comprobantes = list(
            mongo.comprobantes_venta.find({}, {"_id": 0}).sort("registrado_en", -1).limit(max(1, min(limite, 50)))
        )
    except PyMongoError as error:
        raise error_mongo(error)

    with conexion_pg() as conn:
        ventas = {
            fila["id_venta"]: fila
            for fila in conn.execute(
                "SELECT id_venta, total FROM venta WHERE id_venta = ANY(%s)",
                ([c["id_venta"] for c in comprobantes],),
            ).fetchall()
        }

    for comprobante in comprobantes:
        venta = ventas.get(comprobante["id_venta"])
        comprobante["en_postgresql"] = venta is not None
        comprobante["coincide_total"] = venta is not None and float(venta["total"]) == comprobante["total"]
    return comprobantes
