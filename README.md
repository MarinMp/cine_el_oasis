# 🎞️ | Cine El Oasis

Proyecto integrador de Bases de Datos 2 - Universidad El Bosque, Facultad de Ingeniería de Sistemas, 2026-2.

Cine El Oasis es un centro cinematográfico ficticio ubicado en Bogotá, dedicado a la proyección de grandes estrenos de Hollywood. Cuenta con 10 salas (2D, 3D, VIP y 4D) y vende boletas en taquilla y en línea.

Su identidad parte del nombre: un oasis en medio del desierto. El logo es una gota de agua sobre las dunas, y la paleta de la marca combina tonos arena, azul noche y agua. Es la identidad que usa el front de la entrega final.

## Integrantes

- María Paula Marín Soler
- Justin Felipe Narváez Gutiérrez

**Grupo:** Cinemas 9

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
│   │   └── arquitectura_poliglota.png
│   ├── scripts/
│   │   ├── 01_creacion_colecciones.js
│   │   ├── 02_datos_prueba.js
│   │   └── 03_consultas.js
│   └── evidencias/
│       ├── 01_creacion_colecciones.png
│       ├── 02_datos_de_prueba.png
│       ├── 03_consulta1_resultado.png
│       ├── 03_consulta2_resultado.png
│       ├── 03_consulta3_resultado.png
│       ├── 03_consulta4_resultado.png
│       ├── 03_consulta5_resultado.png
│       ├── evidencia_fichas_tecnicas_peliculas.png
│       ├── evidencia_requisitos_proyeccion.png
│       ├── evidencia_resenas_peliculas.png
│       └── evidencia_reportes_incidentes.png
├── entrega-final/
│   ├── script-integracion/
│   │   ├── main.py
│   │   ├── db.py
│   │   ├── auth.py
│   │   ├── routers/
│   │   ├── mongo/
│   │   │   └── comprobantes_venta.js
│   │   ├── requirements.txt
│   │   └── .env.example
│   ├── modulo-api/
│   │   ├── frontend/
│   │   └── postman/
│   │       └── cine_el_oasis.postman_collection.json
│   ├── evidencias/
│   │   ├── 01_postman_pruebas_api_parte1.png
│   │   ├── 01_postman_pruebas_api_parte2.png
│   │   ├── 02_postman_pruebas_compras.png
│   │   ├── 03_postman_pruebas_reportes.png
│   │   └── 04_postman_pruebas_integracion.png
│   ├── informe-final-consolidado.pdf
│   └── portafolio-individual/
│       ├── justin-narvaez-reflexion.pdf
│       └── maria-paula-marin-reflexion.pdf
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

PostgreSQL sigue siendo el núcleo transaccional: ventas, funciones, salas, contratos y personal, donde los datos deben ser siempre exactos. MongoDB guarda la información que no encaja bien en tablas porque su estructura cambia de un registro a otro, como fichas técnicas, requisitos de proyección, reseñas e incidentes. Los dos motores se conectan mediante identificadores compartidos.

### Entregables
 
| Entregable | Ubicación |
|---|---|
| Diagrama de arquitectura políglota | `avance2-mongodb/diagrama-arquitectura-poliglota/` |
| Creación de colecciones | `avance2-mongodb/scripts/01_creacion_colecciones.js` |
| Datos de prueba | `avance2-mongodb/scripts/02_datos_prueba.js` |
| Consultas MongoDB | `avance2-mongodb/scripts/03_consultas.js` |
| Capturas de ejecución | `avance2-mongodb/evidencias/` |
| Informe | `avance2-informe.pdf` (entregado en la plataforma) |

### Colecciones
 
| Colección | Documentos | Identificadores compartidos con PostgreSQL | Validación |
|---|---|---|---|
| `fichas_tecnicas_peliculas` | 30 (una por película) | `id_pelicula`, `id_persona` | Índice único |
| `requisitos_proyeccion` | 40 (uno por función) | `id_funcion`, `id_sala`, `id_pelicula` | Índice único |
| `resenas_peliculas` | 36 | `id_pelicula`, `id_espectador`, `id_venta`, `id_staff` | `$jsonSchema` |
| `reportes_incidentes` | 32 | `id_funcion`, `id_sala`, `id_staff`, `id_espectador` | `$jsonSchema` |

### Tecnología
 
- MongoDB 8.0 en [MongoDB Atlas](https://www.mongodb.com/atlas) (conjunto de réplicas de 3 nodos), administrado con MongoDB Compass.

### Orden de ejecución de los scripts
 
Los scripts se ejecutan en el shell de Compass (*Open MongoDB shell*) y trabajan sobre la base de datos `el_oasis`:
 
1. `01_creacion_colecciones.js`
2. `02_datos_prueba.js`
3. `03_consultas.js`, una consulta a la vez

El script `01_creacion_colecciones.js` elimina las colecciones si ya existen, y `02_datos_prueba.js` borra los documentos antes de insertarlos, por lo que la secuencia se puede repetir para dejar la base en su estado inicial.

### Validación con `$jsonSchema`
 
Estos dos documentos son rechazados con `Document failed validation`:
 
```javascript
// Calificación fuera de rango y texto demasiado corto
db.resenas_peliculas.insertOne({
    id_pelicula: 5, id_espectador: 13,
    calificacion: 7, texto: "Mala", fecha: new Date()
});
 
// Queja de servicio sin el espectador en el detalle
db.reportes_incidentes.insertOne({
    tipo: "QUEJA_SERVICIO", fecha: new Date(), estado: "ABIERTO",
    descripcion: "El cliente reclama por la demora en la taquilla",
    id_staff_reporta: 2, detalle: { motivo: "demora" }
});
```

## Entrega final - Integración de PostgreSQL y MongoDB

Una API en Python (FastAPI) se conecta a los dos motores y expone sus datos a un front en React y a una colección de Postman. El front no se conecta directamente a las bases: todo pasa por la API, que reúne en una sola respuesta lo que está en PostgreSQL y lo que está en MongoDB.

### Entregables

| Entregable | Ubicación |
|---|---|
| Script de integración (API conectada a PostgreSQL y MongoDB) | `entrega-final/script-integracion/` |
| Colección de MongoDB para la transacción cruzada | `entrega-final/script-integracion/mongo/comprobantes_venta.js` |
| Módulo de exposición: front | `entrega-final/modulo-api/frontend/` |
| Módulo de exposición: colección de Postman | `entrega-final/modulo-api/postman/` |
| Capturas de las pruebas | `entrega-final/evidencias/` |
| Informe final consolidado | `entrega-final/informe-final-consolidado.pdf` |
| Reflexiones individuales | `entrega-final/portafolio-individual/` |

### Arquitectura

```
  Front (React)                  Postman
        │                           │
        └────────── /api ───────────┘
                      │
            API FastAPI (Python)
            │                   │
        psycopg 3            PyMongo
            │                   │
    PostgreSQL (Neon)    MongoDB (Atlas)
```

Durante el desarrollo, Vite redirige las peticiones que el front hace a `/api` hacia la API en `http://127.0.0.1:8000`.

### Tecnología

| Capa | Tecnología |
|---|---|
| API | Python 3, FastAPI, Uvicorn, psycopg 3 y PyMongo |
| Front | React 19, Vite, React Router, Tailwind CSS 4 y daisyUI 5 |
| Pruebas | Postman: 23 peticiones y 65 pruebas |
| Bases | PostgreSQL 16 en Neon y MongoDB 8.0 en Atlas, las mismas de los avances 1 y 2 |

Las versiones exactas están en `entrega-final/script-integracion/requirements.txt` y en `entrega-final/modulo-api/frontend/package.json`.

### Requisitos previos

- Las bases de los avances 1 y 2 cargadas, siguiendo el orden de ejecución de cada avance.
- Python 3 (probado con 3.15), Node.js (probado con 24) y `mongosh` o el shell de Compass.
- La IP del equipo agregada en la lista de acceso de Atlas (*Database & Network Access → IP Access List*).

### Configuración

En `entrega-final/script-integracion/` se copia `.env.example` como `.env` y se llenan los valores. El archivo `.env` no se sube al repositorio.

| Variable | Uso |
|---|---|
| `DATABASE_URL` | Cadena de conexión de PostgreSQL en Neon |
| `MONGODB_URI` | Cadena de conexión de MongoDB Atlas |
| `ADMIN_USUARIO` y `ADMIN_CLAVE` | Usuario y contraseña del administrador para entrar a Reportes |
| `FECHA_SIMULADA` | Opcional. Fecha y hora con la que se registran las compras; por defecto `2026-10-12T08:00:00` |
| `SECRETO_SESION` | Opcional. Secreto para firmar las sesiones; si no se define, la API genera uno al encender |

### Ejecución

1. Crear la colección `comprobantes_venta` en MongoDB. El script se puede ejecutar varias veces y no borra los comprobantes existentes. También se puede pegar en el shell de Compass.

```bash
cd entrega-final/script-integracion
mongosh "<cadena de conexión de Atlas>" --file mongo/comprobantes_venta.js
```

2. Encender la API:

```bash
cd entrega-final/script-integracion
python3 -m venv .venv
source .venv/bin/activate        # En Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

La API queda en `http://127.0.0.1:8000` y su documentación interactiva en `http://127.0.0.1:8000/docs`.

3. Encender el front en otra terminal:

```bash
cd entrega-final/modulo-api/frontend
npm install
npm run dev
```

El front queda en `http://localhost:5173`. El pie de página muestra si cada base está conectada.

4. Probar con Postman: importar `entrega-final/modulo-api/postman/cine_el_oasis.postman_collection.json`, escribir `admin_usuario` y `admin_clave` en el valor actual (*Current value*) de las variables de la colección y ejecutarla con *Run*. Con la API encendida pasan las 65 pruebas. Cada ejecución registra dos ventas de prueba en PostgreSQL, con sus comprobantes en MongoDB.

### Casos de uso de integración

| # | Caso de uso | PostgreSQL | MongoDB | Endpoint | Dónde se ve en el front |
|---|---|---|---|---|---|
| 1 | Película con su ficha técnica | Película, funciones, boletas vendidas y disponibles | `fichas_tecnicas_peliculas` | `GET /api/peliculas/{id}` | Detalle de la película |
| 2 | Función con sus requisitos técnicos | Función, sala, cupos y tipos de boleta | `requisitos_proyeccion` | `GET /api/funciones/{id}` | Página de compra |
| 3 | Reseñas respaldadas por una compra | Espectador y venta de cada reseña | `resenas_peliculas` | `GET /api/integracion/resenas/{id_pelicula}` | Detalle de la película, sección Reseñas |
| 4 | Ventas e incidentes por sala | Funciones, boletas y recaudo por sala | `reportes_incidentes` agrupados por sala | `GET /api/integracion/salas?inicio=&fin=` | Reportes → Integración |
| 5 | Compra de boletas (transacción cruzada) | `VENTA`, `DETALLE_VENTA` y `LOG_AUDITORIA` | `comprobantes_venta` | `POST /api/ventas` | Compra y Reportes → Integración |

En el caso 3, una reseña aparece como *compra verificada* cuando su `id_venta` existe en PostgreSQL, pertenece al mismo espectador y es de una función de esa película.

### Transacción cruzada

Una compra impacta los dos motores en la misma operación:

1. La API abre una transacción en PostgreSQL, registra al espectador si es nuevo e inserta la venta y sus líneas de detalle. Los triggers del avance 1 validan la compra (función que no ha empezado, tipo de sala, aforo y máximo de 10 boletas), calculan los precios, el descuento del miércoles y el total, y registran la auditoría.
2. Antes del `COMMIT`, la API guarda el comprobante de la venta en la colección `comprobantes_venta` de MongoDB, que tiene validación con `$jsonSchema` y un índice único por `id_venta`.
3. Si MongoDB no responde, la API devuelve 503 y PostgreSQL hace `ROLLBACK`: la venta no queda en ninguna de las dos bases.
4. Si el `COMMIT` de PostgreSQL falla después de guardar el comprobante, la API borra el comprobante de MongoDB.
5. Si un trigger rechaza la compra, la API devuelve 409 con el mensaje del trigger y no escribe nada en MongoDB.

`GET /api/integracion/comprobantes` compara los últimos comprobantes de MongoDB con las ventas de PostgreSQL e indica si los totales coinciden.

### Manejo de errores

Los errores de negocio llegan con un mensaje en español y su origen (`trigger`, `restriccion`, `procedimiento`, `mongodb` o `sesion`), y el front los muestra al usuario.

| Código | Cuándo ocurre |
|---|---|
| 401 | Reportes o administración sin iniciar sesión, o usuario y contraseña incorrectos |
| 404 | Película, función, venta o espectador que no existe |
| 409 | Un trigger rechaza la compra: más de 10 boletas, función que ya empezó o sala sin cupo |
| 422 | Datos inválidos: restricciones de la base (correo, teléfono), periodo con el inicio posterior al fin o error de un procedimiento |
| 503 | Una de las dos bases no responde |

### Inicio de sesión

Reportes y Administración son solo para el administrador. `POST /api/auth/login` compara el usuario y la contraseña con los del `.env` y entrega un token firmado con HMAC-SHA256 que vence en 8 horas. Los reportes, los procedimientos de administración y los casos de uso de integración por sala y de comprobantes exigen ese token en el encabezado `Authorization: Bearer`.

### Endpoints principales

| Método y ruta | Requiere sesión | Descripción |
|---|---|---|
| `GET /api/salud` | No | Estado de las dos bases |
| `GET /api/peliculas` | No | Catálogo y cartelera |
| `GET /api/peliculas/{id}` | No | Caso de uso 1 |
| `GET /api/funciones/{id}` | No | Caso de uso 2 |
| `GET /api/integracion/resenas/{id_pelicula}` | No | Caso de uso 3 |
| `POST /api/ventas` | No | Compra de boletas (transacción cruzada) |
| `GET /api/ventas/{id}` | No | Venta de PostgreSQL con su comprobante de MongoDB |
| `POST /api/auth/login` | No | Inicio de sesión del administrador |
| `GET /api/integracion/salas` | Sí | Caso de uso 4 |
| `GET /api/integracion/comprobantes` | Sí | Comprobantes de MongoDB comparados con PostgreSQL |
| `GET /api/reportes/...` | Sí | Procedimiento de ventas, consultas del avance 1, auditoría y consultas del avance 2 |
| `POST /api/admin/...` | Sí | Procedimientos de reprogramación y de retiro |

La lista completa, con los parámetros de cada endpoint, está en `http://127.0.0.1:8000/docs`.

### Fecha simulada

Las funciones de los datos de prueba van del 12 al 21 de octubre de 2026, y el trigger `trg_venta_validar` no vende boletas de funciones que ya empezaron. Por eso la API registra las compras con una fecha simulada (`FECHA_SIMULADA`, por defecto el 12 de octubre de 2026 a las 8:00 a. m.). Una compra también puede enviar su propia `fecha_hora`, como hace la prueba del descuento del miércoles en Postman. Los datos son los de las bases reales; solo la fecha de la compra es simulada.

### Reiniciar las bases

Para dejar las bases en su estado inicial, por ejemplo antes de una demostración:

1. En PostgreSQL, ejecutar de nuevo `01_creacion_tablas.sql`, `03_triggers.sql`, `02_datos_prueba.sql` y `04_procedimientos.sql`.
2. En MongoDB, vaciar los comprobantes:

```javascript
db.getSiblingDB("el_oasis").comprobantes_venta.deleteMany({});
```

Los dos pasos van juntos: al reiniciar PostgreSQL los identificadores de las ventas vuelven a empezar, y un comprobante anterior con el mismo `id_venta` haría fallar la compra por el índice único.
