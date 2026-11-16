import os
from contextlib import contextmanager
from datetime import datetime
from pathlib import Path

import certifi
import psycopg
from dotenv import load_dotenv
from psycopg.rows import dict_row
from pymongo import MongoClient

load_dotenv(Path(__file__).with_name(".env"))

DATABASE_URL = os.environ["DATABASE_URL"]
MONGODB_URI = os.environ["MONGODB_URI"]

# Las funciones de los datos de prueba son del 12 al 21 de octubre de 2026 y el trigger
# trg_venta_validar no deja vender para funciones que ya empezaron. Por eso las compras se
# registran con la fecha de este reloj, que se puede cambiar en el .env.
FECHA_SIMULADA = datetime.fromisoformat(os.getenv("FECHA_SIMULADA", "2026-10-12T08:00:00"))

# Un solo cliente de MongoDB para toda la aplicacion
cliente_mongo = MongoClient(
    MONGODB_URI,
    tlsCAFile=certifi.where(),
    serverSelectionTimeoutMS=8000,
)
mongo = cliente_mongo["el_oasis"]


@contextmanager
def conexion_pg():
    # Neon suspende la base por inactividad; la primera conexion puede tardar unos segundos
    with psycopg.connect(DATABASE_URL, row_factory=dict_row, connect_timeout=20) as conn:
        yield conn
