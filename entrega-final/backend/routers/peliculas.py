from fastapi import APIRouter, HTTPException

from db import conexion_pg, mongo

router = APIRouter(tags=["Peliculas"])

SQL_PELICULAS = """
    SELECT p.id_pelicula,
           p.titulo,
           p.duracion_min,
           p.fecha_estreno,
           g.nombre AS genero,
           c.nombre AS clasificacion,
           c.edad_minima,
           i.nombre AS idioma,
           EXISTS (SELECT 1 FROM funcion f WHERE f.id_pelicula = p.id_pelicula) AS en_cartelera
      FROM pelicula p
      JOIN genero g        ON g.id_genero = p.id_genero
      JOIN clasificacion c ON c.id_clasificacion = p.id_clasificacion
      JOIN idioma i        ON i.id_idioma = p.id_idioma
"""

SQL_FUNCIONES = """
    SELECT f.id_funcion,
           f.fecha,
           f.hora_inicio,
           f.hora_fin,
           f.version_proyeccion,
           s.nombre AS sala,
           ts.nombre AS tipo_sala,
           s.capacidad
      FROM funcion f
      JOIN sala s       ON s.id_sala = f.id_sala
      JOIN tipo_sala ts ON ts.id_tipo_sala = s.id_tipo_sala
     WHERE f.id_pelicula = %s
     ORDER BY f.fecha, f.hora_inicio
"""


@router.get("/peliculas")
def listar_peliculas(en_cartelera: bool | None = None):
    """Catalogo de peliculas. Con en_cartelera=true devuelve solo las que tienen funciones."""
    with conexion_pg() as conn:
        peliculas = conn.execute(
            SQL_PELICULAS + " ORDER BY en_cartelera DESC, p.fecha_estreno DESC, p.titulo"
        ).fetchall()

    if en_cartelera is not None:
        peliculas = [p for p in peliculas if p["en_cartelera"] == en_cartelera]
    return peliculas


@router.get("/peliculas/{id_pelicula}")
def detalle_pelicula(id_pelicula: int):
    """Datos de la pelicula y sus funciones (PostgreSQL) mas su ficha tecnica (MongoDB)."""
    with conexion_pg() as conn:
        pelicula = conn.execute(SQL_PELICULAS + " WHERE p.id_pelicula = %s", (id_pelicula,)).fetchone()
        if pelicula is None:
            raise HTTPException(status_code=404, detail="Pelicula no encontrada")
        pelicula["funciones"] = conn.execute(SQL_FUNCIONES, (id_pelicula,)).fetchall()

    # Si MongoDB no responde, la pelicula se muestra igual sin la ficha
    try:
        pelicula["ficha_tecnica"] = mongo.fichas_tecnicas_peliculas.find_one(
            {"id_pelicula": id_pelicula}, {"_id": 0}
        )
    except Exception:
        pelicula["ficha_tecnica"] = None

    return pelicula
