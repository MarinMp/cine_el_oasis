// =====================================================================
// CINE EL OASIS
// Avance 2 - Capa documental (MongoDB)
// Script 03: 03_consultas.js
// Integrantes: Maria Paula Marin Soler, Justin Felipe Narvaez Gutierrez
// ---------------------------------------------------------------------
// Consultas de analisis sobre la capa documental.
// Se ejecuta DESPUES de 02_datos_prueba.js.
// Cada consulta se puede ejecutar por separado en mongosh.
// =====================================================================

db = db.getSiblingDB("el_oasis");


// ---------------------------------------------------------------------
// Consulta 1 (aggregation pipeline): Calificacion de cada pelicula
// Promedio, cantidad de resenas y porcentaje de compras verificadas,
// con el titulo tomado de la ficha tecnica ($lookup por id_pelicula).
// ---------------------------------------------------------------------
db.resenas_peliculas.aggregate([
    { $group: {
        _id: "$id_pelicula",
        resenas: { $sum: 1 },
        promedio: { $avg: "$calificacion" },
        verificadas: { $sum: { $cond: [{ $ifNull: ["$id_venta", false] }, 1, 0] } },
        negativas: { $sum: { $cond: [{ $lte: ["$calificacion", 2] }, 1, 0] } }
    } },
    { $lookup: {
        from: "fichas_tecnicas_peliculas",
        localField: "_id",
        foreignField: "id_pelicula",
        as: "ficha"
    } },
    { $project: {
        _id: 0,
        id_pelicula: "$_id",
        titulo: { $first: "$ficha.titulo" },
        resenas: 1,
        promedio: { $round: ["$promedio", 2] },
        pct_verificadas: { $round: [{ $multiply: [{ $divide: ["$verificadas", "$resenas"] }, 100] }, 0] },
        negativas: 1
    } },
    { $sort: { promedio: -1, resenas: -1 } }
]);


// ---------------------------------------------------------------------
// Consulta 2 (aggregation pipeline): Resumen de incidentes por tipo
// Total, cuantos siguen abiertos o en proceso, y para las fallas
// tecnicas el retraso promedio y las funciones reprogramadas.
// ---------------------------------------------------------------------
db.reportes_incidentes.aggregate([
    { $group: {
        _id: "$tipo",
        total: { $sum: 1 },
        pendientes: { $sum: { $cond: [{ $in: ["$estado", ["ABIERTO", "EN_PROCESO"]] }, 1, 0] } },
        resueltos: { $sum: { $cond: [{ $eq: ["$estado", "RESUELTO"] }, 1, 0] } },
        retraso_promedio_min: { $avg: "$detalle.minutos_retraso" },
        funciones_reprogramadas: { $sum: { $cond: ["$detalle.funcion_reprogramada", 1, 0] } },
        salas_afectadas: { $addToSet: "$id_sala" }
    } },
    { $project: {
        _id: 0,
        tipo: "$_id",
        total: 1,
        pendientes: 1,
        resueltos: 1,
        retraso_promedio_min: { $round: ["$retraso_promedio_min", 1] },
        funciones_reprogramadas: 1,
        salas_afectadas: { $size: { $filter: { input: "$salas_afectadas", cond: { $ne: ["$$this", null] } } } }
    } },
    { $sort: { total: -1, tipo: 1 } }
]);


// ---------------------------------------------------------------------
// Consulta 3 (find): Peliculas con version 3D subtitulada al espanol
// $elemMatch exige que la MISMA version cumpla ambas condiciones.
// ---------------------------------------------------------------------
db.fichas_tecnicas_peliculas.find(
    { versiones: { $elemMatch: { formato: "3D", subtitulos: "ESPANOL" } } },
    { _id: 0, id_pelicula: 1, titulo: 1, en_cartelera: 1, "versiones.formato": 1, "versiones.idioma_audio": 1 }
).sort({ id_pelicula: 1 });


// ---------------------------------------------------------------------
// Consulta 4 (find): Resenas negativas sin respuesta de la empresa
// Resenas de 1 o 2 estrellas que el cine aun no ha respondido.
// ---------------------------------------------------------------------
db.resenas_peliculas.find(
    { calificacion: { $lte: 2 }, respuesta_empresa: { $exists: false } },
    { _id: 0, id_pelicula: 1, id_espectador: 1, id_venta: 1, calificacion: 1, titulo: 1, texto: 1, fecha: 1 }
).sort({ fecha: 1 });


// ---------------------------------------------------------------------
// Consulta 5 (aggregation pipeline): Funciones especiales e incidentes
// Funciones 4D y VIP con sus requisitos y los incidentes que tuvieron
// ($lookup entre requisitos_proyeccion y reportes_incidentes).
// ---------------------------------------------------------------------
db.requisitos_proyeccion.aggregate([
    { $match: { formato: { $in: ["4D", "VIP"] } } },
    { $lookup: {
        from: "reportes_incidentes",
        localField: "id_funcion",
        foreignField: "id_funcion",
        as: "incidentes"
    } },
    { $lookup: {
        from: "fichas_tecnicas_peliculas",
        localField: "id_pelicula",
        foreignField: "id_pelicula",
        as: "ficha"
    } },
    { $project: {
        _id: 0,
        id_funcion: 1,
        id_sala: 1,
        formato: 1,
        pelicula: { $first: "$ficha.titulo" },
        sonido: "$requisitos.sonido",
        efectos: "$requisitos.efectos",
        personal_tecnico_requerido: 1,
        incidentes: { $size: "$incidentes" },
        tipos_incidente: "$incidentes.tipo"
    } },
    { $sort: { incidentes: -1, id_funcion: 1 } }
]);