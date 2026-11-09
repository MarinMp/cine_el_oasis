// =====================================================================
// CINE EL OASIS
// Avance 2 - Capa documental (MongoDB)
// Script 02: 02_datos_prueba.js
// Integrantes: Maria Paula Marin Soler, Justin Felipe Narvaez Gutierrez
// ---------------------------------------------------------------------
// Carga los datos de prueba de las 4 colecciones. Todos los
// identificadores (id_pelicula, id_funcion, id_sala, id_venta,
// id_espectador, id_staff, id_persona) existen en la base de PostgreSQL
// del avance 1 (scripts 01 -> 03 -> 02).
// Se ejecuta DESPUES de 01_creacion_colecciones.js.
// =====================================================================

db = db.getSiblingDB("el_oasis");

// Limpieza de las colecciones
db.fichas_tecnicas_peliculas.deleteMany({});
db.requisitos_proyeccion.deleteMany({});
db.resenas_peliculas.deleteMany({});
db.reportes_incidentes.deleteMany({});

// 1. Fichas tecnicas: Una por pelicula.
// En el elenco, id_persona apunta a ACTOR_DIRECTOR. Es null si la persona no esta registrada.
db.fichas_tecnicas_peliculas.insertMany([
  {
    id_pelicula: 1,
    titulo: "Dune",
    genero: "CIENCIA FICCION",
    en_cartelera: true,
    versiones: [
      { formato: "3D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 155 }
    ],
    clasificacion_por_pais: { CO: "MAYORES DE 12", US: "PG-13", MX: "B", ES: "12" },
    elenco: [
      { nombre: "Denis Villeneuve", rol: "DIRECTOR", id_persona: 1 },
      { nombre: "Timothee Chalamet", rol: "ACTOR", personaje: "Paul Atreides", id_persona: 2 },
      { nombre: "Zendaya Coleman", rol: "ACTOR", personaje: "Chani", id_persona: 3 },
      { nombre: "Rebecca Ferguson", rol: "ACTOR", personaje: "Lady Jessica", id_persona: 4 },
      { nombre: "Oscar Isaac", rol: "ACTOR", personaje: "Duque Leto Atreides", id_persona: 5 },
      { nombre: "Jason Momoa", rol: "ACTOR", personaje: "Duncan Idaho", id_persona: 6 }
    ],
    saga: { nombre: "Dune", entrega: 1 },
    premios: { oscar: 6 }
  },
  {
    id_pelicula: 2,
    titulo: "Dune: Parte Dos",
    genero: "CIENCIA FICCION",
    en_cartelera: true,
    versiones: [
      { formato: "3D", idioma_audio: "ESPANOL", subtitulos: [], duracion_min: 166 },
      { formato: "3D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 166 },
      { formato: "4D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 166 },
      { formato: "2D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 166 }
    ],
    clasificacion_por_pais: { CO: "MAYORES DE 12", US: "PG-13", MX: "B", ES: "12" },
    elenco: [
      { nombre: "Denis Villeneuve", rol: "DIRECTOR", id_persona: 1 },
      { nombre: "Timothee Chalamet", rol: "ACTOR", personaje: "Paul Atreides", id_persona: 2 },
      { nombre: "Zendaya Coleman", rol: "ACTOR", personaje: "Chani", id_persona: 3 },
      { nombre: "Rebecca Ferguson", rol: "ACTOR", personaje: "Lady Jessica", id_persona: 4 },
      { nombre: "Austin Butler", rol: "ACTOR", personaje: "Feyd-Rautha Harkonnen", id_persona: 7 },
      { nombre: "Florence Pugh", rol: "ACTOR", personaje: "Princesa Irulan", id_persona: 8 }
    ],
    saga: { nombre: "Dune", entrega: 2 },
    premios: { oscar: 2 }
  },
  {
    id_pelicula: 3,
    titulo: "Star Wars: El Despertar de la Fuerza",
    genero: "AVENTURA",
    en_cartelera: true,
    versiones: [
      { formato: "3D", idioma_audio: "ESPANOL", subtitulos: [], duracion_min: 138 },
      { formato: "3D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 138 }
    ],
    clasificacion_por_pais: { CO: "MAYORES DE 7", US: "PG", MX: "A", ES: "7" },
    elenco: [
      { nombre: "Jeffrey Abrams", rol: "DIRECTOR", id_persona: 9 },
      { nombre: "Daisy Ridley", rol: "ACTOR", personaje: "Rey", id_persona: 10 },
      { nombre: "John Boyega", rol: "ACTOR", personaje: "Finn", id_persona: 11 },
      { nombre: "Adam Driver", rol: "ACTOR", personaje: "Kylo Ren", id_persona: 12 },
      { nombre: "Harrison Ford", rol: "ACTOR", personaje: "Han Solo", id_persona: 13 },
      { nombre: "Oscar Isaac", rol: "ACTOR", personaje: "Poe Dameron", id_persona: 5 }
    ],
    saga: { nombre: "Star Wars", entrega: 7 }
  },
  {
    id_pelicula: 4,
    titulo: "Star Wars: Los Ultimos Jedi",
    genero: "CIENCIA FICCION",
    en_cartelera: true,
    versiones: [
      { formato: "3D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 152 }
    ],
    clasificacion_por_pais: { CO: "MAYORES DE 7", US: "PG", MX: "A", ES: "7" },
    elenco: [
      { nombre: "Rian Johnson", rol: "DIRECTOR", id_persona: 14 },
      { nombre: "Mark Hamill", rol: "ACTOR", personaje: "Luke Skywalker", id_persona: 15 },
      { nombre: "Daisy Ridley", rol: "ACTOR", personaje: "Rey", id_persona: 10 },
      { nombre: "Adam Driver", rol: "ACTOR", personaje: "Kylo Ren", id_persona: 12 },
      { nombre: "Carrie Fisher", rol: "ACTOR", personaje: "Leia Organa", id_persona: 16 },
      { nombre: "John Boyega", rol: "ACTOR", personaje: "Finn", id_persona: 11 }
    ],
    saga: { nombre: "Star Wars", entrega: 8 }
  },
  {
    id_pelicula: 5,
    titulo: "Coco",
    genero: "ANIMACION",
    en_cartelera: true,
    versiones: [
      { formato: "2D", idioma_audio: "ESPANOL", subtitulos: [], duracion_min: 105 }
    ],
    clasificacion_por_pais: { CO: "TODO PUBLICO", US: "G", MX: "AA", ES: "TP" },
    elenco: [
      { nombre: "Lee Unkrich", rol: "DIRECTOR", id_persona: 17 },
      { nombre: "Anthony Gonzalez", rol: "ACTOR", personaje: "Miguel", id_persona: 18 },
      { nombre: "Gael Garcia", rol: "ACTOR", personaje: "Hector", id_persona: 19 },
      { nombre: "Benjamin Bratt", rol: "ACTOR", personaje: "Ernesto de la Cruz", id_persona: 20 }
    ],
    premios: { oscar: 2 }
  },
  {
    id_pelicula: 6,
    titulo: "Oppenheimer",
    genero: "DRAMA",
    en_cartelera: true,
    versiones: [
      { formato: "2D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 180 }
    ],
    clasificacion_por_pais: { CO: "MAYORES DE 15", US: "R", MX: "B15", ES: "16" },
    elenco: [
      { nombre: "Christopher Nolan", rol: "DIRECTOR", id_persona: 21 },
      { nombre: "Cillian Murphy", rol: "ACTOR", personaje: "J. Robert Oppenheimer", id_persona: 22 },
      { nombre: "Emily Blunt", rol: "ACTOR", personaje: "Kitty Oppenheimer", id_persona: 23 },
      { nombre: "Robert Downey Jr.", rol: "ACTOR", personaje: "Lewis Strauss", id_persona: 24 },
      { nombre: "Matt Damon", rol: "ACTOR", personaje: "Leslie Groves", id_persona: 25 }
    ],
    premios: { oscar: 7 }
  },
  {
    id_pelicula: 7,
    titulo: "Interestelar",
    genero: "CIENCIA FICCION",
    en_cartelera: true,
    versiones: [
      { formato: "2D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 169 }
    ],
    clasificacion_por_pais: { CO: "MAYORES DE 12", US: "PG-13", MX: "B", ES: "12" },
    elenco: [
      { nombre: "Christopher Nolan", rol: "DIRECTOR", id_persona: 21 },
      { nombre: "Matthew McConaughey", rol: "ACTOR", personaje: "Cooper", id_persona: 26 },
      { nombre: "Anne Hathaway", rol: "ACTOR", personaje: "Amelia Brand", id_persona: 27 },
      { nombre: "Jessica Chastain", rol: "ACTOR", personaje: "Murph", id_persona: 28 }
    ],
    premios: { oscar: 1 }
  },
  {
    id_pelicula: 8,
    titulo: "IntensaMente 2",
    genero: "ANIMACION",
    en_cartelera: true,
    versiones: [
      { formato: "2D", idioma_audio: "ESPANOL", subtitulos: [], duracion_min: 96 }
    ],
    clasificacion_por_pais: { CO: "TODO PUBLICO", US: "G", MX: "AA", ES: "TP" },
    elenco: [
      { nombre: "Kelsey Mann", rol: "DIRECTOR", id_persona: 29 },
      { nombre: "Amy Poehler", rol: "ACTOR", personaje: "Alegria", id_persona: 30 }
    ],
    saga: { nombre: "IntensaMente", entrega: 2 }
  },
  {
    id_pelicula: 9,
    titulo: "Avatar: El Camino del Agua",
    genero: "AVENTURA",
    en_cartelera: true,
    versiones: [
      { formato: "4D", idioma_audio: "ESPANOL", subtitulos: [], duracion_min: 192 },
      { formato: "4D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 192 }
    ],
    clasificacion_por_pais: { CO: "MAYORES DE 12", US: "PG-13", MX: "B", ES: "12" },
    elenco: [
      { nombre: "James Cameron", rol: "DIRECTOR", id_persona: 31 },
      { nombre: "Sam Worthington", rol: "ACTOR", personaje: "Jake Sully", id_persona: 32 },
      { nombre: "Zoe Saldana", rol: "ACTOR", personaje: "Neytiri", id_persona: 33 },
      { nombre: "Sigourney Weaver", rol: "ACTOR", personaje: "Kiri", id_persona: 34 }
    ],
    saga: { nombre: "Avatar", entrega: 2 },
    premios: { oscar: 1 }
  },
  {
    id_pelicula: 10,
    titulo: "Barbie",
    genero: "COMEDIA",
    en_cartelera: true,
    versiones: [
      { formato: "2D", idioma_audio: "ESPANOL", subtitulos: [], duracion_min: 114 },
      { formato: "2D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 114 }
    ],
    clasificacion_por_pais: { CO: "MAYORES DE 12", US: "PG-13", MX: "B", ES: "12" },
    elenco: [
      { nombre: "Greta Gerwig", rol: "DIRECTOR", id_persona: 35 },
      { nombre: "Margot Robbie", rol: "ACTOR", personaje: "Barbie", id_persona: 36 },
      { nombre: "Ryan Gosling", rol: "ACTOR", personaje: "Ken", id_persona: 37 }
    ],
    premios: { oscar: 1 }
  },
  {
    id_pelicula: 11,
    titulo: "Avengers: Endgame",
    genero: "AVENTURA",
    en_cartelera: false,
    versiones: [
      { formato: "2D", idioma_audio: "ESPANOL", subtitulos: [], duracion_min: 181 },
      { formato: "2D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 181 },
      { formato: "3D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 181 }
    ],
    clasificacion_por_pais: { CO: "MAYORES DE 12", US: "PG-13", MX: "B", ES: "12" },
    elenco: [
      { nombre: "Anthony Russo", rol: "DIRECTOR", id_persona: null },
      { nombre: "Robert Downey Jr.", rol: "ACTOR", personaje: "Tony Stark", id_persona: 24 },
      { nombre: "Chris Evans", rol: "ACTOR", personaje: "Steve Rogers", id_persona: null }
    ],
    saga: { nombre: "Avengers", entrega: 4 }
  },
  {
    id_pelicula: 12,
    titulo: "Spider-Man: Sin Camino a Casa",
    genero: "AVENTURA",
    en_cartelera: false,
    versiones: [
      { formato: "2D", idioma_audio: "ESPANOL", subtitulos: [], duracion_min: 148 },
      { formato: "2D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 148 },
      { formato: "3D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 148 }
    ],
    clasificacion_por_pais: { CO: "MAYORES DE 12", US: "PG-13", MX: "B", ES: "12" },
    elenco: [
      { nombre: "Jon Watts", rol: "DIRECTOR", id_persona: null },
      { nombre: "Tom Holland", rol: "ACTOR", personaje: "Peter Parker", id_persona: null },
      { nombre: "Zendaya Coleman", rol: "ACTOR", personaje: "MJ", id_persona: 3 }
    ],
    saga: { nombre: "Spider-Man (MCU)", entrega: 3 }
  },
  {
    id_pelicula: 13,
    titulo: "Top Gun: Maverick",
    genero: "AVENTURA",
    en_cartelera: false,
    versiones: [
      { formato: "2D", idioma_audio: "ESPANOL", subtitulos: [], duracion_min: 130 },
      { formato: "2D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 130 },
      { formato: "3D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 130 }
    ],
    clasificacion_por_pais: { CO: "MAYORES DE 12", US: "PG-13", MX: "B", ES: "12" },
    elenco: [
      { nombre: "Joseph Kosinski", rol: "DIRECTOR", id_persona: null },
      { nombre: "Tom Cruise", rol: "ACTOR", personaje: "Pete Mitchell", id_persona: null },
      { nombre: "Miles Teller", rol: "ACTOR", personaje: "Bradley Bradshaw", id_persona: null }
    ],
    saga: { nombre: "Top Gun", entrega: 2 },
    premios: { oscar: 1 }
  },
  {
    id_pelicula: 14,
    titulo: "Jurassic World: Dominio",
    genero: "AVENTURA",
    en_cartelera: false,
    versiones: [
      { formato: "2D", idioma_audio: "ESPANOL", subtitulos: [], duracion_min: 147 },
      { formato: "2D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 147 },
      { formato: "3D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 147 }
    ],
    clasificacion_por_pais: { CO: "MAYORES DE 12", US: "PG-13", MX: "B", ES: "12" },
    elenco: [
      { nombre: "Colin Trevorrow", rol: "DIRECTOR", id_persona: null },
      { nombre: "Chris Pratt", rol: "ACTOR", personaje: "Owen Grady", id_persona: null },
      { nombre: "Bryce Dallas Howard", rol: "ACTOR", personaje: "Claire Dearing", id_persona: null }
    ],
    saga: { nombre: "Jurassic World", entrega: 3 }
  },
  {
    id_pelicula: 15,
    titulo: "Toy Story 4",
    genero: "ANIMACION",
    en_cartelera: false,
    versiones: [
      { formato: "2D", idioma_audio: "ESPANOL", subtitulos: [], duracion_min: 100 },
      { formato: "2D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 100 }
    ],
    clasificacion_por_pais: { CO: "TODO PUBLICO", US: "G", MX: "AA", ES: "TP" },
    elenco: [
      { nombre: "Josh Cooley", rol: "DIRECTOR", id_persona: null },
      { nombre: "Tom Hanks", rol: "ACTOR", personaje: "Woody (voz)", id_persona: null },
      { nombre: "Tim Allen", rol: "ACTOR", personaje: "Buzz Lightyear (voz)", id_persona: null }
    ],
    saga: { nombre: "Toy Story", entrega: 4 },
    premios: { oscar: 1 }
  },
  {
    id_pelicula: 16,
    titulo: "Frozen II",
    genero: "ANIMACION",
    en_cartelera: false,
    versiones: [
      { formato: "2D", idioma_audio: "ESPANOL", subtitulos: [], duracion_min: 103 },
      { formato: "2D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 103 }
    ],
    clasificacion_por_pais: { CO: "TODO PUBLICO", US: "G", MX: "AA", ES: "TP" },
    elenco: [
      { nombre: "Chris Buck", rol: "DIRECTOR", id_persona: null },
      { nombre: "Idina Menzel", rol: "ACTOR", personaje: "Elsa (voz)", id_persona: null },
      { nombre: "Kristen Bell", rol: "ACTOR", personaje: "Anna (voz)", id_persona: null }
    ],
    saga: { nombre: "Frozen", entrega: 2 }
  },
  {
    id_pelicula: 17,
    titulo: "El Rey Leon",
    genero: "ANIMACION",
    en_cartelera: false,
    versiones: [
      { formato: "2D", idioma_audio: "ESPANOL", subtitulos: [], duracion_min: 118 },
      { formato: "2D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 118 }
    ],
    clasificacion_por_pais: { CO: "TODO PUBLICO", US: "G", MX: "AA", ES: "TP" },
    elenco: [
      { nombre: "Jon Favreau", rol: "DIRECTOR", id_persona: null },
      { nombre: "Donald Glover", rol: "ACTOR", personaje: "Simba (voz)", id_persona: null },
      { nombre: "Beyonce Knowles", rol: "ACTOR", personaje: "Nala (voz)", id_persona: null }
    ]
  },
  {
    id_pelicula: 18,
    titulo: "Mision Imposible: Sentencia Mortal",
    genero: "AVENTURA",
    en_cartelera: false,
    versiones: [
      { formato: "2D", idioma_audio: "ESPANOL", subtitulos: [], duracion_min: 163 },
      { formato: "2D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 163 },
      { formato: "3D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 163 }
    ],
    clasificacion_por_pais: { CO: "MAYORES DE 12", US: "PG-13", MX: "B", ES: "12" },
    elenco: [
      { nombre: "Christopher McQuarrie", rol: "DIRECTOR", id_persona: null },
      { nombre: "Tom Cruise", rol: "ACTOR", personaje: "Ethan Hunt", id_persona: null },
      { nombre: "Rebecca Ferguson", rol: "ACTOR", personaje: "Ilsa Faust", id_persona: 4 }
    ],
    saga: { nombre: "Mision Imposible", entrega: 7 }
  },
  {
    id_pelicula: 19,
    titulo: "Guardianes de la Galaxia Vol. 3",
    genero: "CIENCIA FICCION",
    en_cartelera: false,
    versiones: [
      { formato: "2D", idioma_audio: "ESPANOL", subtitulos: [], duracion_min: 150 },
      { formato: "2D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 150 },
      { formato: "3D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 150 }
    ],
    clasificacion_por_pais: { CO: "MAYORES DE 12", US: "PG-13", MX: "B", ES: "12" },
    elenco: [
      { nombre: "James Gunn", rol: "DIRECTOR", id_persona: null },
      { nombre: "Chris Pratt", rol: "ACTOR", personaje: "Peter Quill", id_persona: null },
      { nombre: "Zoe Saldana", rol: "ACTOR", personaje: "Gamora", id_persona: 33 }
    ],
    saga: { nombre: "Guardianes de la Galaxia", entrega: 3 }
  },
  {
    id_pelicula: 20,
    titulo: "Wonka",
    genero: "COMEDIA",
    en_cartelera: false,
    versiones: [
      { formato: "2D", idioma_audio: "ESPANOL", subtitulos: [], duracion_min: 116 },
      { formato: "2D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 116 }
    ],
    clasificacion_por_pais: { CO: "TODO PUBLICO", US: "G", MX: "AA", ES: "TP" },
    elenco: [
      { nombre: "Paul King", rol: "DIRECTOR", id_persona: null },
      { nombre: "Timothee Chalamet", rol: "ACTOR", personaje: "Willy Wonka", id_persona: 2 },
      { nombre: "Hugh Grant", rol: "ACTOR", personaje: "Oompa Loompa", id_persona: null }
    ]
  },
  {
    id_pelicula: 21,
    titulo: "Super Mario Bros: La Pelicula",
    genero: "ANIMACION",
    en_cartelera: false,
    versiones: [
      { formato: "2D", idioma_audio: "ESPANOL", subtitulos: [], duracion_min: 92 },
      { formato: "2D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 92 }
    ],
    clasificacion_por_pais: { CO: "TODO PUBLICO", US: "G", MX: "AA", ES: "TP" },
    elenco: [
      { nombre: "Aaron Horvath", rol: "DIRECTOR", id_persona: null },
      { nombre: "Chris Pratt", rol: "ACTOR", personaje: "Mario (voz)", id_persona: null },
      { nombre: "Anya Taylor-Joy", rol: "ACTOR", personaje: "Peach (voz)", id_persona: null }
    ]
  },
  {
    id_pelicula: 22,
    titulo: "Joker",
    genero: "DRAMA",
    en_cartelera: false,
    versiones: [
      { formato: "2D", idioma_audio: "ESPANOL", subtitulos: [], duracion_min: 122 },
      { formato: "2D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 122 }
    ],
    clasificacion_por_pais: { CO: "MAYORES DE 15", US: "R", MX: "B15", ES: "16" },
    elenco: [
      { nombre: "Todd Phillips", rol: "DIRECTOR", id_persona: null },
      { nombre: "Joaquin Phoenix", rol: "ACTOR", personaje: "Arthur Fleck", id_persona: null }
    ],
    premios: { oscar: 2 }
  },
  {
    id_pelicula: 23,
    titulo: "Tenet",
    genero: "CIENCIA FICCION",
    en_cartelera: false,
    versiones: [
      { formato: "2D", idioma_audio: "ESPANOL", subtitulos: [], duracion_min: 150 },
      { formato: "2D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 150 },
      { formato: "3D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 150 }
    ],
    clasificacion_por_pais: { CO: "MAYORES DE 12", US: "PG-13", MX: "B", ES: "12" },
    elenco: [
      { nombre: "Christopher Nolan", rol: "DIRECTOR", id_persona: 21 },
      { nombre: "John David Washington", rol: "ACTOR", personaje: "El Protagonista", id_persona: null },
      { nombre: "Robert Pattinson", rol: "ACTOR", personaje: "Neil", id_persona: null }
    ]
  },
  {
    id_pelicula: 24,
    titulo: "La La Land",
    genero: "DRAMA",
    en_cartelera: false,
    versiones: [
      { formato: "2D", idioma_audio: "ESPANOL", subtitulos: [], duracion_min: 128 },
      { formato: "2D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 128 }
    ],
    clasificacion_por_pais: { CO: "MAYORES DE 7", US: "PG", MX: "A", ES: "7" },
    elenco: [
      { nombre: "Damien Chazelle", rol: "DIRECTOR", id_persona: null },
      { nombre: "Ryan Gosling", rol: "ACTOR", personaje: "Sebastian", id_persona: 37 },
      { nombre: "Emma Stone", rol: "ACTOR", personaje: "Mia", id_persona: null }
    ],
    premios: { oscar: 6 }
  },
  {
    id_pelicula: 25,
    titulo: "Los Increibles 2",
    genero: "ANIMACION",
    en_cartelera: false,
    versiones: [
      { formato: "2D", idioma_audio: "ESPANOL", subtitulos: [], duracion_min: 118 },
      { formato: "2D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 118 }
    ],
    clasificacion_por_pais: { CO: "TODO PUBLICO", US: "G", MX: "AA", ES: "TP" },
    elenco: [
      { nombre: "Brad Bird", rol: "DIRECTOR", id_persona: null },
      { nombre: "Craig T. Nelson", rol: "ACTOR", personaje: "Bob Parr (voz)", id_persona: null },
      { nombre: "Holly Hunter", rol: "ACTOR", personaje: "Helen Parr (voz)", id_persona: null }
    ],
    saga: { nombre: "Los Increibles", entrega: 2 }
  },
  {
    id_pelicula: 26,
    titulo: "Encanto",
    genero: "ANIMACION",
    en_cartelera: false,
    versiones: [
      { formato: "2D", idioma_audio: "ESPANOL", subtitulos: [], duracion_min: 102 },
      { formato: "2D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 102 }
    ],
    clasificacion_por_pais: { CO: "TODO PUBLICO", US: "G", MX: "AA", ES: "TP" },
    elenco: [
      { nombre: "Byron Howard", rol: "DIRECTOR", id_persona: null },
      { nombre: "Stephanie Beatriz", rol: "ACTOR", personaje: "Mirabel (voz)", id_persona: null },
      { nombre: "John Leguizamo", rol: "ACTOR", personaje: "Bruno (voz)", id_persona: null }
    ],
    premios: { oscar: 1 }
  },
  {
    id_pelicula: 27,
    titulo: "Gravedad",
    genero: "CIENCIA FICCION",
    en_cartelera: false,
    versiones: [
      { formato: "2D", idioma_audio: "ESPANOL", subtitulos: [], duracion_min: 91 },
      { formato: "2D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 91 },
      { formato: "3D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 91 }
    ],
    clasificacion_por_pais: { CO: "MAYORES DE 12", US: "PG-13", MX: "B", ES: "12" },
    elenco: [
      { nombre: "Alfonso Cuaron", rol: "DIRECTOR", id_persona: null },
      { nombre: "Sandra Bullock", rol: "ACTOR", personaje: "Ryan Stone", id_persona: null },
      { nombre: "George Clooney", rol: "ACTOR", personaje: "Matt Kowalski", id_persona: null }
    ],
    premios: { oscar: 7 }
  },
  {
    id_pelicula: 28,
    titulo: "Moana 2",
    genero: "ANIMACION",
    en_cartelera: false,
    versiones: [
      { formato: "2D", idioma_audio: "ESPANOL", subtitulos: [], duracion_min: 100 },
      { formato: "2D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 100 }
    ],
    clasificacion_por_pais: { CO: "TODO PUBLICO", US: "G", MX: "AA", ES: "TP" },
    elenco: [
      { nombre: "David Derrick Jr.", rol: "DIRECTOR", id_persona: null },
      { nombre: "Aulii Cravalho", rol: "ACTOR", personaje: "Moana (voz)", id_persona: null },
      { nombre: "Dwayne Johnson", rol: "ACTOR", personaje: "Maui (voz)", id_persona: null }
    ],
    saga: { nombre: "Moana", entrega: 2 }
  },
  {
    id_pelicula: 29,
    titulo: "Wicked",
    genero: "DRAMA",
    en_cartelera: false,
    versiones: [
      { formato: "2D", idioma_audio: "ESPANOL", subtitulos: [], duracion_min: 160 },
      { formato: "2D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 160 }
    ],
    clasificacion_por_pais: { CO: "MAYORES DE 7", US: "PG", MX: "A", ES: "7" },
    elenco: [
      { nombre: "Jon M. Chu", rol: "DIRECTOR", id_persona: null },
      { nombre: "Cynthia Erivo", rol: "ACTOR", personaje: "Elphaba", id_persona: null },
      { nombre: "Ariana Grande", rol: "ACTOR", personaje: "Glinda", id_persona: null }
    ]
  },
  {
    id_pelicula: 30,
    titulo: "Mision Imposible: Sentencia Final",
    genero: "AVENTURA",
    en_cartelera: false,
    versiones: [
      { formato: "2D", idioma_audio: "ESPANOL", subtitulos: [], duracion_min: 169 },
      { formato: "2D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 169 },
      { formato: "3D", idioma_audio: "INGLES", subtitulos: ["ESPANOL"], duracion_min: 169 }
    ],
    clasificacion_por_pais: { CO: "MAYORES DE 12", US: "PG-13", MX: "B", ES: "12" },
    elenco: [
      { nombre: "Christopher McQuarrie", rol: "DIRECTOR", id_persona: null },
      { nombre: "Tom Cruise", rol: "ACTOR", personaje: "Ethan Hunt", id_persona: null },
      { nombre: "Hayley Atwell", rol: "ACTOR", personaje: "Grace", id_persona: null }
    ],
    saga: { nombre: "Mision Imposible", entrega: 8 }
  }
]);

// 2. Requisitos de proyeccion: Uno por funcion. Los requisitos cambian segun el formato.
db.requisitos_proyeccion.insertMany([
  {
    id_funcion: 1,
    id_sala: 1,
    id_pelicula: 5,
    formato: "2D",
    version: "DOBLADA AL ESPANOL",
    requisitos: { proyector: "Laser 4K", sonido: "Dolby 7.1" },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 1 }
    ]
  },
  {
    id_funcion: 2,
    id_sala: 1,
    id_pelicula: 10,
    formato: "2D",
    version: "ORIGINAL SUBTITULADA",
    requisitos: { proyector: "Laser 4K", sonido: "Dolby 7.1" },
    subtitulado: { idioma: "ESPANOL", revisado: true },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 1 }
    ]
  },
  {
    id_funcion: 3,
    id_sala: 4,
    id_pelicula: 1,
    formato: "3D",
    version: "ORIGINAL SUBTITULADA",
    requisitos: { proyector: "Laser 4K 3D", sonido: "Dolby Atmos", gafas_3d: { tipo: "pasivas", unidades: 230 } },
    subtitulado: { idioma: "ESPANOL", revisado: true },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 2 }
    ]
  },
  {
    id_funcion: 4,
    id_sala: 4,
    id_pelicula: 2,
    formato: "3D",
    version: "ORIGINAL SUBTITULADA",
    requisitos: {
      proyector: "Laser 4K 3D",
      sonido: "Dolby Atmos",
      gafas_3d: { tipo: "pasivas", unidades: 230 },
      pausa_tecnica_min: 0,
      revision_previa_min: 30
    },
    subtitulado: { idioma: "ESPANOL", revisado: true },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 2 }
    ]
  },
  {
    id_funcion: 5,
    id_sala: 7,
    id_pelicula: 6,
    formato: "VIP",
    version: "ORIGINAL SUBTITULADA",
    requisitos: {
      proyector: "Laser 4K",
      sonido: "Dolby Atmos",
      butacas_reclinables: true,
      servicio_a_la_silla: true,
      menu: "Carta VIP",
      pausa_tecnica_min: 0,
      revision_previa_min: 30
    },
    subtitulado: { idioma: "ESPANOL", revisado: true },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 2 }
    ]
  },
  {
    id_funcion: 6,
    id_sala: 9,
    id_pelicula: 9,
    formato: "4D",
    version: "DOBLADA AL ESPANOL",
    requisitos: {
      proyector: "Laser 4K",
      sonido: "Dolby Atmos",
      efectos: ["movimiento de butacas", "agua", "viento"],
      advertencia_salud: true,
      estatura_minima_cm: 100,
      pausa_tecnica_min: 0,
      revision_previa_min: 30
    },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 2 },
      { cargo: "ACOMODADOR", cantidad: 1 }
    ]
  },
  {
    id_funcion: 7,
    id_sala: 2,
    id_pelicula: 8,
    formato: "2D",
    version: "DOBLADA AL ESPANOL",
    requisitos: { proyector: "Laser 4K", sonido: "Dolby 7.1" },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 1 }
    ]
  },
  {
    id_funcion: 8,
    id_sala: 2,
    id_pelicula: 7,
    formato: "2D",
    version: "ORIGINAL SUBTITULADA",
    requisitos: { proyector: "Laser 4K", sonido: "Dolby 7.1", pausa_tecnica_min: 0, revision_previa_min: 30 },
    subtitulado: { idioma: "ESPANOL", revisado: true },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 1 }
    ]
  },
  {
    id_funcion: 9,
    id_sala: 5,
    id_pelicula: 3,
    formato: "3D",
    version: "DOBLADA AL ESPANOL",
    requisitos: { proyector: "Laser 4K 3D", sonido: "Dolby Atmos", gafas_3d: { tipo: "pasivas", unidades: 230 } },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 2 }
    ]
  },
  {
    id_funcion: 10,
    id_sala: 5,
    id_pelicula: 4,
    formato: "3D",
    version: "ORIGINAL SUBTITULADA",
    requisitos: { proyector: "Laser 4K 3D", sonido: "Dolby Atmos", gafas_3d: { tipo: "pasivas", unidades: 230 } },
    subtitulado: { idioma: "ESPANOL", revisado: true },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 2 }
    ]
  },
  {
    id_funcion: 11,
    id_sala: 8,
    id_pelicula: 2,
    formato: "VIP",
    version: "ORIGINAL SUBTITULADA",
    requisitos: {
      proyector: "Laser 4K",
      sonido: "Dolby Atmos",
      butacas_reclinables: true,
      servicio_a_la_silla: true,
      menu: "Carta VIP",
      pausa_tecnica_min: 0,
      revision_previa_min: 30
    },
    subtitulado: { idioma: "ESPANOL", revisado: true },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 2 }
    ]
  },
  {
    id_funcion: 12,
    id_sala: 10,
    id_pelicula: 9,
    formato: "4D",
    version: "ORIGINAL SUBTITULADA",
    requisitos: {
      proyector: "Laser 4K",
      sonido: "Dolby Atmos",
      efectos: ["movimiento de butacas", "agua", "viento"],
      advertencia_salud: true,
      estatura_minima_cm: 100,
      pausa_tecnica_min: 0,
      revision_previa_min: 30
    },
    subtitulado: { idioma: "ESPANOL", revisado: true },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 2 },
      { cargo: "ACOMODADOR", cantidad: 1 }
    ]
  },
  {
    id_funcion: 13,
    id_sala: 1,
    id_pelicula: 5,
    formato: "2D",
    version: "DOBLADA AL ESPANOL",
    requisitos: { proyector: "Laser 4K", sonido: "Dolby 7.1" },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 1 }
    ]
  },
  {
    id_funcion: 14,
    id_sala: 1,
    id_pelicula: 8,
    formato: "2D",
    version: "DOBLADA AL ESPANOL",
    requisitos: { proyector: "Laser 4K", sonido: "Dolby 7.1" },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 1 }
    ]
  },
  {
    id_funcion: 15,
    id_sala: 3,
    id_pelicula: 6,
    formato: "2D",
    version: "ORIGINAL SUBTITULADA",
    requisitos: { proyector: "Laser 4K", sonido: "Dolby 7.1", pausa_tecnica_min: 0, revision_previa_min: 30 },
    subtitulado: { idioma: "ESPANOL", revisado: true },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 1 }
    ]
  },
  {
    id_funcion: 16,
    id_sala: 4,
    id_pelicula: 2,
    formato: "3D",
    version: "ORIGINAL SUBTITULADA",
    requisitos: {
      proyector: "Laser 4K 3D",
      sonido: "Dolby Atmos",
      gafas_3d: { tipo: "pasivas", unidades: 230 },
      pausa_tecnica_min: 0,
      revision_previa_min: 30
    },
    subtitulado: { idioma: "ESPANOL", revisado: true },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 2 }
    ]
  },
  {
    id_funcion: 17,
    id_sala: 6,
    id_pelicula: 3,
    formato: "3D",
    version: "ORIGINAL SUBTITULADA",
    requisitos: { proyector: "Laser 4K 3D", sonido: "Dolby Atmos", gafas_3d: { tipo: "pasivas", unidades: 230 } },
    subtitulado: { idioma: "ESPANOL", revisado: true },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 2 }
    ]
  },
  {
    id_funcion: 18,
    id_sala: 7,
    id_pelicula: 7,
    formato: "VIP",
    version: "ORIGINAL SUBTITULADA",
    requisitos: {
      proyector: "Laser 4K",
      sonido: "Dolby Atmos",
      butacas_reclinables: true,
      servicio_a_la_silla: true,
      menu: "Carta VIP",
      pausa_tecnica_min: 0,
      revision_previa_min: 30
    },
    subtitulado: { idioma: "ESPANOL", revisado: true },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 2 }
    ]
  },
  {
    id_funcion: 19,
    id_sala: 9,
    id_pelicula: 9,
    formato: "4D",
    version: "DOBLADA AL ESPANOL",
    requisitos: {
      proyector: "Laser 4K",
      sonido: "Dolby Atmos",
      efectos: ["movimiento de butacas", "agua", "viento"],
      advertencia_salud: true,
      estatura_minima_cm: 100,
      pausa_tecnica_min: 0,
      revision_previa_min: 30
    },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 2 },
      { cargo: "ACOMODADOR", cantidad: 1 }
    ]
  },
  {
    id_funcion: 20,
    id_sala: 10,
    id_pelicula: 2,
    formato: "4D",
    version: "ORIGINAL SUBTITULADA",
    requisitos: {
      proyector: "Laser 4K",
      sonido: "Dolby Atmos",
      efectos: ["movimiento de butacas", "viento", "vibracion"],
      advertencia_salud: true,
      estatura_minima_cm: 100,
      pausa_tecnica_min: 0,
      revision_previa_min: 30
    },
    subtitulado: { idioma: "ESPANOL", revisado: true },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 2 },
      { cargo: "ACOMODADOR", cantidad: 1 }
    ]
  },
  {
    id_funcion: 21,
    id_sala: 2,
    id_pelicula: 10,
    formato: "2D",
    version: "DOBLADA AL ESPANOL",
    requisitos: { proyector: "Laser 4K", sonido: "Dolby 7.1" },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 1 }
    ]
  },
  {
    id_funcion: 22,
    id_sala: 3,
    id_pelicula: 6,
    formato: "2D",
    version: "ORIGINAL SUBTITULADA",
    requisitos: { proyector: "Laser 4K", sonido: "Dolby 7.1", pausa_tecnica_min: 0, revision_previa_min: 30 },
    subtitulado: { idioma: "ESPANOL", revisado: true },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 1 }
    ]
  },
  {
    id_funcion: 23,
    id_sala: 5,
    id_pelicula: 1,
    formato: "3D",
    version: "ORIGINAL SUBTITULADA",
    requisitos: { proyector: "Laser 4K 3D", sonido: "Dolby Atmos", gafas_3d: { tipo: "pasivas", unidades: 230 } },
    subtitulado: { idioma: "ESPANOL", revisado: true },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 2 }
    ]
  },
  {
    id_funcion: 24,
    id_sala: 6,
    id_pelicula: 4,
    formato: "3D",
    version: "ORIGINAL SUBTITULADA",
    requisitos: { proyector: "Laser 4K 3D", sonido: "Dolby Atmos", gafas_3d: { tipo: "pasivas", unidades: 230 } },
    subtitulado: { idioma: "ESPANOL", revisado: true },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 2 }
    ]
  },
  {
    id_funcion: 25,
    id_sala: 8,
    id_pelicula: 7,
    formato: "VIP",
    version: "ORIGINAL SUBTITULADA",
    requisitos: {
      proyector: "Laser 4K",
      sonido: "Dolby Atmos",
      butacas_reclinables: true,
      servicio_a_la_silla: true,
      menu: "Carta VIP",
      pausa_tecnica_min: 0,
      revision_previa_min: 30
    },
    subtitulado: { idioma: "ESPANOL", revisado: true },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 2 }
    ]
  },
  {
    id_funcion: 26,
    id_sala: 1,
    id_pelicula: 5,
    formato: "2D",
    version: "DOBLADA AL ESPANOL",
    requisitos: { proyector: "Laser 4K", sonido: "Dolby 7.1" },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 1 }
    ]
  },
  {
    id_funcion: 27,
    id_sala: 1,
    id_pelicula: 8,
    formato: "2D",
    version: "DOBLADA AL ESPANOL",
    requisitos: { proyector: "Laser 4K", sonido: "Dolby 7.1" },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 1 }
    ]
  },
  {
    id_funcion: 28,
    id_sala: 4,
    id_pelicula: 2,
    formato: "3D",
    version: "ORIGINAL SUBTITULADA",
    requisitos: {
      proyector: "Laser 4K 3D",
      sonido: "Dolby Atmos",
      gafas_3d: { tipo: "pasivas", unidades: 230 },
      pausa_tecnica_min: 0,
      revision_previa_min: 30
    },
    subtitulado: { idioma: "ESPANOL", revisado: true },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 2 }
    ]
  },
  {
    id_funcion: 29,
    id_sala: 4,
    id_pelicula: 2,
    formato: "3D",
    version: "DOBLADA AL ESPANOL",
    requisitos: {
      proyector: "Laser 4K 3D",
      sonido: "Dolby Atmos",
      gafas_3d: { tipo: "pasivas", unidades: 230 },
      pausa_tecnica_min: 0,
      revision_previa_min: 30
    },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 2 }
    ]
  },
  {
    id_funcion: 30,
    id_sala: 7,
    id_pelicula: 6,
    formato: "VIP",
    version: "ORIGINAL SUBTITULADA",
    requisitos: {
      proyector: "Laser 4K",
      sonido: "Dolby Atmos",
      butacas_reclinables: true,
      servicio_a_la_silla: true,
      menu: "Carta VIP",
      pausa_tecnica_min: 0,
      revision_previa_min: 30
    },
    subtitulado: { idioma: "ESPANOL", revisado: true },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 2 }
    ]
  },
  {
    id_funcion: 31,
    id_sala: 9,
    id_pelicula: 9,
    formato: "4D",
    version: "DOBLADA AL ESPANOL",
    requisitos: {
      proyector: "Laser 4K",
      sonido: "Dolby Atmos",
      efectos: ["movimiento de butacas", "agua", "viento"],
      advertencia_salud: true,
      estatura_minima_cm: 100,
      pausa_tecnica_min: 0,
      revision_previa_min: 30
    },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 2 },
      { cargo: "ACOMODADOR", cantidad: 1 }
    ]
  },
  {
    id_funcion: 32,
    id_sala: 10,
    id_pelicula: 2,
    formato: "4D",
    version: "ORIGINAL SUBTITULADA",
    requisitos: {
      proyector: "Laser 4K",
      sonido: "Dolby Atmos",
      efectos: ["movimiento de butacas", "viento", "vibracion"],
      advertencia_salud: true,
      estatura_minima_cm: 100,
      pausa_tecnica_min: 0,
      revision_previa_min: 30
    },
    subtitulado: { idioma: "ESPANOL", revisado: true },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 2 },
      { cargo: "ACOMODADOR", cantidad: 1 }
    ]
  },
  {
    id_funcion: 33,
    id_sala: 2,
    id_pelicula: 5,
    formato: "2D",
    version: "DOBLADA AL ESPANOL",
    requisitos: { proyector: "Laser 4K", sonido: "Dolby 7.1" },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 1 }
    ]
  },
  {
    id_funcion: 34,
    id_sala: 5,
    id_pelicula: 3,
    formato: "3D",
    version: "DOBLADA AL ESPANOL",
    requisitos: { proyector: "Laser 4K 3D", sonido: "Dolby Atmos", gafas_3d: { tipo: "pasivas", unidades: 230 } },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 2 }
    ]
  },
  {
    id_funcion: 35,
    id_sala: 6,
    id_pelicula: 2,
    formato: "3D",
    version: "ORIGINAL SUBTITULADA",
    requisitos: {
      proyector: "Laser 4K 3D",
      sonido: "Dolby Atmos",
      gafas_3d: { tipo: "pasivas", unidades: 230 },
      pausa_tecnica_min: 0,
      revision_previa_min: 30
    },
    subtitulado: { idioma: "ESPANOL", revisado: true },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 2 }
    ]
  },
  {
    id_funcion: 36,
    id_sala: 8,
    id_pelicula: 6,
    formato: "VIP",
    version: "ORIGINAL SUBTITULADA",
    requisitos: {
      proyector: "Laser 4K",
      sonido: "Dolby Atmos",
      butacas_reclinables: true,
      servicio_a_la_silla: true,
      menu: "Carta VIP",
      pausa_tecnica_min: 0,
      revision_previa_min: 30
    },
    subtitulado: { idioma: "ESPANOL", revisado: true },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 2 }
    ]
  },
  {
    id_funcion: 37,
    id_sala: 10,
    id_pelicula: 9,
    formato: "4D",
    version: "ORIGINAL SUBTITULADA",
    requisitos: {
      proyector: "Laser 4K",
      sonido: "Dolby Atmos",
      efectos: ["movimiento de butacas", "agua", "viento"],
      advertencia_salud: true,
      estatura_minima_cm: 100,
      pausa_tecnica_min: 0,
      revision_previa_min: 30
    },
    subtitulado: { idioma: "ESPANOL", revisado: true },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 2 },
      { cargo: "ACOMODADOR", cantidad: 1 }
    ]
  },
  {
    id_funcion: 38,
    id_sala: 1,
    id_pelicula: 5,
    formato: "2D",
    version: "DOBLADA AL ESPANOL",
    requisitos: { proyector: "Laser 4K", sonido: "Dolby 7.1" },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 1 }
    ]
  },
  {
    id_funcion: 39,
    id_sala: 4,
    id_pelicula: 2,
    formato: "3D",
    version: "ORIGINAL SUBTITULADA",
    requisitos: {
      proyector: "Laser 4K 3D",
      sonido: "Dolby Atmos",
      gafas_3d: { tipo: "pasivas", unidades: 230 },
      pausa_tecnica_min: 0,
      revision_previa_min: 30
    },
    subtitulado: { idioma: "ESPANOL", revisado: true },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 2 }
    ]
  },
  {
    id_funcion: 40,
    id_sala: 7,
    id_pelicula: 7,
    formato: "VIP",
    version: "ORIGINAL SUBTITULADA",
    requisitos: {
      proyector: "Laser 4K",
      sonido: "Dolby Atmos",
      butacas_reclinables: true,
      servicio_a_la_silla: true,
      menu: "Carta VIP",
      pausa_tecnica_min: 0,
      revision_previa_min: 30
    },
    subtitulado: { idioma: "ESPANOL", revisado: true },
    personal_tecnico_requerido: [
      { cargo: "PROYECCIONISTA", cantidad: 1 },
      { cargo: "ACOMODADOR", cantidad: 2 }
    ]
  }
]);

// 3. Resenas: id_venta indica compra verificada (la venta es de ese espectador y esa pelicula).
// Las resenas de peliculas del catalogo no tienen venta asociada.
db.resenas_peliculas.insertMany([
  {
    id_pelicula: 5,
    id_espectador: 13,
    id_venta: 13,
    calificacion: 5,
    titulo: "Para ver en familia",
    texto: "La musica y los colores son increibles. Fuimos el miercoles con el descuento y valio la pena.",
    fecha: ISODate("2026-10-14T20:15:00-05:00"),
    etiquetas: ["familiar", "musica"],
    respuesta_empresa: {
      texto: "Gracias por acompanarnos, Ricardo. Te esperamos en la proxima funcion.",
      fecha: ISODate("2026-10-15T10:15:00-05:00"),
      id_staff: 1
    }
  },
  {
    id_pelicula: 5,
    id_espectador: 1,
    id_venta: 1,
    calificacion: 5,
    titulo: "Llore con el final",
    texto: "La cancion Recuerdame me dejo sin palabras. Gran musica.",
    fecha: ISODate("2026-10-12T18:52:00-05:00"),
    etiquetas: ["musica", "familiar"]
  },
  {
    id_pelicula: 10,
    id_espectador: 2,
    id_venta: 2,
    calificacion: 4,
    titulo: "Muy divertida",
    texto: "Ryan Gosling como Ken es lo mejor de la pelicula.",
    fecha: ISODate("2026-10-12T23:38:00-05:00"),
    etiquetas: ["comedia"]
  },
  {
    id_pelicula: 1,
    id_espectador: 3,
    id_venta: 3,
    calificacion: 5,
    titulo: "Una experiencia enorme",
    texto: "El sonido de la sala hace vibrar todo. Arrakis nunca se vio tan real.",
    fecha: ISODate("2026-10-12T21:56:00-05:00"),
    etiquetas: ["ciencia ficcion", "sonido"],
    respuesta_empresa: {
      texto: "Gracias por acompanarnos, Daniela. Te esperamos en la proxima funcion.",
      fecha: ISODate("2026-10-13T11:56:00-05:00"),
      id_staff: 1
    }
  },
  {
    id_pelicula: 2,
    id_espectador: 4,
    id_venta: 4,
    calificacion: 5,
    titulo: "Mejor que la primera",
    texto: "Austin Butler se roba la pelicula. La vimos en 4D y valio cada peso.",
    fecha: ISODate("2026-10-13T02:44:00-05:00"),
    etiquetas: ["4D", "accion"]
  },
  {
    id_pelicula: 6,
    id_espectador: 5,
    id_venta: 5,
    calificacion: 5,
    titulo: "Obra maestra",
    texto: "Cillian Murphy esta impecable. Tres horas que se pasan volando.",
    fecha: ISODate("2026-10-13T04:35:00-05:00"),
    etiquetas: ["drama"]
  },
  {
    id_pelicula: 9,
    id_espectador: 6,
    id_venta: 6,
    calificacion: 5,
    titulo: "Visualmente increible",
    texto: "En 4D se siente como estar bajo el agua.",
    fecha: ISODate("2026-10-13T01:24:00-05:00"),
    etiquetas: ["4D", "efectos"],
    respuesta_empresa: {
      texto: "Gracias por acompanarnos, Luz. Te esperamos en la proxima funcion.",
      fecha: ISODate("2026-10-13T15:24:00-05:00"),
      id_staff: 1
    }
  },
  {
    id_pelicula: 8,
    id_espectador: 7,
    id_venta: 7,
    calificacion: 5,
    titulo: "Ansiedad nos representa",
    texto: "Muy divertida y con un mensaje bonito para los adolescentes.",
    fecha: ISODate("2026-10-13T22:25:00-05:00"),
    etiquetas: ["familiar"]
  },
  {
    id_pelicula: 7,
    id_espectador: 8,
    id_venta: 8,
    calificacion: 5,
    titulo: "Me volo la cabeza",
    texto: "La banda sonora en una sala grande es otra cosa.",
    fecha: ISODate("2026-10-14T03:15:00-05:00"),
    etiquetas: ["musica", "ciencia ficcion"]
  },
  {
    id_pelicula: 3,
    id_espectador: 9,
    id_venta: 9,
    calificacion: 4,
    titulo: "Nostalgia pura",
    texto: "Volver a ver a Han Solo en pantalla grande fue emocionante.",
    fecha: ISODate("2026-10-14T01:21:00-05:00"),
    etiquetas: ["clasico"]
  },
  {
    id_pelicula: 4,
    id_espectador: 10,
    id_venta: 10,
    calificacion: 3,
    titulo: "Divide opiniones",
    texto: "Tiene escenas muy buenas y otras que sobran.",
    fecha: ISODate("2026-10-14T06:12:00-05:00")
  },
  {
    id_pelicula: 2,
    id_espectador: 11,
    id_venta: 11,
    calificacion: 5,
    titulo: "Epica de principio a fin",
    texto: "La batalla final se disfruta muchisimo con buen sonido.",
    fecha: ISODate("2026-10-14T07:33:00-05:00"),
    etiquetas: ["accion"]
  },
  {
    id_pelicula: 9,
    id_espectador: 12,
    id_venta: 12,
    calificacion: 3,
    titulo: "Bonita pero larga",
    texto: "Mas de tres horas y el guion es sencillo.",
    fecha: ISODate("2026-10-14T07:06:00-05:00")
  },
  {
    id_pelicula: 8,
    id_espectador: 14,
    id_venta: 14,
    calificacion: 4,
    titulo: "Buena secuela",
    texto: "No supera a la primera, pero se disfruta mucho.",
    fecha: ISODate("2026-10-15T05:44:00-05:00"),
    etiquetas: ["familiar"]
  },
  {
    id_pelicula: 6,
    id_espectador: 15,
    id_venta: 15,
    calificacion: 4,
    titulo: "Intensa",
    texto: "Muy buena, aunque hay que estar muy atento a los dialogos.",
    fecha: ISODate("2026-10-15T09:45:00-05:00"),
    etiquetas: ["subtitulada"]
  },
  {
    id_pelicula: 2,
    id_espectador: 16,
    id_venta: 16,
    calificacion: 4,
    titulo: "Muy buena",
    texto: "Larga, pero no aburre. Recomiendo verla subtitulada.",
    fecha: ISODate("2026-10-15T07:08:00-05:00"),
    etiquetas: ["subtitulada"]
  },
  {
    id_pelicula: 3,
    id_espectador: 17,
    id_venta: 17,
    calificacion: 3,
    titulo: "Entretenida",
    texto: "Divertida, aunque se parece demasiado a la original.",
    fecha: ISODate("2026-10-15T09:17:00-05:00")
  },
  {
    id_pelicula: 7,
    id_espectador: 18,
    id_venta: 18,
    calificacion: 4,
    titulo: "Un clasico moderno",
    texto: "Volver a verla en cine fue todo un acierto.",
    fecha: ISODate("2026-10-15T12:25:00-05:00"),
    etiquetas: ["clasico"]
  },
  {
    id_pelicula: 9,
    id_espectador: 19,
    id_venta: 19,
    calificacion: 4,
    titulo: "El agua se ve real",
    texto: "Los efectos visuales son de otro nivel.",
    fecha: ISODate("2026-10-15T08:25:00-05:00"),
    etiquetas: ["efectos"]
  },
  {
    id_pelicula: 2,
    id_espectador: 20,
    id_venta: 20,
    calificacion: 2,
    titulo: "Demasiado larga",
    texto: "Casi tres horas sin intermedio es mucho y las butacas 4D se detuvieron un rato.",
    fecha: ISODate("2026-10-15T12:36:00-05:00"),
    etiquetas: ["4D"],
    respuesta_empresa: {
      texto: "Lamentamos lo ocurrido, Jorge. Ya revisamos el caso con el equipo tecnico y te enviamos una boleta de cortesia a tu correo.",
      fecha: ISODate("2026-10-16T02:36:00-05:00"),
      id_staff: 1
    }
  },
  {
    id_pelicula: 10,
    id_espectador: 21,
    id_venta: 21,
    calificacion: 5,
    titulo: "Sorprendente",
    texto: "Mucho mas inteligente y divertida de lo que esperaba.",
    fecha: ISODate("2026-10-16T08:21:00-05:00"),
    etiquetas: ["comedia"]
  },
  {
    id_pelicula: 6,
    id_espectador: 22,
    id_venta: 22,
    calificacion: 5,
    titulo: "Imperdible en VIP",
    texto: "Verla en la sala VIP con ese sonido hace toda la diferencia.",
    fecha: ISODate("2026-10-16T13:04:00-05:00"),
    etiquetas: ["VIP", "sonido"],
    respuesta_empresa: {
      texto: "Gracias por acompanarnos, Sebastian. Te esperamos en la proxima funcion.",
      fecha: ISODate("2026-10-17T03:04:00-05:00"),
      id_staff: 1
    }
  },
  {
    id_pelicula: 1,
    id_espectador: 23,
    id_venta: 23,
    calificacion: 4,
    titulo: "Lenta pero hermosa",
    texto: "La primera hora se hace larga, pero la fotografia lo compensa.",
    fecha: ISODate("2026-10-16T11:16:00-05:00"),
    etiquetas: ["fotografia"]
  },
  {
    id_pelicula: 4,
    id_espectador: 24,
    id_venta: 24,
    calificacion: 2,
    titulo: "No me convencio",
    texto: "El ritmo es irregular y el 3D se veia un poco oscuro.",
    fecha: ISODate("2026-10-16T15:50:00-05:00"),
    etiquetas: ["3D"]
  },
  {
    id_pelicula: 5,
    id_espectador: 26,
    id_venta: 26,
    calificacion: 4,
    titulo: "Hermosa",
    texto: "Los colores son espectaculares, ideal para ir con ninos.",
    fecha: ISODate("2026-10-17T17:17:00-05:00"),
    etiquetas: ["familiar"]
  },
  {
    id_pelicula: 8,
    id_espectador: 27,
    id_venta: 27,
    calificacion: 3,
    titulo: "Para los ninos",
    texto: "A los pequenos les encanto; a mi me parecio predecible.",
    fecha: ISODate("2026-10-17T20:45:00-05:00")
  },
  {
    id_pelicula: 6,
    id_espectador: 30,
    id_venta: 30,
    calificacion: 2,
    titulo: "Demasiado densa",
    texto: "Mucho dialogo y poca accion para mi gusto.",
    fecha: ISODate("2026-10-18T04:00:00-05:00"),
    respuesta_empresa: {
      texto: "Lamentamos lo ocurrido, Beatriz. Ya revisamos el caso con el equipo tecnico y te enviamos una boleta de cortesia a tu correo.",
      fecha: ISODate("2026-10-18T18:00:00-05:00"),
      id_staff: 1
    }
  },
  {
    id_pelicula: 5,
    id_espectador: 33,
    id_venta: 33,
    calificacion: 5,
    titulo: "Una joya",
    texto: "La vi por tercera vez y sigue emocionando igual.",
    fecha: ISODate("2026-10-18T21:36:00-05:00"),
    respuesta_empresa: {
      texto: "Gracias por acompanarnos, Martin. Te esperamos en la proxima funcion.",
      fecha: ISODate("2026-10-19T11:36:00-05:00"),
      id_staff: 1
    }
  },
  {
    id_pelicula: 3,
    id_espectador: 34,
    id_venta: 34,
    calificacion: 5,
    titulo: "Para toda la familia",
    texto: "Mis hijos quedaron fascinados con los efectos en 3D.",
    fecha: ISODate("2026-10-19T01:46:00-05:00"),
    etiquetas: ["3D", "familiar"]
  },
  {
    id_pelicula: 5,
    id_espectador: 3,
    id_venta: 38,
    calificacion: 1,
    titulo: "Mala experiencia",
    texto: "La pelicula es buena, pero el sonido de la sala fallo varias veces.",
    fecha: ISODate("2026-10-22T04:41:00-05:00"),
    etiquetas: ["sonido"]
  },
  {
    id_pelicula: 15,
    id_espectador: 4,
    calificacion: 5,
    titulo: "Un clasico de Pixar",
    texto: "La vimos en casa antes de la nueva temporada de estrenos. Woody y Buzz siempre funcionan.",
    fecha: ISODate("2026-10-15T21:10:00-05:00"),
    etiquetas: ["familiar"],
    respuesta_empresa: {
      texto: "Gracias por acompanarnos. Te esperamos en la proxima funcion.",
      fecha: ISODate("2026-10-16T11:10:00-05:00"),
      id_staff: 1
    }
  },
  {
    id_pelicula: 13,
    id_espectador: 9,
    calificacion: 5,
    titulo: "Quiero verla en pantalla grande",
    texto: "Ojala la vuelvan a programar en sala 4D, el sonido de los aviones lo merece.",
    fecha: ISODate("2026-10-16T21:15:00-05:00"),
    etiquetas: ["accion"]
  },
  {
    id_pelicula: 22,
    id_espectador: 17,
    calificacion: 4,
    titulo: "Inquietante",
    texto: "Joaquin Phoenix esta brillante; No es una pelicula para todos.",
    fecha: ISODate("2026-10-17T21:20:00-05:00"),
    etiquetas: ["drama"]
  },
  {
    id_pelicula: 24,
    id_espectador: 21,
    calificacion: 5,
    titulo: "Pidan su reestreno",
    texto: "La musica es preciosa. Seria perfecta para una funcion especial en VIP.",
    fecha: ISODate("2026-10-18T21:25:00-05:00"),
    etiquetas: ["musica"],
    respuesta_empresa: {
      texto: "Gracias por acompanarnos. Te esperamos en la proxima funcion.",
      fecha: ISODate("2026-10-19T11:25:00-05:00"),
      id_staff: 1
    }
  },
  {
    id_pelicula: 27,
    id_espectador: 25,
    calificacion: 4,
    titulo: "Tension en el espacio",
    texto: "Muy buena para ver en 3D, ojala la programen.",
    fecha: ISODate("2026-10-19T21:30:00-05:00"),
    etiquetas: ["ciencia ficcion", "3D"]
  },
  {
    id_pelicula: 26,
    id_espectador: 30,
    calificacion: 5,
    titulo: "Orgullo colombiano",
    texto: "Una pelicula que nos representa. Me encantaria verla con mis sobrinos en el cine.",
    fecha: ISODate("2026-10-20T21:35:00-05:00"),
    etiquetas: ["familiar", "musica"]
  }
]);

// 4. Reportes de incidentes: fallas tecnicas, quejas de servicio e incidentes de seguridad.
// El detalle cambia segun el tipo, como exige el $jsonSchema de la coleccion.
db.reportes_incidentes.insertMany([
  {
    tipo: "FALLA_TECNICA",
    fecha: ISODate("2026-10-14T19:20:00-05:00"),
    id_funcion: 20,
    id_sala: 10,
    id_staff_reporta: 6,
    estado: "RESUELTO",
    descripcion: "El sistema de movimiento de butacas se detuvo a los 20 minutos de la funcion.",
    detalle: { equipo: "butacas 4D", minutos_retraso: 15, funcion_reprogramada: false },
    seguimiento: [
      { fecha: ISODate("2026-10-14T19:25:00-05:00"), accion: "Reinicio del sistema", id_staff: 6 },
      { fecha: ISODate("2026-10-15T08:20:00-05:00"), accion: "Revision preventiva", id_staff: 1 }
    ]
  },
  {
    tipo: "FALLA_TECNICA",
    fecha: ISODate("2026-10-17T12:35:00-05:00"),
    id_funcion: 26,
    id_sala: 1,
    id_staff_reporta: 5,
    estado: "RESUELTO",
    descripcion: "El sonido de la sala se corto en tres momentos de la funcion.",
    detalle: { equipo: "sistema de sonido", minutos_retraso: 10, funcion_reprogramada: false },
    seguimiento: [
      { fecha: ISODate("2026-10-17T12:37:00-05:00"), accion: "Cambio a canal de respaldo", id_staff: 5 },
      {
        fecha: ISODate("2026-10-18T12:35:00-05:00"),
        accion: "Mantenimiento del amplificador",
        id_staff: 1
      }
    ]
  },
  {
    tipo: "FALLA_TECNICA",
    fecha: ISODate("2026-10-12T15:00:00-05:00"),
    id_funcion: 3,
    id_sala: 4,
    id_staff_reporta: 7,
    estado: "RESUELTO",
    descripcion: "El proyector 3D no encendio a la hora programada.",
    detalle: { equipo: "proyector", minutos_retraso: 25, funcion_reprogramada: false },
    seguimiento: [
      { fecha: ISODate("2026-10-12T15:10:00-05:00"), accion: "Reinicio del proyector", id_staff: 7 }
    ]
  },
  {
    tipo: "FALLA_TECNICA",
    fecha: ISODate("2026-10-13T15:40:00-05:00"),
    id_funcion: 9,
    id_sala: 5,
    id_staff_reporta: 6,
    estado: "RESUELTO",
    descripcion: "Las gafas 3D de una fila no sincronizaban con la imagen.",
    detalle: { equipo: "gafas 3D", minutos_retraso: 0, funcion_reprogramada: false, unidades_afectadas: 12 },
    seguimiento: [
      { fecha: ISODate("2026-10-13T15:45:00-05:00"), accion: "Reemplazo de las gafas", id_staff: 6 }
    ]
  },
  {
    tipo: "FALLA_TECNICA",
    fecha: ISODate("2026-10-14T17:00:00-05:00"),
    id_funcion: 14,
    id_sala: 1,
    id_staff_reporta: 5,
    estado: "RESUELTO",
    descripcion: "Falla en la carga del archivo de la pelicula en el servidor.",
    detalle: { equipo: "servidor de contenidos", minutos_retraso: 30, funcion_reprogramada: false },
    seguimiento: [
      { fecha: ISODate("2026-10-14T17:15:00-05:00"), accion: "Carga manual del archivo", id_staff: 5 },
      { fecha: ISODate("2026-10-14T17:25:00-05:00"), accion: "Inicio de la funcion", id_staff: 5 }
    ]
  },
  {
    tipo: "FALLA_TECNICA",
    fecha: ISODate("2026-10-14T16:00:00-05:00"),
    id_funcion: 19,
    id_sala: 9,
    id_staff_reporta: 7,
    estado: "EN_PROCESO",
    descripcion: "El aire acondicionado de la sala dejo de funcionar.",
    detalle: { equipo: "aire acondicionado", minutos_retraso: 0, funcion_reprogramada: false },
    seguimiento: [
      { fecha: ISODate("2026-10-14T16:10:00-05:00"), accion: "Reporte al proveedor", id_staff: 1 }
    ]
  },
  {
    tipo: "FALLA_TECNICA",
    fecha: ISODate("2026-10-17T16:15:00-05:00"),
    id_funcion: 31,
    id_sala: 9,
    id_staff_reporta: 6,
    estado: "RESUELTO",
    descripcion: "Los efectos de viento no se activaron durante la funcion 4D.",
    detalle: { equipo: "efectos 4D", minutos_retraso: 0, funcion_reprogramada: false },
    seguimiento: [
      {
        fecha: ISODate("2026-10-17T18:25:00-05:00"),
        accion: "Calibracion de los ventiladores",
        id_staff: 6
      }
    ]
  },
  {
    tipo: "FALLA_TECNICA",
    fecha: ISODate("2026-10-18T18:00:00-05:00"),
    id_funcion: 36,
    id_sala: 8,
    id_staff_reporta: 7,
    estado: "RESUELTO",
    descripcion: "El subtitulado aparecia desincronizado al inicio de la pelicula.",
    detalle: { equipo: "subtitulado", minutos_retraso: 8, funcion_reprogramada: false },
    seguimiento: [
      {
        fecha: ISODate("2026-10-18T18:06:00-05:00"),
        accion: "Ajuste del desfase del archivo",
        id_staff: 7
      }
    ]
  },
  {
    tipo: "FALLA_TECNICA",
    fecha: ISODate("2026-10-15T16:00:00-05:00"),
    id_funcion: 23,
    id_sala: 5,
    id_staff_reporta: 5,
    estado: "RESUELTO",
    descripcion: "Corte de energia parcial antes del inicio de la funcion.",
    detalle: { equipo: "planta electrica", minutos_retraso: 40, funcion_reprogramada: false },
    seguimiento: [
      {
        fecha: ISODate("2026-10-15T16:05:00-05:00"),
        accion: "Encendido de la planta de respaldo",
        id_staff: 11
      },
      {
        fecha: ISODate("2026-10-15T16:35:00-05:00"),
        accion: "Restablecimiento de la energia",
        id_staff: 11
      }
    ]
  },
  {
    tipo: "FALLA_TECNICA",
    fecha: ISODate("2026-10-21T17:30:00-05:00"),
    id_funcion: 38,
    id_sala: 1,
    id_staff_reporta: 6,
    estado: "ABIERTO",
    descripcion: "El proyector mostro lineas verticales en la imagen durante la funcion.",
    detalle: { equipo: "proyector", minutos_retraso: 0, funcion_reprogramada: false }
  },
  {
    tipo: "FALLA_TECNICA",
    fecha: ISODate("2026-10-13T18:00:00-05:00"),
    id_funcion: 12,
    id_sala: 10,
    id_staff_reporta: 7,
    estado: "RESUELTO",
    descripcion: "El sistema de movimiento de butacas no respondio y la funcion se paso a la siguiente fecha.",
    detalle: { equipo: "butacas 4D", minutos_retraso: 60, funcion_reprogramada: true },
    seguimiento: [
      {
        fecha: ISODate("2026-10-13T18:20:00-05:00"),
        accion: "Intento de reinicio sin exito",
        id_staff: 7
      },
      {
        fecha: ISODate("2026-10-13T19:00:00-05:00"),
        accion: "Reprogramacion de la funcion",
        id_staff: 1
      }
    ]
  },
  {
    tipo: "FALLA_TECNICA",
    fecha: ISODate("2026-10-21T20:00:00-05:00"),
    id_funcion: 40,
    id_sala: 7,
    id_staff_reporta: 5,
    estado: "EN_PROCESO",
    descripcion: "La lampara del proyector presenta perdida de brillo.",
    detalle: { equipo: "proyector", minutos_retraso: 5, funcion_reprogramada: false },
    seguimiento: [
      {
        fecha: ISODate("2026-10-21T20:01:00-05:00"),
        accion: "Solicitud de lampara de repuesto",
        id_staff: 1
      }
    ]
  },
  {
    tipo: "QUEJA_SERVICIO",
    fecha: ISODate("2026-10-14T13:30:00-05:00"),
    id_funcion: 13,
    id_sala: 1,
    id_staff_reporta: 2,
    estado: "RESUELTO",
    descripcion: "Demora de mas de 20 minutos en la fila de la taquilla.",
    detalle: { id_espectador: 13, motivo: "demora en taquilla", compensacion: "ninguna" },
    seguimiento: [
      {
        fecha: ISODate("2026-10-14T14:00:00-05:00"),
        accion: "Atencion al espectador en el punto de servicio",
        id_staff: 2
      },
      { fecha: ISODate("2026-10-15T13:30:00-05:00"), accion: "Cierre del caso", id_staff: 1 }
    ]
  },
  {
    tipo: "QUEJA_SERVICIO",
    fecha: ISODate("2026-10-17T12:40:00-05:00"),
    id_funcion: 26,
    id_sala: 1,
    id_staff_reporta: 8,
    estado: "RESUELTO",
    descripcion: "El espectador reclama por los cortes de sonido durante la pelicula.",
    detalle: { id_espectador: 15, motivo: "falla de sonido", compensacion: "boleta de cortesia" },
    seguimiento: [
      {
        fecha: ISODate("2026-10-17T13:10:00-05:00"),
        accion: "Atencion al espectador en el punto de servicio",
        id_staff: 8
      },
      { fecha: ISODate("2026-10-18T12:40:00-05:00"), accion: "Cierre del caso", id_staff: 1 }
    ]
  },
  {
    tipo: "QUEJA_SERVICIO",
    fecha: ISODate("2026-10-12T18:05:00-05:00"),
    id_funcion: 2,
    id_sala: 1,
    id_staff_reporta: 9,
    estado: "RESUELTO",
    descripcion: "Dos espectadores tenian asignado el mismo asiento.",
    detalle: { id_espectador: 2, motivo: "asiento duplicado", compensacion: "cambio de asiento" },
    seguimiento: [
      {
        fecha: ISODate("2026-10-12T18:35:00-05:00"),
        accion: "Atencion al espectador en el punto de servicio",
        id_staff: 9
      },
      { fecha: ISODate("2026-10-13T18:05:00-05:00"), accion: "Cierre del caso", id_staff: 1 }
    ]
  },
  {
    tipo: "QUEJA_SERVICIO",
    fecha: ISODate("2026-10-13T19:50:00-05:00"),
    id_funcion: 11,
    id_sala: 8,
    id_staff_reporta: 8,
    estado: "RESUELTO",
    descripcion: "El servicio a la silla de la sala VIP tardo mas de 30 minutos.",
    detalle: {
      id_espectador: 9,
      motivo: "demora en servicio VIP",
      compensacion: "descuento en la proxima compra"
    },
    seguimiento: [
      {
        fecha: ISODate("2026-10-13T20:20:00-05:00"),
        accion: "Atencion al espectador en el punto de servicio",
        id_staff: 8
      },
      { fecha: ISODate("2026-10-14T19:50:00-05:00"), accion: "Cierre del caso", id_staff: 1 }
    ]
  },
  {
    tipo: "QUEJA_SERVICIO",
    fecha: ISODate("2026-10-14T17:45:00-05:00"),
    id_funcion: 17,
    id_sala: 6,
    id_staff_reporta: 3,
    estado: "RESUELTO",
    descripcion: "Cobro de una boleta general cuando correspondia una de nino.",
    detalle: { id_espectador: 17, motivo: "cobro incorrecto", compensacion: "reembolso parcial" },
    seguimiento: [
      {
        fecha: ISODate("2026-10-14T18:15:00-05:00"),
        accion: "Atencion al espectador en el punto de servicio",
        id_staff: 3
      },
      { fecha: ISODate("2026-10-15T17:45:00-05:00"), accion: "Cierre del caso", id_staff: 1 }
    ]
  },
  {
    tipo: "QUEJA_SERVICIO",
    fecha: ISODate("2026-10-14T19:25:00-05:00"),
    id_funcion: 20,
    id_sala: 10,
    id_staff_reporta: 10,
    estado: "RESUELTO",
    descripcion: "El espectador reclama porque las butacas 4D dejaron de moverse.",
    detalle: { id_espectador: 13, motivo: "falla de butacas 4D", compensacion: "boleta de cortesia" },
    seguimiento: [
      {
        fecha: ISODate("2026-10-14T19:55:00-05:00"),
        accion: "Atencion al espectador en el punto de servicio",
        id_staff: 10
      },
      { fecha: ISODate("2026-10-15T19:25:00-05:00"), accion: "Cierre del caso", id_staff: 1 }
    ]
  },
  {
    tipo: "QUEJA_SERVICIO",
    fecha: ISODate("2026-10-15T20:10:00-05:00"),
    id_funcion: 24,
    id_sala: 6,
    id_staff_reporta: 9,
    estado: "EN_PROCESO",
    descripcion: "La sala se encontraba sucia al momento de ingresar.",
    detalle: { id_espectador: 24, motivo: "limpieza de la sala", compensacion: "ninguna" },
    seguimiento: [
      {
        fecha: ISODate("2026-10-15T20:40:00-05:00"),
        accion: "Atencion al espectador en el punto de servicio",
        id_staff: 9
      }
    ]
  },
  {
    tipo: "QUEJA_SERVICIO",
    fecha: ISODate("2026-10-17T14:40:00-05:00"),
    id_funcion: 27,
    id_sala: 1,
    id_staff_reporta: 4,
    estado: "RESUELTO",
    descripcion: "El sistema de pago con tarjeta fallo y hubo que pagar en efectivo.",
    detalle: { id_espectador: 27, motivo: "falla en medio de pago", compensacion: "ninguna" },
    seguimiento: [
      {
        fecha: ISODate("2026-10-17T15:10:00-05:00"),
        accion: "Atencion al espectador en el punto de servicio",
        id_staff: 4
      },
      { fecha: ISODate("2026-10-18T14:40:00-05:00"), accion: "Cierre del caso", id_staff: 1 }
    ]
  },
  {
    tipo: "QUEJA_SERVICIO",
    fecha: ISODate("2026-10-17T20:30:00-05:00"),
    id_funcion: 32,
    id_sala: 10,
    id_staff_reporta: 10,
    estado: "ABIERTO",
    descripcion: "El volumen de la pelicula estaba demasiado alto.",
    detalle: { id_espectador: 32, motivo: "volumen alto", compensacion: "ninguna" }
  },
  {
    tipo: "QUEJA_SERVICIO",
    fecha: ISODate("2026-10-18T18:15:00-05:00"),
    id_funcion: 36,
    id_sala: 8,
    id_staff_reporta: 8,
    estado: "RESUELTO",
    descripcion: "Los subtitulos estaban desincronizados al inicio de la funcion.",
    detalle: { id_espectador: 22, motivo: "subtitulos desincronizados", compensacion: "boleta de cortesia" },
    seguimiento: [
      {
        fecha: ISODate("2026-10-18T18:45:00-05:00"),
        accion: "Atencion al espectador en el punto de servicio",
        id_staff: 8
      },
      { fecha: ISODate("2026-10-19T18:15:00-05:00"), accion: "Cierre del caso", id_staff: 1 }
    ]
  },
  {
    tipo: "QUEJA_SERVICIO",
    fecha: ISODate("2026-10-12T20:10:00-05:00"),
    id_funcion: 5,
    id_sala: 7,
    id_staff_reporta: 9,
    estado: "RESUELTO",
    descripcion: "Un grupo de espectadores hablaba durante toda la funcion.",
    detalle: { id_espectador: 5, motivo: "comportamiento de otros espectadores", compensacion: "ninguna" },
    seguimiento: [
      {
        fecha: ISODate("2026-10-12T20:40:00-05:00"),
        accion: "Atencion al espectador en el punto de servicio",
        id_staff: 9
      },
      { fecha: ISODate("2026-10-13T20:10:00-05:00"), accion: "Cierre del caso", id_staff: 1 }
    ]
  },
  {
    tipo: "QUEJA_SERVICIO",
    fecha: ISODate("2026-10-18T16:50:00-05:00"),
    id_funcion: 35,
    id_sala: 6,
    id_staff_reporta: 2,
    estado: "EN_PROCESO",
    descripcion: "La compra en linea no reflejo el descuento del miercoles.",
    detalle: { id_espectador: 21, motivo: "descuento no aplicado", compensacion: "reembolso pendiente" },
    seguimiento: [
      {
        fecha: ISODate("2026-10-18T17:20:00-05:00"),
        accion: "Atencion al espectador en el punto de servicio",
        id_staff: 2
      }
    ]
  },
  {
    tipo: "SEGURIDAD",
    fecha: ISODate("2026-10-12T20:45:00-05:00"),
    id_staff_reporta: 9,
    estado: "RESUELTO",
    descripcion: "Persona intento ingresar a la sala sin boleta.",
    detalle: { zona: "Ingreso a salas", gravedad: "BAJA", evacuacion: false },
    seguimiento: [
      {
        fecha: ISODate("2026-10-12T20:55:00-05:00"),
        accion: "Acompanamiento a la taquilla",
        id_staff: 9
      }
    ]
  },
  {
    tipo: "SEGURIDAD",
    fecha: ISODate("2026-10-13T18:20:00-05:00"),
    id_sala: 6,
    id_staff_reporta: 10,
    estado: "RESUELTO",
    descripcion: "Alarma de humo activada por una falla en un sensor de la sala.",
    detalle: { zona: "Sala Oasis 3D 3", gravedad: "MEDIA", evacuacion: true, minutos_evacuacion: 12 },
    seguimiento: [
      { fecha: ISODate("2026-10-13T18:25:00-05:00"), accion: "Revision del sensor", id_staff: 11 },
      {
        fecha: ISODate("2026-10-13T18:35:00-05:00"),
        accion: "Reingreso de los espectadores",
        id_staff: 10
      }
    ]
  },
  {
    tipo: "SEGURIDAD",
    fecha: ISODate("2026-10-14T21:30:00-05:00"),
    id_staff_reporta: 1,
    estado: "RESUELTO",
    descripcion: "Pelea entre dos personas en el parqueadero.",
    detalle: { zona: "Parqueadero", gravedad: "ALTA", evacuacion: false, autoridades_notificadas: true },
    seguimiento: [
      { fecha: ISODate("2026-10-14T21:40:00-05:00"), accion: "Llamada a la policia", id_staff: 1 },
      {
        fecha: ISODate("2026-10-14T22:30:00-05:00"),
        accion: "Entrega del reporte a las autoridades",
        id_staff: 1
      }
    ]
  },
  {
    tipo: "SEGURIDAD",
    fecha: ISODate("2026-10-15T16:10:00-05:00"),
    id_staff_reporta: 8,
    estado: "RESUELTO",
    descripcion: "Un espectador se cayo en las escaleras de acceso.",
    detalle: { zona: "Escaleras de acceso", gravedad: "MEDIA", evacuacion: false, atencion_medica: true },
    seguimiento: [
      { fecha: ISODate("2026-10-15T16:15:00-05:00"), accion: "Primeros auxilios", id_staff: 8 },
      {
        fecha: ISODate("2026-10-16T16:10:00-05:00"),
        accion: "Instalacion de cinta antideslizante",
        id_staff: 11
      }
    ]
  },
  {
    tipo: "SEGURIDAD",
    fecha: ISODate("2026-10-16T19:45:00-05:00"),
    id_sala: 8,
    id_staff_reporta: 9,
    estado: "RESUELTO",
    descripcion: "Se encontro un bolso abandonado dentro de la sala VIP.",
    detalle: { zona: "Sala Oasis VIP 2", gravedad: "BAJA", evacuacion: false },
    seguimiento: [
      {
        fecha: ISODate("2026-10-16T20:15:00-05:00"),
        accion: "Entrega del bolso en objetos perdidos",
        id_staff: 9
      }
    ]
  },
  {
    tipo: "SEGURIDAD",
    fecha: ISODate("2026-10-17T14:00:00-05:00"),
    id_staff_reporta: 11,
    estado: "RESUELTO",
    descripcion: "Una salida de emergencia estaba bloqueada con cajas.",
    detalle: { zona: "Salida de emergencia norte", gravedad: "ALTA", evacuacion: false },
    seguimiento: [
      { fecha: ISODate("2026-10-17T14:10:00-05:00"), accion: "Retiro de las cajas", id_staff: 11 },
      {
        fecha: ISODate("2026-10-17T15:00:00-05:00"),
        accion: "Capacitacion al personal de bodega",
        id_staff: 1
      }
    ]
  },
  {
    tipo: "SEGURIDAD",
    fecha: ISODate("2026-10-18T22:15:00-05:00"),
    id_staff_reporta: 10,
    estado: "EN_PROCESO",
    descripcion: "Camara de seguridad del lobby fuera de servicio.",
    detalle: { zona: "Lobby", gravedad: "MEDIA", evacuacion: false },
    seguimiento: [
      {
        fecha: ISODate("2026-10-18T22:45:00-05:00"),
        accion: "Solicitud de reparacion al proveedor",
        id_staff: 1
      }
    ]
  },
  {
    tipo: "SEGURIDAD",
    fecha: ISODate("2026-10-21T21:50:00-05:00"),
    id_staff_reporta: 8,
    estado: "ABIERTO",
    descripcion: "Reporte de un menor de edad sin acompanante en la zona de salas.",
    detalle: { zona: "Pasillo de salas", gravedad: "MEDIA", evacuacion: false }
  }
]);

// Verificacion: cantidad de documentos por coleccion
[
  { coleccion: "fichas_tecnicas_peliculas", documentos: db.fichas_tecnicas_peliculas.countDocuments() },
  { coleccion: "requisitos_proyeccion", documentos: db.requisitos_proyeccion.countDocuments() },
  { coleccion: "resenas_peliculas", documentos: db.resenas_peliculas.countDocuments() },
  { coleccion: "reportes_incidentes", documentos: db.reportes_incidentes.countDocuments() }
];
