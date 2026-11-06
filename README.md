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
│       ├── 01_creacion_tablas_ejecucion.png
│       ├── 01_creacion_tablas_verificacion.png
│       ├── 02_datos_prueba_ejecucion_verificacion.png
│       ├── 03_triggers_ejecucion_verificacion.png
│       ├── 04_procedimientos_ejecucion_verificacion.png
│       ├── 05_consulta1_resultado.png
│       ├── 05_consulta2_resultado.png
│       └── 05_consulta3_resultado.png
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

- **Modelo entidad-relación:** 19 entidades y 24 relaciones (22 de uno a muchos y 2 de muchos a muchos), cada una con un verbo. Incluye la entidad de soporte `LOG_AUDITORIA`.
- **Modelo relacional:** 21 tablas normalizadas hasta la tercera forma normal (3FN), con 26 llaves foráneas, llaves primarias, valores únicos y obligatorios. Los tipos de dato coinciden con los del script de PostgreSQL (`TIME`, `TIMESTAMP`, `TIMESTAMPTZ`, `JSONB`, entre otros).
- **LOG_AUDITORIA:** Guarda el historial de cambios de `CONTRATO`, `TIPO_BOLETA`, `VENTA` y `STAFF`. Se conecta con esas tablas mediante cuatro llaves foráneas opcionales con `ON DELETE SET NULL`, para conservar el historial aunque se elimine el registro auditado.

### Contenido de los scripts

| Script | Contenido |
|---|---|
| `01_creacion_tablas.sql` | 21 tablas (9 catálogos, 9 principales, 2 intermedias y 1 de soporte) con llaves primarias, 26 llaves foráneas, restricciones `CHECK`, `UNIQUE` y 23 índices |
| `02_datos_prueba.sql` | 10 películas, 37 actores y directores, 40 funciones, 35 espectadores y 59 ventas |
| `03_triggers.sql` | 10 triggers en 7 tablas: programación de funciones, auditoría, total de la venta, precio de la boleta, validación de ventas, protección de salas y validación de contratos |
| `04_procedimientos.sql` | 3 procedimientos: reprogramación de la función más vendida, retiro de la película menos vista y reporte de ventas por película |
| `05_consultas.sql` | 3 consultas: espectadores con gasto superior al promedio, actores y directores en más de una película y ocupación por función |

### Tecnología

- PostgreSQL 16, ejecutado en [Neon](https://neon.tech).

### Orden de ejecución de los scripts

Los triggers se crean antes de cargar los datos para que calculen automáticamente la hora de fin de las funciones, el precio unitario y el total de las ventas, y para que el trigger de auditoría registre la carga inicial.

1. `01_creacion_tablas.sql`
2. `03_triggers.sql`
3. `02_datos_prueba.sql`
4. `04_procedimientos.sql`
5. `05_consultas.sql`


El script `01_creacion_tablas.sql` elimina las tablas si ya existen, por lo que la secuencia completa se puede repetir para dejar la base en su estado inicial.


### Uso de los procedimientos
 
Los tres procedimientos se invocan con `CALL`:
 
```sql
-- Reprograma la función más vendida entre semana para el fin de semana siguiente
CALL sp_reprogramar_funcion_mas_vendida('2026-10-12', '2026-10-16', '2026-10-18');
 
-- Retira de la cartelera la película menos vista (cancela sus funciones futuras sin ventas)
CALL sp_retirar_pelicula_menos_vista('2026-10-12', '2026-10-18');
```
 
El reporte de ventas devuelve su resultado en un cursor, que solo existe dentro de la transacción. Por eso se ejecutan las cuatro líneas juntas:
 
```sql
BEGIN;
CALL sp_reporte_ventas_pelicula('2026-10-12', '2026-10-18', 'rpt_ventas');
FETCH ALL FROM rpt_ventas;
COMMIT;
```