// =====================================================================
// CINE EL OASIS
// Avance 2 - Capa documental (MongoDB)
// Script 01: 01_creacion_colecciones.js
// Integrantes: Maria Paula Marin Soler, Justin Felipe Narvaez Gutierrez
// ---------------------------------------------------------------------
// 4 colecciones de la capa documental, con validacion
// $jsonSchema en resenas_peliculas y reportes_incidentes, y sus indices.
// Se ejecuta en mongosh (Compass > Open MongoDB shell).
// Orden de ejecucion: 01 -> 02 -> 03
// =====================================================================

db = db.getSiblingDB("el_oasis");

// -- Limpieza colecciones
["fichas_tecnicas_peliculas", "requisitos_proyeccion",
 "resenas_peliculas", "reportes_incidentes"].forEach(function (c) {
    db.getCollection(c).drop();
});


// Coleccion 1: fichas_tecnicas_peliculas
// Una ficha por pelicula.
db.createCollection("fichas_tecnicas_peliculas");

db.fichas_tecnicas_peliculas.createIndex(
    { id_pelicula: 1 },
    { unique: true, name: "ux_fichas_id_pelicula" }
);
db.fichas_tecnicas_peliculas.createIndex(
    { "elenco.id_persona": 1 },
    { name: "ix_fichas_elenco_persona" }
);

// Coleccion 2: requisitos_proyeccion
// Un documento por funcion. Los requisitos cambian segun el formato.
db.createCollection("requisitos_proyeccion");

db.requisitos_proyeccion.createIndex(
    { id_funcion: 1 },
    { unique: true, name: "ux_requisitos_id_funcion" }
);
db.requisitos_proyeccion.createIndex(
    { formato: 1 },
    { name: "ix_requisitos_formato" }
);

// Coleccion 3: resenas_peliculas (con $jsonSchema)
// El esquema es flexible, pero la calificacion, la pelicula, el
// espectador, el texto y la fecha son obligatorios y validos.
db.createCollection("resenas_peliculas", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            title: "Validacion de resenas de peliculas",
            required: ["id_pelicula", "id_espectador", "calificacion", "texto", "fecha"],
            properties: {
                id_pelicula: {
                    bsonType: "number", minimum: 1,
                    description: "Identificador de la pelicula en PostgreSQL (PELICULA)"
                },
                id_espectador: {
                    bsonType: "number", minimum: 1,
                    description: "Identificador del espectador en PostgreSQL (ESPECTADOR)"
                },
                id_venta: {
                    bsonType: "number", minimum: 1,
                    description: "Opcional: venta de PostgreSQL que verifica la compra"
                },
                calificacion: {
                    bsonType: "number", minimum: 1, maximum: 5, multipleOf: 1,
                    description: "Calificacion entera de 1 a 5"
                },
                titulo: { bsonType: "string", maxLength: 80 },
                texto: {
                    bsonType: "string", minLength: 10,
                    description: "Opinion del espectador, minimo 10 caracteres"
                },
                fecha: { bsonType: "date", description: "Fecha de la resena" },
                etiquetas: { bsonType: "array", items: { bsonType: "string" } },
                respuesta_empresa: {
                    bsonType: "object",
                    required: ["texto", "fecha", "id_staff"],
                    properties: {
                        texto: { bsonType: "string", minLength: 5 },
                        fecha: { bsonType: "date" },
                        id_staff: {
                            bsonType: "number", minimum: 1,
                            description: "Empleado que responde, en PostgreSQL (STAFF)"
                        }
                    }
                }
            }
        }
    },
    validationLevel: "strict",
    validationAction: "error"
});

db.resenas_peliculas.createIndex(
    { id_pelicula: 1, fecha: -1 },
    { name: "ix_resenas_pelicula_fecha" }
);
db.resenas_peliculas.createIndex(
    { id_espectador: 1 },
    { name: "ix_resenas_espectador" }
);

// Coleccion 4: reportes_incidentes (con $jsonSchema)
// Los campos comunes son obligatorios y el detalle exige campos
// distintos segun el tipo de incidente (oneOf).
db.createCollection("reportes_incidentes", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            title: "Validacion de reportes de incidentes",
            required: ["tipo", "fecha", "estado", "descripcion", "id_staff_reporta", "detalle"],
            properties: {
                tipo: {
                    enum: ["FALLA_TECNICA", "QUEJA_SERVICIO", "SEGURIDAD"],
                    description: "Tipo de incidente"
                },
                fecha: { bsonType: "date" },
                estado: {
                    enum: ["ABIERTO", "EN_PROCESO", "RESUELTO"],
                    description: "Estado del incidente"
                },
                descripcion: { bsonType: "string", minLength: 10 },
                id_funcion: { bsonType: "number", minimum: 1, description: "FUNCION en PostgreSQL" },
                id_sala: { bsonType: "number", minimum: 1, description: "SALA en PostgreSQL" },
                id_staff_reporta: { bsonType: "number", minimum: 1, description: "STAFF en PostgreSQL" },
                detalle: { bsonType: "object" },
                seguimiento: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["fecha", "accion", "id_staff"],
                        properties: {
                            fecha: { bsonType: "date" },
                            accion: { bsonType: "string" },
                            id_staff: { bsonType: "number", minimum: 1 }
                        }
                    }
                }
            },
            // El detalle obligatorio depende del tipo de incidente
            oneOf: [
                {
                    properties: {
                        tipo: { enum: ["FALLA_TECNICA"] },
                        detalle: { required: ["equipo", "minutos_retraso"] }
                    }
                },
                {
                    properties: {
                        tipo: { enum: ["QUEJA_SERVICIO"] },
                        detalle: {
                            required: ["id_espectador", "motivo"],
                            properties: { id_espectador: { bsonType: "number", minimum: 1 } }
                        }
                    }
                },
                {
                    properties: {
                        tipo: { enum: ["SEGURIDAD"] },
                        detalle: {
                            required: ["zona", "gravedad"],
                            properties: { gravedad: { enum: ["BAJA", "MEDIA", "ALTA"] } }
                        }
                    }
                }
            ]
        }
    },
    validationLevel: "strict",
    validationAction: "error"
});

db.reportes_incidentes.createIndex(
    { tipo: 1, fecha: -1 },
    { name: "ix_incidentes_tipo_fecha" }
);
db.reportes_incidentes.createIndex(
    { id_sala: 1 },
    { name: "ix_incidentes_sala" }
);
db.reportes_incidentes.createIndex(
    { id_funcion: 1 },
    { name: "ix_incidentes_funcion" }
);

// Verificacion colecciones creadas
db.getCollectionInfos({}, { nameOnly: false })
  .sort(function (a, b) { return a.name.localeCompare(b.name); })
  .map(function (c) {
      return {
          coleccion: c.name,
          jsonSchema: !!(c.options.validator && c.options.validator.$jsonSchema),
          indices: db.getCollection(c.name).getIndexes().map(function (i) { return i.name; })
      };
  });