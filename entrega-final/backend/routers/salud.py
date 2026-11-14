from fastapi import APIRouter
from fastapi.responses import JSONResponse

from db import conexion_pg, mongo

router = APIRouter(tags=["Salud"])


@router.get("/salud")
def salud():
    """Comprueba la conexion con las dos bases y cuenta los registros principales."""
    resultado = {"postgresql": {"estado": "ok"}, "mongodb": {"estado": "ok"}}

    try:
        with conexion_pg() as conn:
            fila = conn.execute("SELECT count(*) AS peliculas FROM pelicula").fetchone()
            resultado["postgresql"]["peliculas"] = fila["peliculas"]
    except Exception as error:
        resultado["postgresql"] = {"estado": "error", "detalle": str(error)[:200]}

    try:
        mongo.command("ping")
        resultado["mongodb"]["fichas_tecnicas"] = mongo.fichas_tecnicas_peliculas.count_documents({})
    except Exception as error:
        resultado["mongodb"] = {"estado": "error", "detalle": str(error)[:200]}

    todo_ok = all(parte["estado"] == "ok" for parte in resultado.values())
    return JSONResponse(resultado, status_code=200 if todo_ok else 503)
