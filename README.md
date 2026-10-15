# 🎞️ | Cine El Oasis

Proyecto integrador de Bases de Datos 2 - Universidad El Bosque, Facultad de Ingeniería de Sistemas, 2026-2.

Cine El Oasis es un centro cinematográfico ficticio ubicado en Bogotá, dedicado a la proyección de grandes estrenos de Hollywood. Cuenta con 10 salas (2D, 3D, VIP y 4D) y vende boletas en taquilla y en línea.

## Integrantes

- María Paula Marín Soler
- Justin Felipe Narváez Gutiérrez

**Docente:** Francisco Rafael Barguil Vanegas

## Estructura del repositorio

```
cine_el_oasis/
├── avance1-postgresql/
│   ├── modelo-er/
│   │   └── mer_el_oasis.png
│   ├── modelo-relacional/
│   │   └── mr_el_oasis.png
│   ├── scripts/
│   │   ├── 01_creacion_tablas.sql
│   │   ├── 02_datos_prueba.sql
│   │   ├── 03_triggers.sql
│   │   ├── 04_procedimientos.sql
│   │   └── 05_consultas.sql
│   └── evidencias/
└── README.md
```

## Avance 1 - Núcleo transaccional (PostgreSQL)

### Entregables

| Entregable | Ubicación |
|---|---|
| Modelo entidad-relación | `avance1-postgresql/modelo-er/` |
| Modelo relacional en 3FN | `avance1-postgresql/modelo-relacional/` |
| Creación de tablas | `avance1-postgresql/scripts/01_creacion_tablas.sql` |
| Datos de prueba | `avance1-postgresql/scripts/02_datos_prueba.sql` |
| Triggers | `avance1-postgresql/scripts/03_triggers.sql` |
| Procedimientos almacenados | `avance1-postgresql/scripts/04_procedimientos.sql` |
| Consultas SQL | `avance1-postgresql/scripts/05_consultas.sql` |
| Capturas de ejecución | `avance1-postgresql/evidencias/` |
| Informe | `avance1-informe.pdf` (entregado en la plataforma) |

### Modelos

- **Modelo entidad-relación:** 18 entidades y 20 relaciones (18 de uno a muchos y 2 de muchos a muchos). 
- **Modelo relacional:** 20 tablas normalizadas hasta la tercera forma normal (3FN), con llaves primarias, llaves foráneas, valores únicos y obligatorios.

### Contenido de los scripts

| Script | Contenido |
|---|---|
| `01_creacion_tablas.sql` | 20 tablas con llaves primarias, foráneas, restricciones `CHECK`, `UNIQUE` e índices |
| `02_datos_prueba.sql` | 10 películas, 37 actores y directores, 40 funciones, 35 espectadores y 59 ventas |
| `03_triggers.sql` | 10 triggers en 7 tablas: programación de funciones, auditoría, total de la venta, precio de la boleta, validación de ventas, protección de salas y validación de contratos |
| `04_procedimientos.sql` | 3 procedimientos: reprogramación de la función más vendida, retiro de la película menos vista y reporte de ventas por película |
| `05_consultas.sql` | 3 consultas: ocupación por función, espectadores con gasto superior al promedio y actores y directores en más de una película |

### Tecnología

- PostgreSQL 16, ejecutado en [Neon](https://neon.tech).

### Orden de ejecución de los scripts

Los triggers se crean antes de cargar los datos para que calculen automáticamente la hora de fin de las funciones, el precio unitario y el total de las ventas.

1. `01_creacion_tablas.sql`
2. `03_triggers.sql`
3. `02_datos_prueba.sql`
4. `04_procedimientos.sql`
5. `05_consultas.sql`