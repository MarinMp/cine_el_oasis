from fastapi import APIRouter, HTTPException

from db import conexion_pg, mongo

router = APIRouter(tags=["Funciones"])

SQL_FUNCION = """
    SELECT f.id_funcion,
           f.fecha,
           f.hora_inicio,
           f.hora_fin,
           f.version_proyeccion,
           p.id_pelicula,
           p.titulo,
           p.duracion_min,
           g.nombre AS genero,
           c.nombre AS clasificacion,
           c.edad_minima,
           s.nombre AS sala,
           s.id_tipo_sala,
           ts.nombre AS tipo_sala,
           s.capacidad,
           COALESCE((SELECT SUM(d.cantidad)
                       FROM venta ve
                       JOIN detalle_venta d ON d.id_venta = ve.id_venta
                      WHERE ve.id_funcion = f.id_funcion), 0) AS vendidas
      FROM funcion f
      JOIN pelicula p      ON p.id_pelicula = f.id_pelicula
      JOIN genero g        ON g.id_genero = p.id_genero
      JOIN clasificacion c ON c.id_clasificacion = p.id_clasificacion
      JOIN sala s          ON s.id_sala = f.id_sala
      JOIN tipo_sala ts    ON ts.id_tipo_sala = s.id_tipo_sala
     WHERE f.id_funcion = %s
"""

SQL_TIPOS_BOLETA = """
    SELECT tb.id_tipo_boleta,
           ce.nombre AS categoria,
           tb.precio_base
      FROM tipo_boleta tb
      JOIN categoria_espectador ce ON ce.id_categoria = tb.id_categoria
     WHERE tb.id_tipo_sala = %s
     ORDER BY tb.precio_base DESC
"""


@router.get("/funciones/{id_funcion}")
def detalle_funcion(id_funcion: int):
    """Funcion con su pelicula, sala, sillas disponibles y tipos de boleta (PostgreSQL)
    mas sus requisitos de proyeccion (MongoDB)."""
    with conexion_pg() as conn:
        funcion = conn.execute(SQL_FUNCION, (id_funcion,)).fetchone()
        if funcion is None:
            raise HTTPException(status_code=404, detail="Funcion no encontrada")
        funcion["disponibles"] = funcion["capacidad"] - funcion["vendidas"]
        funcion["tipos_boleta"] = conn.execute(SQL_TIPOS_BOLETA, (funcion.pop("id_tipo_sala"),)).fetchall()

    try:
        funcion["proyeccion"] = mongo.requisitos_proyeccion.find_one(
            {"id_funcion": id_funcion},
            {"_id": 0, "formato": 1, "version": 1, "subtitulado": 1, "requisitos": 1},
        )
    except Exception:
        funcion["proyeccion"] = None

    return funcion
