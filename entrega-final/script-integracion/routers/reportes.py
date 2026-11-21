from datetime import date

import psycopg
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from auth import requiere_admin
from db import conexion_pg, mongo

# Todas las rutas de este archivo exigen sesion de administrador
router = APIRouter(tags=["Reportes"], dependencies=[Depends(requiere_admin)])


def error_procedimiento(error: psycopg.errors.RaiseException):
    """Convierte el RAISE EXCEPTION de un procedimiento en una respuesta 422."""
    return HTTPException(
        status_code=422,
        detail={
            "mensaje": error.diag.message_primary,
            "sugerencia": error.diag.message_hint,
            "origen": "procedimiento",
        },
    )


# ---------------------------------------------------------------------
# PostgreSQL: procedimiento de reporte y consultas del avance 1
# ---------------------------------------------------------------------

@router.get("/reportes/ventas-por-pelicula")
def ventas_por_pelicula(inicio: date = date(2026, 10, 12), fin: date = date(2026, 10, 18)):
    """sp_reporte_ventas_pelicula: el resultado llega en un cursor que solo existe dentro de la transaccion."""
    try:
        with conexion_pg() as conn:
            conn.execute("CALL sp_reporte_ventas_pelicula(%s, %s, 'rpt_ventas')", (inicio, fin))
            return conn.execute("FETCH ALL FROM rpt_ventas").fetchall()
    except psycopg.errors.RaiseException as error:
        raise error_procedimiento(error)


SQL_ESPECTADORES_TOP = """
    SELECT RANK() OVER (ORDER BY g.total_gastado DESC) AS posicion,
           e.primer_nombre || ' ' || e.primer_apellido AS espectador,
           e.correo,
           g.compras,
           g.boletas,
           g.total_gastado
      FROM espectador e
      JOIN (SELECT v.id_espectador,
                   COUNT(DISTINCT v.id_venta) AS compras,
                   SUM(d.cantidad) AS boletas,
                   SUM(d.cantidad * d.precio_unitario) AS total_gastado
              FROM venta v
              JOIN detalle_venta d ON d.id_venta = v.id_venta
             GROUP BY v.id_espectador) g ON g.id_espectador = e.id_espectador
     WHERE g.total_gastado > (SELECT AVG(t.gasto)
                                FROM (SELECT SUM(total) AS gasto
                                        FROM venta
                                       GROUP BY id_espectador) t)
     ORDER BY posicion, espectador
"""

SQL_ELENCO_REPETIDO = """
    SELECT a.primer_nombre || ' ' || a.primer_apellido AS persona,
           n.nombre AS nacionalidad,
           r.nombre AS rol,
           COUNT(*) AS peliculas,
           STRING_AGG(p.titulo || COALESCE(' (' || c.personaje || ')', ''), ', '
                      ORDER BY p.fecha_estreno) AS peliculas_en_cartelera
      FROM contrato c
      JOIN actor_director a ON a.id_persona = c.id_persona
      JOIN nacionalidad n   ON n.id_nacionalidad = a.id_nacionalidad
      JOIN rol r            ON r.id_rol = c.id_rol
      JOIN pelicula p       ON p.id_pelicula = c.id_pelicula
     WHERE EXISTS (SELECT 1
                     FROM funcion f
                    WHERE f.id_pelicula = c.id_pelicula
                      AND f.fecha BETWEEN '2026-10-12' AND '2026-10-18')
     GROUP BY a.id_persona, a.primer_nombre, a.primer_apellido, n.nombre, r.nombre
    HAVING COUNT(*) > 1
     ORDER BY peliculas DESC, persona
"""

SQL_OCUPACION = """
    SELECT f.id_funcion,
           p.titulo,
           f.fecha,
           f.hora_inicio,
           s.nombre AS sala,
           s.capacidad,
           COALESCE(b.boletas, 0) AS boletas_vendidas,
           ROUND(COALESCE(b.boletas, 0) * 100.0 / s.capacidad, 1) AS pct_ocupacion
      FROM funcion f
      JOIN pelicula p ON p.id_pelicula = f.id_pelicula
      JOIN sala s     ON s.id_sala = f.id_sala
      LEFT JOIN (SELECT v.id_funcion,
                        SUM(dv.cantidad) AS boletas
                   FROM venta v
                   JOIN detalle_venta dv ON dv.id_venta = v.id_venta
                  GROUP BY v.id_funcion) b ON b.id_funcion = f.id_funcion
     ORDER BY pct_ocupacion ASC, f.fecha ASC
"""

SQL_AUDITORIA = """
    SELECT id_log_auditoria,
           tabla_afectada,
           operacion,
           usuario_de_sesion,
           fecha_hora,
           COALESCE(id_venta, id_contrato, id_tipo_boleta, id_staff) AS id_registro
      FROM log_auditoria
     ORDER BY id_log_auditoria DESC
     LIMIT %s
"""


@router.get("/reportes/espectadores-top")
def espectadores_top():
    """Espectadores que gastaron mas que el promedio, con su posicion (RANK)."""
    with conexion_pg() as conn:
        return conn.execute(SQL_ESPECTADORES_TOP).fetchall()


@router.get("/reportes/elenco-repetido")
def elenco_repetido():
    """Actores y directores con mas de una pelicula en la cartelera del 12 al 18 de octubre."""
    with conexion_pg() as conn:
        return conn.execute(SQL_ELENCO_REPETIDO).fetchall()


@router.get("/reportes/ocupacion")
def ocupacion():
    """Boletas vendidas frente a la capacidad de la sala en cada funcion."""
    with conexion_pg() as conn:
        return conn.execute(SQL_OCUPACION).fetchall()


@router.get("/reportes/auditoria")
def auditoria(limite: int = 20):
    """Ultimos registros que dejo el trigger de auditoria."""
    with conexion_pg() as conn:
        return conn.execute(SQL_AUDITORIA, (max(1, min(limite, 200)),)).fetchall()


# ---------------------------------------------------------------------
# PostgreSQL: procedimientos que modifican datos
# ---------------------------------------------------------------------

class Reprogramacion(BaseModel):
    inicio: date
    fin: date
    nueva_fecha: date


class Periodo(BaseModel):
    inicio: date
    fin: date


def llamar_procedimiento(sql: str, parametros: tuple):
    """Ejecuta un procedimiento y devuelve los RAISE NOTICE que va emitiendo."""
    mensajes = []
    try:
        with conexion_pg() as conn:
            conn.add_notice_handler(lambda aviso: mensajes.append(aviso.message_primary))
            conn.execute(sql, parametros)
    except psycopg.errors.RaiseException as error:
        raise error_procedimiento(error)
    return {"mensajes": mensajes}


@router.post("/admin/reprogramar-funcion-mas-vendida")
def reprogramar_funcion_mas_vendida(datos: Reprogramacion):
    """sp_reprogramar_funcion_mas_vendida: crea una funcion nueva el fin de semana siguiente."""
    return llamar_procedimiento(
        "CALL sp_reprogramar_funcion_mas_vendida(%s, %s, %s)", (datos.inicio, datos.fin, datos.nueva_fecha)
    )


@router.post("/admin/retirar-pelicula-menos-vista")
def retirar_pelicula_menos_vista(datos: Periodo):
    """sp_retirar_pelicula_menos_vista: cancela las funciones futuras de la pelicula menos vista."""
    return llamar_procedimiento("CALL sp_retirar_pelicula_menos_vista(%s, %s)", (datos.inicio, datos.fin))


# ---------------------------------------------------------------------
# MongoDB: consultas del avance 2 (03_consultas.js)
# ---------------------------------------------------------------------

PIPELINE_CALIFICACIONES = [
    {"$group": {
        "_id": "$id_pelicula",
        "resenas": {"$sum": 1},
        "promedio": {"$avg": "$calificacion"},
        "verificadas": {"$sum": {"$cond": [{"$ifNull": ["$id_venta", False]}, 1, 0]}},
        "negativas": {"$sum": {"$cond": [{"$lte": ["$calificacion", 2]}, 1, 0]}},
    }},
    {"$lookup": {
        "from": "fichas_tecnicas_peliculas",
        "localField": "_id",
        "foreignField": "id_pelicula",
        "as": "ficha",
    }},
    {"$project": {
        "_id": 0,
        "id_pelicula": "$_id",
        "titulo": {"$first": "$ficha.titulo"},
        "resenas": 1,
        "promedio": {"$round": ["$promedio", 2]},
        "pct_verificadas": {"$round": [{"$multiply": [{"$divide": ["$verificadas", "$resenas"]}, 100]}, 0]},
        "negativas": 1,
    }},
    {"$sort": {"promedio": -1, "resenas": -1}},
]

PIPELINE_INCIDENTES = [
    {"$group": {
        "_id": "$tipo",
        "total": {"$sum": 1},
        "pendientes": {"$sum": {"$cond": [{"$in": ["$estado", ["ABIERTO", "EN_PROCESO"]]}, 1, 0]}},
        "resueltos": {"$sum": {"$cond": [{"$eq": ["$estado", "RESUELTO"]}, 1, 0]}},
        "retraso_promedio_min": {"$avg": "$detalle.minutos_retraso"},
        "funciones_reprogramadas": {"$sum": {"$cond": ["$detalle.funcion_reprogramada", 1, 0]}},
        "salas_afectadas": {"$addToSet": "$id_sala"},
    }},
    {"$project": {
        "_id": 0,
        "tipo": "$_id",
        "total": 1,
        "pendientes": 1,
        "resueltos": 1,
        "retraso_promedio_min": {"$round": ["$retraso_promedio_min", 1]},
        "funciones_reprogramadas": 1,
        "salas_afectadas": {"$size": {"$filter": {"input": "$salas_afectadas", "cond": {"$ne": ["$$this", None]}}}},
    }},
    {"$sort": {"total": -1, "tipo": 1}},
]

PIPELINE_FUNCIONES_ESPECIALES = [
    {"$match": {"formato": {"$in": ["4D", "VIP"]}}},
    {"$lookup": {
        "from": "reportes_incidentes",
        "localField": "id_funcion",
        "foreignField": "id_funcion",
        "as": "incidentes",
    }},
    {"$lookup": {
        "from": "fichas_tecnicas_peliculas",
        "localField": "id_pelicula",
        "foreignField": "id_pelicula",
        "as": "ficha",
    }},
    {"$project": {
        "_id": 0,
        "id_funcion": 1,
        "id_sala": 1,
        "formato": 1,
        "pelicula": {"$first": "$ficha.titulo"},
        "sonido": "$requisitos.sonido",
        "efectos": "$requisitos.efectos",
        "personal_tecnico_requerido": 1,
        "incidentes": {"$size": "$incidentes"},
        "tipos_incidente": "$incidentes.tipo",
    }},
    {"$sort": {"incidentes": -1, "id_funcion": 1}},
]


def consultar_mongo(funcion):
    try:
        return funcion()
    except Exception as error:
        raise HTTPException(
            status_code=503,
            detail={"mensaje": "MongoDB no respondió: " + str(error)[:150], "origen": "api"},
        )


@router.get("/reportes/calificaciones")
def calificaciones():
    """Consulta 1: promedio de calificacion por pelicula ($group + $lookup)."""
    return consultar_mongo(lambda: list(mongo.resenas_peliculas.aggregate(PIPELINE_CALIFICACIONES)))


@router.get("/reportes/incidentes")
def incidentes():
    """Consulta 2: incidentes por tipo, pendientes, retraso promedio y salas afectadas."""
    return consultar_mongo(lambda: list(mongo.reportes_incidentes.aggregate(PIPELINE_INCIDENTES)))


@router.get("/reportes/peliculas-3d-subtituladas")
def peliculas_3d_subtituladas():
    """Consulta 3: peliculas con una version 3D subtitulada al espanol ($elemMatch)."""
    return consultar_mongo(lambda: list(
        mongo.fichas_tecnicas_peliculas.find(
            {"versiones": {"$elemMatch": {"formato": "3D", "subtitulos": "ESPANOL"}}},
            {"_id": 0, "id_pelicula": 1, "titulo": 1, "en_cartelera": 1,
             "versiones.formato": 1, "versiones.idioma_audio": 1},
        ).sort("id_pelicula", 1)
    ))


@router.get("/reportes/resenas-sin-respuesta")
def resenas_sin_respuesta():
    """Consulta 4: resenas de 1 o 2 estrellas que el cine no ha respondido."""
    return consultar_mongo(lambda: list(
        mongo.resenas_peliculas.find(
            {"calificacion": {"$lte": 2}, "respuesta_empresa": {"$exists": False}},
            {"_id": 0, "id_pelicula": 1, "id_espectador": 1, "id_venta": 1,
             "calificacion": 1, "titulo": 1, "texto": 1, "fecha": 1},
        ).sort("fecha", 1)
    ))


@router.get("/reportes/funciones-especiales")
def funciones_especiales():
    """Consulta 5: funciones 4D y VIP con sus requisitos e incidentes ($lookup entre colecciones)."""
    return consultar_mongo(lambda: list(mongo.requisitos_proyeccion.aggregate(PIPELINE_FUNCIONES_ESPECIALES)))
