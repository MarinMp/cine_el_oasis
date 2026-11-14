from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import peliculas, salud

app = FastAPI(
    title="Cine El Oasis API",
    description="Capa de servicios del Cine El Oasis: PostgreSQL (Neon) y MongoDB (Atlas).",
    version="0.1.0",
)

# El front de Vite corre en el puerto 5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(salud.router, prefix="/api")
app.include_router(peliculas.router, prefix="/api")
