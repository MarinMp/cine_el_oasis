from collections import Counter
from datetime import datetime, timedelta, timezone
from typing import Literal

import psycopg
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from pymongo.errors import PyMongoError

from db import FECHA_SIMULADA, conexion_pg, mongo

router = APIRouter(tags=["Ventas"])

# Las fechas de PostgreSQL estan en hora de Colombia (UTC-5); MongoDB guarda en UTC
HORA_COLOMBIA = timezone(timedelta(hours=-5))


class Boleta(BaseModel):
    id_tipo_boleta: int
    cantidad: int = Field(ge=1, le=10)


class Comprador(BaseModel):
    documento: str = Field(min_length=3, max_length=20)
    # Los demas datos solo se usan si el documento no esta registrado
    id_tipo_documento: int | None = None
    primer_nombre: str | None = Field(default=None, max_length=40)
    primer_apellido: str | None = Field(default=None, max_length=40)
    correo: str | None = Field(default=None, max_length=100)
    telefono: str | None = Field(default=None, max_length=15)


class Compra(BaseModel):
    id_funcion: int
    medio_pago: Literal["TARJETA DEBITO", "TARJETA CREDITO", "TRANSFERENCIA"]
    comprador: Comprador
    boletas: list[Boleta] = Field(min_length=1)
    # Si no se envia, se usa FECHA_SIMULADA
    fecha_hora: datetime | None = None


MENSAJES_RESTRICCION = {
    "espectador_correo_ck": "El correo no tiene un formato válido (debe ir en minúsculas, como nombre@dominio.com).",
    "espectador_telefono_ck": "El teléfono debe tener exactamente 10 números.",
    "espectador_correo_un": "Ese correo ya está registrado con otro documento.",
    "espectador_telefono_un": "Ese teléfono ya está registrado con otro documento.",
    "espectador_tipo_documento_fk": "El tipo de documento no existe.",
    "detalle_venta_tipo_boleta_fk": "El tipo de boleta no existe.",
}

SQL_VENTA = """
    SELECT v.id_venta,
           v.id_espectador,
           v.fecha_hora,
           v.canal,
           v.medio_pago,
           v.total,
           e.primer_nombre || ' ' || e.primer_apellido AS espectador,
           p.id_pelicula,
           p.titulo,
           f.id_funcion,
           f.fecha,
           f.hora_inicio,
           s.nombre AS sala,
           ts.nombre AS tipo_sala
      FROM venta v
      JOIN espectador e ON e.id_espectador = v.id_espectador
      JOIN funcion f    ON f.id_funcion = v.id_funcion
      JOIN pelicula p   ON p.id_pelicula = f.id_pelicula
      JOIN sala s       ON s.id_sala = f.id_sala
      JOIN tipo_sala ts ON ts.id_tipo_sala = s.id_tipo_sala
     WHERE v.id_venta = %s
"""

SQL_DETALLE = """
    SELECT ce.nombre AS categoria,
           d.cantidad,
           tb.precio_base,
           d.precio_unitario,
           d.cantidad * d.precio_unitario AS subtotal
      FROM detalle_venta d
      JOIN tipo_boleta tb          ON tb.id_tipo_boleta = d.id_tipo_boleta
      JOIN categoria_espectador ce ON ce.id_categoria = tb.id_categoria
     WHERE d.id_venta = %s
     ORDER BY tb.precio_base DESC
"""

SQL_AUDITORIA = """
    SELECT operacion, count(*) AS registros
      FROM log_auditoria
     WHERE id_venta = %s
     GROUP BY operacion
"""


def obtener_espectador(conn, comprador: Comprador) -> int:
    """Devuelve el id del espectador; si el documento no existe, lo registra."""
    documento = comprador.documento.strip()
    fila = conn.execute(
        "SELECT id_espectador FROM espectador WHERE documento = %s", (documento,)
    ).fetchone()
    if fila:
        return fila["id_espectador"]

    obligatorios = {
        "id_tipo_documento": "tipo de documento",
        "primer_nombre": "nombre",
        "primer_apellido": "apellido",
        "correo": "correo",
    }
    faltan = [texto for campo, texto in obligatorios.items() if not getattr(comprador, campo)]
    if faltan:
        raise HTTPException(
            status_code=422,
            detail={
                "mensaje": "El documento no está registrado. Para registrarlo faltan: " + ", ".join(faltan) + ".",
                "origen": "api",
            },
        )

    fila = conn.execute(
        """INSERT INTO espectador (documento, primer_nombre, primer_apellido, correo, telefono, id_tipo_documento)
           VALUES (%s, %s, %s, %s, %s, %s)
           RETURNING id_espectador""",
        (
            documento,
            comprador.primer_nombre.strip(),
            comprador.primer_apellido.strip(),
            comprador.correo.strip().lower(),
            (comprador.telefono or "").strip() or None,
            comprador.id_tipo_documento,
        ),
    ).fetchone()
    return fila["id_espectador"]


def leer_venta(conn, id_venta: int):
    venta = conn.execute(SQL_VENTA, (id_venta,)).fetchone()
    if venta is None:
        return None
    venta["detalle"] = conn.execute(SQL_DETALLE, (id_venta,)).fetchall()
    venta["descuento_miercoles"] = any(d["precio_unitario"] < d["precio_base"] for d in venta["detalle"])
    venta["auditoria"] = {
        fila["operacion"]: fila["registros"] for fila in conn.execute(SQL_AUDITORIA, (id_venta,)).fetchall()
    }
    return venta


def armar_comprobante(venta: dict) -> dict:
    """Documento que se guarda en MongoDB con la misma compra registrada en PostgreSQL."""
    return {
        "id_venta": venta["id_venta"],
        "id_espectador": venta["id_espectador"],
        "id_funcion": venta["id_funcion"],
        "id_pelicula": venta["id_pelicula"],
        "pelicula": venta["titulo"],
        "espectador": venta["espectador"],
        "funcion": {
            "fecha": venta["fecha"].isoformat(),
            "hora_inicio": venta["hora_inicio"].isoformat(),
            "sala": venta["sala"],
            "tipo_sala": venta["tipo_sala"],
        },
        "boletas": [
            {
                "categoria": linea["categoria"],
                "cantidad": linea["cantidad"],
                "precio_unitario": float(linea["precio_unitario"]),
                "subtotal": float(linea["subtotal"]),
            }
            for linea in venta["detalle"]
        ],
        "total": float(venta["total"]),
        "medio_pago": venta["medio_pago"],
        "canal": venta["canal"],
        "descuento_miercoles": venta["descuento_miercoles"],
        "fecha_compra": venta["fecha_hora"].replace(tzinfo=HORA_COLOMBIA),
        "estado": "EMITIDO",
        "registrado_en": datetime.now(timezone.utc),
    }


@router.post("/ventas", status_code=201)
def registrar_venta(compra: Compra):
    """Transaccion cruzada: la compra se registra en PostgreSQL (venta y detalle, validados y
    calculados por los triggers) y su comprobante en MongoDB. Si MongoDB falla, se deshace la
    venta en PostgreSQL; si el COMMIT de PostgreSQL falla, se borra el comprobante de MongoDB."""
    cantidades = Counter()
    for boleta in compra.boletas:
        cantidades[boleta.id_tipo_boleta] += boleta.cantidad

    id_comprobante = None
    try:
        with conexion_pg() as conn:
            id_espectador = obtener_espectador(conn, compra.comprador)
            id_venta = conn.execute(
                """INSERT INTO venta (fecha_hora, canal, medio_pago, id_espectador, id_funcion)
                   VALUES (%s, 'EN LINEA', %s, %s, %s)
                   RETURNING id_venta""",
                (compra.fecha_hora or FECHA_SIMULADA, compra.medio_pago, id_espectador, compra.id_funcion),
            ).fetchone()["id_venta"]
            for id_tipo_boleta, cantidad in cantidades.items():
                conn.execute(
                    "INSERT INTO detalle_venta (id_venta, id_tipo_boleta, cantidad) VALUES (%s, %s, %s)",
                    (id_venta, id_tipo_boleta, cantidad),
                )
            venta = leer_venta(conn, id_venta)

            # Segundo motor: si MongoDB no guarda el comprobante, la excepcion sale del bloque
            # y PostgreSQL hace ROLLBACK de la venta
            try:
                id_comprobante = mongo.comprobantes_venta.insert_one(armar_comprobante(venta)).inserted_id
            except PyMongoError:
                raise HTTPException(
                    status_code=503,
                    detail={
                        "mensaje": "MongoDB no respondió, así que la compra no se guardó en ninguna de las dos bases.",
                        "origen": "mongodb",
                    },
                )
        # Al salir del bloque sin errores, PostgreSQL hace COMMIT

    except psycopg.errors.RaiseException as error:
        # Rechazo de un trigger (RAISE EXCEPTION): no se guarda nada de la compra
        raise HTTPException(
            status_code=409,
            detail={
                "mensaje": error.diag.message_primary,
                "sugerencia": error.diag.message_hint,
                "origen": "trigger",
            },
        )
    except psycopg.errors.IntegrityError as error:
        restriccion = error.diag.constraint_name
        raise HTTPException(
            status_code=422,
            detail={
                "mensaje": MENSAJES_RESTRICCION.get(restriccion, "Los datos de la compra no son válidos."),
                "restriccion": restriccion,
                "origen": "restriccion",
            },
        )
    except psycopg.Error:
        # El COMMIT de PostgreSQL fallo despues de escribir en MongoDB: se compensa
        if id_comprobante is not None:
            mongo.comprobantes_venta.delete_one({"_id": id_comprobante})
        raise

    venta["mongodb"] = {"coleccion": "comprobantes_venta", "id": str(id_comprobante)}
    return venta


@router.get("/ventas/{id_venta}")
def consultar_venta(id_venta: int):
    """La venta desde PostgreSQL y su comprobante desde MongoDB."""
    with conexion_pg() as conn:
        venta = leer_venta(conn, id_venta)
    if venta is None:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    try:
        venta["comprobante_mongo"] = mongo.comprobantes_venta.find_one({"id_venta": id_venta}, {"_id": 0})
    except PyMongoError:
        venta["comprobante_mongo"] = None
    return venta
