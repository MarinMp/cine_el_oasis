// =====================================================================
// CINE EL OASIS
// Entrega final - Coleccion de la transaccion cruzada
// Script: comprobantes_venta.js
// ---------------------------------------------------------------------
// Cada compra registrada en PostgreSQL (VENTA y DETALLE_VENTA) guarda
// en la misma operacion su comprobante en esta coleccion.
// Se puede ejecutar varias veces: no borra los comprobantes existentes.
// Uso: mongosh "<cadena de conexion>" --file comprobantes_venta.js
// =====================================================================

db = db.getSiblingDB("el_oasis");

const validador = {
    $jsonSchema: {
        bsonType: "object",
        title: "Validacion de comprobantes de venta",
        required: ["id_venta", "id_espectador", "id_funcion", "boletas", "total", "fecha_compra", "estado"],
        properties: {
            id_venta: {
                bsonType: "number", minimum: 1,
                description: "Identificador de la venta en PostgreSQL (VENTA)"
            },
            id_espectador: {
                bsonType: "number", minimum: 1,
                description: "Identificador del espectador en PostgreSQL (ESPECTADOR)"
            },
            id_funcion: {
                bsonType: "number", minimum: 1,
                description: "Identificador de la funcion en PostgreSQL (FUNCION)"
            },
            boletas: {
                bsonType: "array", minItems: 1,
                items: {
                    bsonType: "object",
                    required: ["categoria", "cantidad", "precio_unitario"],
                    properties: {
                        cantidad: { bsonType: "number", minimum: 1, maximum: 10 },
                        precio_unitario: { bsonType: "number", minimum: 0 }
                    }
                }
            },
            total: { bsonType: "number", minimum: 0 },
            fecha_compra: { bsonType: "date" },
            estado: { enum: ["EMITIDO", "ANULADO"] }
        }
    }
};

if (db.getCollectionNames().includes("comprobantes_venta")) {
    db.runCommand({ collMod: "comprobantes_venta", validator: validador });
} else {
    db.createCollection("comprobantes_venta", { validator: validador });
}

// Un solo comprobante por venta
db.comprobantes_venta.createIndex(
    { id_venta: 1 },
    { unique: true, name: "ux_comprobantes_id_venta" }
);
db.comprobantes_venta.createIndex(
    { id_espectador: 1, fecha_compra: -1 },
    { name: "ix_comprobantes_espectador_fecha" }
);

print("Coleccion comprobantes_venta lista: " + db.comprobantes_venta.countDocuments() + " comprobantes.");
