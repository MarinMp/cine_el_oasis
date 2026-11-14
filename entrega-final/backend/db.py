import os
from contextlib import contextmanager
from pathlib import Path

import certifi
import psycopg
from dotenv import load_dotenv
from psycopg.rows import dict_row
from pymongo import MongoClient

load_dotenv(Path(__file__).with_name(".env"))

DATABASE_URL = os.environ["DATABASE_URL"]
MONGODB_URI = os.environ["MONGODB_URI"]

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
