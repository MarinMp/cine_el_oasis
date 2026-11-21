import base64
import hashlib
import hmac
import json
import os
import secrets
import time
from pathlib import Path

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field

load_dotenv(Path(__file__).with_name(".env"))

ADMIN_USUARIO = os.getenv("ADMIN_USUARIO", "")
ADMIN_CLAVE = os.getenv("ADMIN_CLAVE", "")
# Si no se define en el .env, se genera al encender la API (las sesiones se cierran al reiniciarla)
SECRETO_SESION = os.getenv("SECRETO_SESION") or secrets.token_hex(32)
DURACION_SESION = 8 * 60 * 60

router = APIRouter(tags=["Sesion"])
esquema_bearer = HTTPBearer(auto_error=False)


def _b64(datos: bytes) -> str:
    return base64.urlsafe_b64encode(datos).rstrip(b"=").decode()


def _firmar(contenido: str) -> str:
    return _b64(hmac.new(SECRETO_SESION.encode(), contenido.encode(), hashlib.sha256).digest())


def crear_token(usuario: str):
    """Token firmado con HMAC-SHA256: contenido en base64 + firma. Vence en 8 horas."""
    expira = int(time.time()) + DURACION_SESION
    contenido = _b64(json.dumps({"usuario": usuario, "expira": expira}).encode())
    return f"{contenido}.{_firmar(contenido)}", expira


def leer_token(token: str):
    try:
        contenido, firma = token.split(".")
        if not hmac.compare_digest(firma, _firmar(contenido)):
            return None
        datos = json.loads(base64.urlsafe_b64decode(contenido + "=" * (-len(contenido) % 4)))
    except Exception:
        return None
    return datos if datos.get("expira", 0) > time.time() else None


def requiere_admin(credenciales: HTTPAuthorizationCredentials | None = Depends(esquema_bearer)):
    """Dependencia para las rutas de reportes y administracion."""
    datos = leer_token(credenciales.credentials) if credenciales else None
    if datos is None:
        raise HTTPException(
            status_code=401,
            detail={"mensaje": "Inicia sesión como administrador para continuar.", "origen": "sesion"},
            headers={"WWW-Authenticate": "Bearer"},
        )
    return datos["usuario"]


class Credenciales(BaseModel):
    usuario: str = Field(max_length=60)
    clave: str = Field(max_length=200)


@router.post("/auth/login")
def iniciar_sesion(credenciales: Credenciales):
    if not ADMIN_USUARIO or not ADMIN_CLAVE:
        raise HTTPException(
            status_code=503,
            detail={
                "mensaje": "El inicio de sesión no está configurado: faltan ADMIN_USUARIO y ADMIN_CLAVE en el .env.",
                "origen": "api",
            },
        )
    usuario_correcto = hmac.compare_digest(credenciales.usuario.encode(), ADMIN_USUARIO.encode())
    clave_correcta = hmac.compare_digest(credenciales.clave.encode(), ADMIN_CLAVE.encode())
    if not (usuario_correcto and clave_correcta):
        time.sleep(0.5)
        raise HTTPException(
            status_code=401,
            detail={"mensaje": "Usuario o contraseña incorrectos.", "origen": "sesion"},
        )
    token, expira = crear_token(ADMIN_USUARIO)
    return {"token": token, "usuario": ADMIN_USUARIO, "expira": expira}


@router.get("/auth/sesion")
def sesion_actual(usuario: str = Depends(requiere_admin)):
    return {"usuario": usuario}
