from fastapi import APIRouter, HTTPException

from db import conexion_pg

router = APIRouter(tags=["Espectadores"])


@router.get("/espectadores/{documento}")
def buscar_espectador(documento: str):
    """Busca un espectador registrado por su numero de documento."""
    with conexion_pg() as conn:
        espectador = conn.execute(
            """SELECT id_espectador, primer_nombre, primer_apellido
                 FROM espectador
                WHERE documento = %s""",
            (documento.strip(),),
        ).fetchone()
    if espectador is None:
        raise HTTPException(status_code=404, detail="No hay un espectador con ese documento")
    return espectador


@router.get("/tipos-documento")
def tipos_documento():
    with conexion_pg() as conn:
        return conn.execute(
            "SELECT id_tipo_documento, nombre FROM tipo_documento ORDER BY id_tipo_documento"
        ).fetchall()
