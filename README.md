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
├── avance2-mongodb/
│   ├── diagrama-arquitectura-poliglota/
│   ├── scripts/
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

- **Modelo entidad-relación:** 19 entidades y 24 relaciones (22 de uno a muchos y 2 de muchos a muchos), cada una con un verbo. Incluye la entidad de soporte `LOG_AUDITORIA`.
- **Modelo relacional:** 21 tablas normalizadas hasta la tercera forma normal (3FN), con 26 llaves foráneas, llaves primarias, valores únicos y obligatorios. Los tipos de dato coinciden con los del script de PostgreSQL (`TIME`, `TIMESTAMP`, `TIMESTAMPTZ`, `JSONB`, entre otros).
- **LOG_AUDITORIA:** Guarda el historial de cambios de `CONTRATO`, `TIPO_BOLETA`, `VENTA` y `STAFF`. Se conecta con esas tablas mediante cuatro llaves foráneas opcionales con `ON DELETE SET NULL`, para conservar el historial aunque se elimine el registro auditado.

### Contenido de los scripts

| Script | Contenido |
|---|---|
| `01_creacion_tablas.sql` | 21 tablas (9 catálogos, 9 principales, 2 intermedias y 1 de soporte) con llaves primarias, 26 llaves foráneas, restricciones `CHECK`, `UNIQUE` y 23 índices |
| `02_datos_prueba.sql` | 30 películas (10 con funciones programadas y 20 solo en catálogo), 37 actores y directores, 46 contratos, 10 salas, 40 funciones, 61 asignaciones de personal, 12 empleados, 35 espectadores y 59 ventas con 81 líneas de detalle |
| `03_triggers.sql` | 10 triggers en 7 tablas: programación de funciones, auditoría, total de la venta, precio de la boleta, validación de ventas, protección de salas y validación de contratos |
| `04_procedimientos.sql` | 3 procedimientos: reprogramación de la función más vendida, retiro de la película menos vista y reporte de ventas por película |
| `05_consultas.sql` | 3 consultas: espectadores con gasto superior al promedio, actores y directores en más de una película y ocupación por función |

Las 20 películas que solo están en el catálogo, sin funciones programadas, permiten distinguir entre el catálogo del cine y la cartelera de un periodo. El procedimiento `sp_retirar_pelicula_menos_vista` usa `INNER JOIN` contra `FUNCION` justamente por eso: solo se puede retirar de cartelera una película que estuvo en cartelera.

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

Si un script falla a la mitad, la transacción queda abortada y hay que ejecutar `ROLLBACK` antes de cualquier otra sentencia. En ese caso se debe reiniciar desde `01_creacion_tablas.sql`: un `ROLLBACK` deshace las filas insertadas pero no devuelve las secuencias de identidad a su valor anterior, así que volver a correr solo `02_datos_prueba.sql` generaría identificadores distintos a los que esperan las llaves foráneas.

### Resultado esperado de la carga

| Tabla | Registros |
|---|---|
| `GENERO` | 5 |
| `CLASIFICACION` | 5 |
| `IDIOMA` | 2 |
| `NACIONALIDAD` | 7 |
| `ROL` | 2 |
| `TIPO_SALA` | 4 |
| `CATEGORIA_ESPECTADOR` | 3 |
| `TIPO_DOCUMENTO` | 4 |
| `CARGO` | 5 |
| `PELICULA` | 30 |
| `ACTOR_DIRECTOR` | 37 |
| `CONTRATO` | 46 |
| `SALA` | 10 |
| `FUNCION` | 40 |
| `TIPO_BOLETA` | 12 |
| `ESPECTADOR` | 35 |
| `STAFF` | 12 |
| `VENTA` | 59 |
| `DETALLE_VENTA` | 81 |
| `ASIGNACION` | 61 |
| `LOG_AUDITORIA` | 210 |

Los 210 registros de `LOG_AUDITORIA` los genera el trigger de auditoría durante la carga: 46 inserciones en `CONTRATO`, 12 en `TIPO_BOLETA`, 12 en `STAFF`, 59 en `VENTA` y 81 actualizaciones de `VENTA`, una por cada línea de detalle que recalcula el total.

### Uso de los procedimientos

Los dos primeros procedimientos se invocan con `CALL`:

```sql
-- Reprograma la función más vendida entre semana para el fin de semana siguiente
CALL sp_reprogramar_funcion_mas_vendida('2026-10-12', '2026-10-16', '2026-10-18');

-- Retira de la cartelera la película menos vista (cancela sus funciones futuras sin ventas)
CALL sp_retirar_pelicula_menos_vista('2026-10-12', '2026-10-18');
```

`sp_reprogramar_funcion_mas_vendida` exige que la nueva fecha sea el sábado o el domingo del fin de semana inmediatamente posterior a la semana analizada, y copia a la función nueva el personal asignado a la original.

El reporte de ventas devuelve su resultado en un cursor, que solo existe dentro de la transacción. Por eso se ejecutan las cuatro líneas juntas:

```sql
BEGIN;
CALL sp_reporte_ventas_pelicula('2026-10-12', '2026-10-18', 'rpt_ventas');
FETCH ALL FROM rpt_ventas;
COMMIT;
```

## Avance 2 - Arquitectura políglota (MongoDB)

En curso.

| Entregable | Ubicación |
|---|---|
| Diagrama de arquitectura políglota | `avance2-mongodb/diagrama-arquitectura-poliglota/` |
| Scripts de MongoDB | `avance2-mongodb/scripts/` |
| Capturas de ejecución | `avance2-mongodb/evidencias/` |
