-- =====================================================================
-- CINE EL OASIS
-- Avance 1 - Nucleo transaccional (PostgreSQL)
-- Script 02: 02_datos_prueba.sql
-- Integrantes: Maria Paula Marin Soler, Justin Felipe Narvaez Gutierrez
-- ---------------------------------------------------------------------
-- Se ejecuta DESPUES de 01_creacion_tablas.sql y de 03_triggers.sql,
-- para que los triggers calculen HORA_FIN, PRECIO_UNITARIO y TOTAL.
-- Orden de ejecucion: 01 -> 03 -> 02 -> 04 -> 05
-- =====================================================================

BEGIN;

-- =====================================================================
-- CATALOGOS
-- =====================================================================

-- Generos de las peliculas
INSERT INTO GENERO (NOMBRE) VALUES
    ('CIENCIA FICCION'),
    ('AVENTURA'),
    ('ANIMACION'),
    ('DRAMA'),
    ('COMEDIA');

-- Idioma original de las peliculas
INSERT INTO IDIOMA (NOMBRE) VALUES
    ('INGLES'),
    ('ESPANOL');

-- Nacionalidad de actores y directores 
INSERT INTO NACIONALIDAD (NOMBRE) VALUES
    ('ESTADOUNIDENSE'),
    ('BRITANICA'),
    ('CANADIENSE'),
    ('SUECA'),
    ('MEXICANA'),
    ('IRLANDESA'),
    ('AUSTRALIANA');

-- Papel de la persona en el contrato 
INSERT INTO ROL (NOMBRE) VALUES
    ('ACTOR'),
    ('DIRECTOR');

-- Formatos de sala
INSERT INTO TIPO_SALA (NOMBRE) VALUES
    ('2D'),
    ('3D'),
    ('VIP'),
    ('4D');

-- Categorias de tarifa 
INSERT INTO CATEGORIA_ESPECTADOR (NOMBRE) VALUES
    ('GENERAL'),
    ('NINO'),
    ('ADULTO MAYOR');

-- Documentos de identidad
INSERT INTO TIPO_DOCUMENTO (NOMBRE) VALUES
    ('CEDULA DE CIUDADANIA'),
    ('TARJETA DE IDENTIDAD'),
    ('CEDULA DE EXTRANJERIA'),
    ('PASAPORTE');

-- Cargos de los empleados
INSERT INTO CARGO (NOMBRE) VALUES
    ('ADMINISTRADOR'),
    ('TAQUILLERO'),
    ('PROYECCIONISTA'),
    ('ACOMODADOR'),
    ('SERVICIOS GENERALES');

-- Clasificacion por edad 
INSERT INTO CLASIFICACION (NOMBRE, EDAD_MINIMA) VALUES
    ('TODO PUBLICO', 0),
    ('MAYORES DE 7', 7),
    ('MAYORES DE 12', 12),
    ('MAYORES DE 15', 15),
    ('MAYORES DE 18', 18);


-- =====================================================================
-- PELICULAS, PERSONAS Y CONTRATOS
-- =====================================================================

-- Peliculas en cartelera
INSERT INTO PELICULA (TITULO, DURACION_MIN, FECHA_ESTRENO, ID_GENERO, ID_CLASIFICACION, ID_IDIOMA) VALUES
    ('Dune', 155, '2021-10-22', 1, 3, 1),   -- 1
    ('Dune: Parte Dos', 166, '2024-03-01', 1, 3, 1),   -- 2
    ('Star Wars: El Despertar de la Fuerza', 138, '2015-12-18', 2, 2, 1),   -- 3
    ('Star Wars: Los Ultimos Jedi', 152, '2017-12-15', 1, 2, 1),   -- 4
    ('Coco', 105, '2017-11-22', 3, 1, 1),   -- 5
    ('Oppenheimer', 180, '2023-07-21', 4, 4, 1),   -- 6
    ('Interestelar', 169, '2014-11-07', 1, 3, 1),   -- 7
    ('IntensaMente 2', 96, '2024-06-14', 3, 1, 1),   -- 8
    ('Avatar: El Camino del Agua', 192, '2022-12-16', 2, 3, 1),   -- 9
    ('Barbie', 114, '2023-07-21', 5, 3, 1);   -- 10

-- Actores y directores 
INSERT INTO ACTOR_DIRECTOR (PRIMER_NOMBRE, SEGUNDO_NOMBRE, PRIMER_APELLIDO, SEGUNDO_APELLIDO, ID_NACIONALIDAD) VALUES
    ('Denis', NULL, 'Villeneuve', NULL, 3),   -- 1
    ('Timothee', NULL, 'Chalamet', NULL, 1),   -- 2
    ('Zendaya', NULL, 'Coleman', NULL, 1),   -- 3
    ('Rebecca', NULL, 'Ferguson', NULL, 4),   -- 4
    ('Oscar', NULL, 'Isaac', NULL, 1),   -- 5
    ('Jason', NULL, 'Momoa', NULL, 1),   -- 6
    ('Austin', NULL, 'Butler', NULL, 1),   -- 7
    ('Florence', NULL, 'Pugh', NULL, 2),   -- 8
    ('Jeffrey', 'Jacob', 'Abrams', NULL, 1),   -- 9
    ('Daisy', NULL, 'Ridley', NULL, 2),   -- 10
    ('John', NULL, 'Boyega', NULL, 2),   -- 11
    ('Adam', NULL, 'Driver', NULL, 1),   -- 12
    ('Harrison', NULL, 'Ford', NULL, 1),   -- 13
    ('Rian', NULL, 'Johnson', NULL, 1),   -- 14
    ('Mark', NULL, 'Hamill', NULL, 1),   -- 15
    ('Carrie', NULL, 'Fisher', NULL, 1),   -- 16
    ('Lee', NULL, 'Unkrich', NULL, 1),   -- 17
    ('Anthony', NULL, 'Gonzalez', NULL, 1),   -- 18
    ('Gael', NULL, 'Garcia', 'Bernal', 5),   -- 19
    ('Benjamin', NULL, 'Bratt', NULL, 1),   -- 20
    ('Christopher', NULL, 'Nolan', NULL, 2),   -- 21
    ('Cillian', NULL, 'Murphy', NULL, 6),   -- 22
    ('Emily', NULL, 'Blunt', NULL, 2),   -- 23
    ('Robert', NULL, 'Downey Jr.', NULL, 1),   -- 24
    ('Matt', NULL, 'Damon', NULL, 1),   -- 25
    ('Matthew', NULL, 'McConaughey', NULL, 1),   -- 26
    ('Anne', NULL, 'Hathaway', NULL, 1),   -- 27
    ('Jessica', NULL, 'Chastain', NULL, 1),   -- 28
    ('Kelsey', NULL, 'Mann', NULL, 1),   -- 29
    ('Amy', NULL, 'Poehler', NULL, 1),   -- 30
    ('James', NULL, 'Cameron', NULL, 3),   -- 31
    ('Sam', NULL, 'Worthington', NULL, 7),   -- 32
    ('Zoe', NULL, 'Saldana', NULL, 1),   -- 33
    ('Sigourney', NULL, 'Weaver', NULL, 1),   -- 34
    ('Greta', NULL, 'Gerwig', NULL, 1),   -- 35
    ('Margot', NULL, 'Robbie', NULL, 7),   -- 36
    ('Ryan', NULL, 'Gosling', NULL, 3);   -- 37

-- Contratos 
INSERT INTO CONTRATO (PERSONAJE, FECHA_INICIO, FECHA_FIN, VALOR, ID_PERSONA, ID_PELICULA, ID_ROL) VALUES
    -- Dune
    (NULL, '2019-03-01', '2019-07-31', 9000000, 1, 1, 2),
    ('Paul Atreides', '2019-03-01', '2019-07-31', 5000000, 2, 1, 1),
    ('Chani', '2019-03-01', '2019-07-31', 2500000, 3, 1, 1),
    ('Lady Jessica', '2019-03-01', '2019-07-31', 3000000, 4, 1, 1),
    ('Duque Leto Atreides', '2019-03-01', '2019-07-31', 3000000, 5, 1, 1),
    ('Duncan Idaho', '2019-03-01', '2019-07-31', 2800000, 6, 1, 1),
    -- Dune: Parte Dos
    (NULL, '2022-07-01', '2022-12-15', 12000000, 1, 2, 2),
    ('Paul Atreides', '2022-07-01', '2022-12-15', 8000000, 2, 2, 1),
    ('Chani', '2022-07-01', '2022-12-15', 5000000, 3, 2, 1),
    ('Lady Jessica', '2022-07-01', '2022-12-15', 3500000, 4, 2, 1),
    ('Feyd-Rautha Harkonnen', '2022-07-01', '2022-12-15', 3000000, 7, 2, 1),
    ('Princesa Irulan', '2022-07-01', '2022-12-15', 2500000, 8, 2, 1),
    -- Star Wars: El Despertar de la Fuerza
    (NULL, '2014-04-01', '2014-11-30', 10000000, 9, 3, 2),
    ('Rey', '2014-04-01', '2014-11-30', 1500000, 10, 3, 1),
    ('Finn', '2014-04-01', '2014-11-30', 1500000, 11, 3, 1),
    ('Kylo Ren', '2014-04-01', '2014-11-30', 2000000, 12, 3, 1),
    ('Han Solo', '2014-04-01', '2014-11-30', 10000000, 13, 3, 1),
    ('Poe Dameron', '2014-04-01', '2014-11-30', 1800000, 5, 3, 1),
    -- Star Wars: Los Ultimos Jedi
    (NULL, '2016-02-01', '2016-07-31', 8000000, 14, 4, 2),
    ('Luke Skywalker', '2016-02-01', '2016-07-31', 4000000, 15, 4, 1),
    ('Rey', '2016-02-01', '2016-07-31', 3000000, 10, 4, 1),
    ('Kylo Ren', '2016-02-01', '2016-07-31', 3000000, 12, 4, 1),
    ('Leia Organa', '2016-02-01', '2016-07-31', 3500000, 16, 4, 1),
    ('Finn', '2016-02-01', '2016-07-31', 2500000, 11, 4, 1),
    -- Coco
    (NULL, '2016-01-15', '2017-06-30', 5000000, 17, 5, 2),
    ('Miguel', '2016-01-15', '2017-06-30', 800000, 18, 5, 1),
    ('Hector', '2016-01-15', '2017-06-30', 1200000, 19, 5, 1),
    ('Ernesto de la Cruz', '2016-01-15', '2017-06-30', 1200000, 20, 5, 1),
    -- Oppenheimer
    (NULL, '2022-02-01', '2022-05-31', 20000000, 21, 6, 2),
    ('J. Robert Oppenheimer', '2022-02-01', '2022-05-31', 6000000, 22, 6, 1),
    ('Kitty Oppenheimer', '2022-02-01', '2022-05-31', 4000000, 23, 6, 1),
    ('Lewis Strauss', '2022-02-01', '2022-05-31', 5000000, 24, 6, 1),
    ('Leslie Groves', '2022-02-01', '2022-05-31', 4500000, 25, 6, 1),
    -- Interestelar
    (NULL, '2013-08-01', '2013-12-31', 15000000, 21, 7, 2),
    ('Cooper', '2013-08-01', '2013-12-31', 7000000, 26, 7, 1),
    ('Amelia Brand', '2013-08-01', '2013-12-31', 5000000, 27, 7, 1),
    ('Murph', '2013-08-01', '2013-12-31', 4000000, 28, 7, 1),
    -- IntensaMente 2
    (NULL, '2022-06-01', '2024-03-31', 4000000, 29, 8, 2),
    ('Alegria', '2022-06-01', '2024-03-31', 3000000, 30, 8, 1),
    -- Avatar: El Camino del Agua
    (NULL, '2017-09-01', '2018-12-31', 25000000, 31, 9, 2),
    ('Jake Sully', '2017-09-01', '2018-12-31', 6000000, 32, 9, 1),
    ('Neytiri', '2017-09-01', '2018-12-31', 6000000, 33, 9, 1),
    ('Kiri', '2017-09-01', '2018-12-31', 5000000, 34, 9, 1),
    -- Barbie
    (NULL, '2022-03-01', '2022-07-31', 10000000, 35, 10, 2),
    ('Barbie', '2022-03-01', '2022-07-31', 12000000, 36, 10, 1),
    ('Ken', '2022-03-01', '2022-07-31', 12000000, 37, 10, 1);


-- =====================================================================
-- SALAS Y TARIFAS
-- =====================================================================

-- Las 10 salas del cine (1.740 sillas). Todas inician ACTIVA.
INSERT INTO SALA (NOMBRE, CAPACIDAD, ID_TIPO_SALA) VALUES
    ('Sala Oasis 2D 1', 230, 1),   -- 1
    ('Sala Oasis 2D 2', 230, 1),   -- 2
    ('Sala Oasis 2D 3', 230, 1),   -- 3
    ('Sala Oasis 3D 1', 230, 2),   -- 4
    ('Sala Oasis 3D 2', 230, 2),   -- 5
    ('Sala Oasis 3D 3', 230, 2),   -- 6
    ('Sala Oasis VIP 1', 70, 3),   -- 7
    ('Sala Oasis VIP 2', 70, 3),   -- 8
    ('Sala Oasis 4D 1', 110, 4),   -- 9
    ('Sala Oasis 4D 2', 110, 4);   -- 10

-- Precio base por tipo de sala y categoria 
INSERT INTO TIPO_BOLETA (PRECIO_BASE, ID_TIPO_SALA, ID_CATEGORIA) VALUES
    (18000, 1, 1),   -- 1: 2D GENERAL
    (12000, 1, 2),   -- 2: 2D NINO
    (13000, 1, 3),   -- 3: 2D ADULTO MAYOR
    (22000, 2, 1),   -- 4: 3D GENERAL
    (16000, 2, 2),   -- 5: 3D NINO
    (17000, 2, 3),   -- 6: 3D ADULTO MAYOR
    (38000, 3, 1),   -- 7: VIP GENERAL
    (30000, 3, 2),   -- 8: VIP NINO
    (32000, 3, 3),   -- 9: VIP ADULTO MAYOR
    (32000, 4, 1),   -- 10: 4D GENERAL
    (25000, 4, 2),   -- 11: 4D NINO
    (26000, 4, 3);   -- 12: 4D ADULTO MAYOR


-- =====================================================================
-- STAFF Y ESPECTADORES
-- =====================================================================

-- Empleados 
INSERT INTO STAFF (ID_TIPO_DOCUMENTO, DOCUMENTO, PRIMER_NOMBRE, SEGUNDO_NOMBRE, PRIMER_APELLIDO, SEGUNDO_APELLIDO, TELEFONO, FECHA_INGRESO, ESTADO, ID_CARGO) VALUES
    (1, '1020345671', 'Andres', 'Felipe', 'Gomez', 'Ruiz', '3001112201', '2019-02-11', 'ACTIVO', 1),   -- 1
    (1, '1020345672', 'Laura', NULL, 'Mendoza', 'Castro', '3001112202', '2020-06-01', 'ACTIVO', 2),   -- 2
    (1, '1020345673', 'Carlos', 'Eduardo', 'Rojas', NULL, '3001112203', '2021-03-15', 'ACTIVO', 2),   -- 3
    (1, '1098765432', 'Valentina', NULL, 'Moreno', 'Diaz', '3001112204', '2024-01-22', 'ACTIVO', 2),   -- 4
    (1, '1020345674', 'Diana', 'Carolina', 'Perez', 'Lopez', '3001112205', '2021-08-02', 'ACTIVO', 3),   -- 5
    (1, '1020345675', 'Julian', NULL, 'Ramirez', 'Soto', '3001112206', '2022-01-10', 'ACTIVO', 3),   -- 6
    (1, '1020345676', 'Natalia', NULL, 'Vargas', NULL, '3001112207', '2022-05-23', 'ACTIVO', 3),   -- 7
    (3, '0054123987', 'Mateo', 'Alejandro', 'Silva', 'Pena', '3001112208', '2023-02-06', 'ACTIVO', 4),   -- 8
    (1, '1020345677', 'Paula', 'Andrea', 'Torres', 'Nino', '3001112209', '2022-09-12', 'ACTIVO', 4),   -- 9
    (1, '1020345678', 'Sebastian', NULL, 'Herrera', 'Quintero', '3001112210', '2023-04-18', 'ACTIVO', 4),   -- 10
    (1, '1020345679', 'Oscar', 'David', 'Castillo', NULL, '3001112211', '2023-07-03', 'ACTIVO', 5),   -- 11
    (1, '1020345680', 'Marta', 'Lucia', 'Beltran', 'Ortiz', '3001112212', '2020-11-09', 'INACTIVO', 2);   -- 12

-- Espectadores 
INSERT INTO ESPECTADOR (ID_TIPO_DOCUMENTO, DOCUMENTO, PRIMER_NOMBRE, SEGUNDO_NOMBRE, PRIMER_APELLIDO, SEGUNDO_APELLIDO, CORREO, TELEFONO) VALUES
    (1, '52987401', 'Camila', NULL, 'Nieto', 'Salazar', 'camila.nieto@correo.com', '3120001371'),   -- 1
    (1, '79456123', 'Juan', 'Pablo', 'Arango', NULL, 'jp.arango@correo.com', '3120002742'),   -- 2
    (1, '1013456789', 'Daniela', NULL, 'Suarez', 'Pineda', 'daniela.suarez@correo.com', '3120004113'),   -- 3
    (1, '1015678234', 'Miguel', 'Angel', 'Cardenas', NULL, 'miguel.cardenas@correo.com', '3120005484'),   -- 4
    (2, '1025874136', 'Santiago', NULL, 'Lozano', 'Rivera', 'santiago.lozano@correo.com', '3120006855'),   -- 5
    (1, '41238765', 'Luz', 'Marina', 'Ospina', 'Garcia', 'luz.ospina@correo.com', '3120008226'),   -- 6
    (1, '80123456', 'Fernando', NULL, 'Quintero', NULL, 'f.quintero@correo.com', '3120009597'),   -- 7
    (3, '0098231456', 'Ana', 'Sofia', 'Restrepo', 'Villa', 'ana.restrepo@correo.com', '3120010968'),   -- 8
    (1, '1018923456', 'Andrea', NULL, 'Pardo', 'Munoz', 'andrea.pardo@correo.com', '3120012339'),   -- 9
    (1, '1032456987', 'Nicolas', 'Esteban', 'Guzman', NULL, 'n.guzman@correo.com', '3120013710'),   -- 10
    (1, '52114478', 'Paola', NULL, 'Jimenez', 'Acosta', 'paola.jimenez@correo.com', '3120015081'),   -- 11
    (2, '1029334455', 'Isabella', NULL, 'Cruz', 'Montoya', 'isabella.cruz@correo.com', '3120016452'),   -- 12
    (1, '79887766', 'Ricardo', 'Alberto', 'Mejia', 'Soto', 'r.mejia@correo.com', '3120017823'),   -- 13
    (4, 'AX7781234', 'Helena', NULL, 'Kovacs', NULL, 'helena.kovacs@correo.com', '3120019194'),   -- 14
    (1, '1012223344', 'Tomas', NULL, 'Barrera', 'Leon', 'tomas.barrera@correo.com', '3120020565'),   -- 15
    (1, '53445566', 'Mariana', 'Alejandra', 'Zapata', NULL, 'mariana.zapata@correo.com', '3120021936'),   -- 16
    (1, '1017889900', 'Felipe', NULL, 'Duarte', 'Correa', 'felipe.duarte@correo.com', '3120023307'),   -- 17
    (1, '40556677', 'Gloria', 'Patricia', 'Ruiz', 'Vega', 'gloria.ruiz@correo.com', '3120024678'),   -- 18
    (1, '1021334455', 'Sara', NULL, 'Camacho', NULL, 'sara.camacho@correo.com', '3120026049'),   -- 19
    (1, '80998877', 'Jorge', 'Ivan', 'Pineda', 'Rojas', 'jorge.pineda@correo.com', '3120027420'),   -- 20
    (1, '1019345678', 'Laura', 'Valentina', 'Rincon', 'Mora', 'laura.rincon@correo.com', '3120028791'),   -- 21
    (1, '1022456789', 'Sebastian', NULL, 'Ortiz', 'Cano', 'sebastian.ortiz@correo.com', '3120030162'),   -- 22
    (1, '52667788', 'Claudia', 'Marcela', 'Rojas', 'Bernal', 'claudia.rojas@correo.com', '3120031533'),   -- 23
    (1, '1016778899', 'Esteban', NULL, 'Medina', 'Parra', 'esteban.medina@correo.com', '3120032904'),   -- 24
    (2, '1031223344', 'Juliana', NULL, 'Fajardo', 'Rey', 'juliana.fajardo@correo.com', '3120034275'),   -- 25
    (1, '79334455', 'Hernan', 'Dario', 'Velasquez', NULL, 'hernan.velasquez@correo.com', '3120035646'),   -- 26
    (1, '1014556677', 'Catalina', NULL, 'Benavides', 'Ruiz', 'catalina.benavides@correo.com', '3120037017'),   -- 27
    (3, '0076543219', 'Lucas', NULL, 'Moreau', NULL, 'lucas.moreau@correo.com', '3120038388'),   -- 28
    (1, '1020889900', 'Alejandro', NULL, 'Pena', 'Gil', 'alejandro.pena@correo.com', '3120039759'),   -- 29
    (1, '43556677', 'Beatriz', 'Elena', 'Cortes', 'Lara', 'beatriz.cortes@correo.com', '3120041130'),   -- 30
    (1, '1023567890', 'Daniel', NULL, 'Romero', 'Vega', 'daniel.romero@correo.com', '3120042501'),   -- 31
    (1, '52778899', 'Adriana', 'Lucia', 'Castano', NULL, 'adriana.castano@correo.com', '3120043872'),   -- 32
    (2, '1033445566', 'Martin', NULL, 'Galeano', 'Ruiz', 'martin.galeano@correo.com', '3120045243'),   -- 33
    (1, '1015123456', 'Natalia', NULL, 'Escobar', 'Diaz', 'natalia.escobar@correo.com', '3120046614'),   -- 34
    (1, '79112233', 'Gustavo', 'Adolfo', 'Salcedo', NULL, 'gustavo.salcedo@correo.com', '3120047985');   -- 35


-- =====================================================================
-- FUNCIONES Y ASIGNACIONES
-- =====================================================================

-- Funciones 
INSERT INTO FUNCION (FECHA, HORA_INICIO, HORA_FIN, VERSION_PROYECCION, ID_PELICULA, ID_SALA) VALUES
    -- lunes 2026-10-12
    ('2026-10-12', '14:00', '14:00', 'DOBLADA AL ESPANOL', 5, 1),   -- 1: Coco
    ('2026-10-12', '18:00', '18:00', 'ORIGINAL SUBTITULADA', 10, 1),   -- 2: Barbie
    ('2026-10-12', '15:00', '15:00', 'ORIGINAL SUBTITULADA', 1, 4),   -- 3: Dune
    ('2026-10-12', '19:00', '19:00', 'ORIGINAL SUBTITULADA', 2, 4),   -- 4: Dune: Parte Dos
    ('2026-10-12', '20:00', '20:00', 'ORIGINAL SUBTITULADA', 6, 7),   -- 5: Oppenheimer
    ('2026-10-12', '16:00', '16:00', 'DOBLADA AL ESPANOL', 9, 9),   -- 6: Avatar: El Camino del Agua
    -- martes 2026-10-13
    ('2026-10-13', '14:00', '14:00', 'DOBLADA AL ESPANOL', 8, 2),   -- 7: IntensaMente 2
    ('2026-10-13', '17:00', '17:00', 'ORIGINAL SUBTITULADA', 7, 2),   -- 8: Interestelar
    ('2026-10-13', '15:00', '15:00', 'DOBLADA AL ESPANOL', 3, 5),   -- 9: Star Wars: El Despertar de la Fuerza
    ('2026-10-13', '19:00', '19:00', 'ORIGINAL SUBTITULADA', 4, 5),   -- 10: Star Wars: Los Ultimos Jedi
    ('2026-10-13', '19:30', '19:30', 'ORIGINAL SUBTITULADA', 2, 8),   -- 11: Dune: Parte Dos
    ('2026-10-13', '18:00', '18:00', 'ORIGINAL SUBTITULADA', 9, 10),   -- 12: Avatar: El Camino del Agua
    -- miercoles 2026-10-14
    ('2026-10-14', '14:00', '14:00', 'DOBLADA AL ESPANOL', 5, 1),   -- 13: Coco
    ('2026-10-14', '17:00', '17:00', 'DOBLADA AL ESPANOL', 8, 1),   -- 14: IntensaMente 2
    ('2026-10-14', '19:00', '19:00', 'ORIGINAL SUBTITULADA', 6, 3),   -- 15: Oppenheimer
    ('2026-10-14', '16:00', '16:00', 'ORIGINAL SUBTITULADA', 2, 4),   -- 16: Dune: Parte Dos
    ('2026-10-14', '18:00', '18:00', 'ORIGINAL SUBTITULADA', 3, 6),   -- 17: Star Wars: El Despertar de la Fuerza
    ('2026-10-14', '20:00', '20:00', 'ORIGINAL SUBTITULADA', 7, 7),   -- 18: Interestelar
    ('2026-10-14', '15:00', '15:00', 'DOBLADA AL ESPANOL', 9, 9),   -- 19: Avatar: El Camino del Agua
    ('2026-10-14', '19:00', '19:00', 'ORIGINAL SUBTITULADA', 2, 10),   -- 20: Dune: Parte Dos
    -- jueves 2026-10-15
    ('2026-10-15', '15:00', '15:00', 'DOBLADA AL ESPANOL', 10, 2),   -- 21: Barbie
    ('2026-10-15', '18:00', '18:00', 'ORIGINAL SUBTITULADA', 6, 3),   -- 22: Oppenheimer
    ('2026-10-15', '16:00', '16:00', 'ORIGINAL SUBTITULADA', 1, 5),   -- 23: Dune
    ('2026-10-15', '20:00', '20:00', 'ORIGINAL SUBTITULADA', 4, 6),   -- 24: Star Wars: Los Ultimos Jedi
    ('2026-10-15', '17:00', '17:00', 'ORIGINAL SUBTITULADA', 7, 8),   -- 25: Interestelar
    -- sabado 2026-10-17
    ('2026-10-17', '12:00', '12:00', 'DOBLADA AL ESPANOL', 5, 1),   -- 26: Coco
    ('2026-10-17', '15:00', '15:00', 'DOBLADA AL ESPANOL', 8, 1),   -- 27: IntensaMente 2
    ('2026-10-17', '14:00', '14:00', 'ORIGINAL SUBTITULADA', 2, 4),   -- 28: Dune: Parte Dos
    ('2026-10-17', '18:00', '18:00', 'DOBLADA AL ESPANOL', 2, 4),   -- 29: Dune: Parte Dos
    ('2026-10-17', '19:00', '19:00', 'ORIGINAL SUBTITULADA', 6, 7),   -- 30: Oppenheimer
    ('2026-10-17', '16:00', '16:00', 'DOBLADA AL ESPANOL', 9, 9),   -- 31: Avatar: El Camino del Agua
    ('2026-10-17', '20:00', '20:00', 'ORIGINAL SUBTITULADA', 2, 10),   -- 32: Dune: Parte Dos
    -- domingo 2026-10-18
    ('2026-10-18', '12:00', '12:00', 'DOBLADA AL ESPANOL', 5, 2),   -- 33: Coco
    ('2026-10-18', '15:00', '15:00', 'DOBLADA AL ESPANOL', 3, 5),   -- 34: Star Wars: El Despertar de la Fuerza
    ('2026-10-18', '17:00', '17:00', 'ORIGINAL SUBTITULADA', 2, 6),   -- 35: Dune: Parte Dos
    ('2026-10-18', '18:00', '18:00', 'ORIGINAL SUBTITULADA', 6, 8),   -- 36: Oppenheimer
    ('2026-10-18', '14:00', '14:00', 'ORIGINAL SUBTITULADA', 9, 10),   -- 37: Avatar: El Camino del Agua
    -- miercoles 2026-10-21
    ('2026-10-21', '16:00', '16:00', 'DOBLADA AL ESPANOL', 5, 1),   -- 38: Coco
    ('2026-10-21', '19:00', '19:00', 'ORIGINAL SUBTITULADA', 2, 4),   -- 39: Dune: Parte Dos
    ('2026-10-21', '20:00', '20:00', 'ORIGINAL SUBTITULADA', 7, 7);   -- 40: Interestelar

-- Empleados asignados a cada funcion 
INSERT INTO ASIGNACION (ID_FUNCION, ID_STAFF, TAREA) VALUES
    (1, 5, 'PROYECCION'),
    (2, 6, 'PROYECCION'),
    (3, 7, 'PROYECCION'),
    (4, 5, 'PROYECCION'),
    (5, 6, 'PROYECCION'),
    (5, 9, 'ACOMODACION'),
    (6, 7, 'PROYECCION'),
    (6, 10, 'ACOMODACION'),
    (7, 5, 'PROYECCION'),
    (8, 6, 'PROYECCION'),
    (9, 7, 'PROYECCION'),
    (10, 5, 'PROYECCION'),
    (11, 6, 'PROYECCION'),
    (11, 9, 'ACOMODACION'),
    (12, 7, 'PROYECCION'),
    (12, 10, 'ACOMODACION'),
    (13, 5, 'PROYECCION'),
    (14, 6, 'PROYECCION'),
    (15, 7, 'PROYECCION'),
    (16, 5, 'PROYECCION'),
    (17, 6, 'PROYECCION'),
    (18, 7, 'PROYECCION'),
    (18, 10, 'ACOMODACION'),
    (19, 5, 'PROYECCION'),
    (19, 8, 'ACOMODACION'),
    (20, 6, 'PROYECCION'),
    (20, 9, 'ACOMODACION'),
    (21, 7, 'PROYECCION'),
    (22, 5, 'PROYECCION'),
    (23, 6, 'PROYECCION'),
    (24, 7, 'PROYECCION'),
    (25, 5, 'PROYECCION'),
    (25, 8, 'ACOMODACION'),
    (26, 6, 'PROYECCION'),
    (26, 9, 'ACOMODACION'),
    (27, 7, 'PROYECCION'),
    (27, 10, 'ACOMODACION'),
    (28, 5, 'PROYECCION'),
    (28, 8, 'ACOMODACION'),
    (29, 6, 'PROYECCION'),
    (29, 9, 'ACOMODACION'),
    (30, 7, 'PROYECCION'),
    (30, 10, 'ACOMODACION'),
    (31, 5, 'PROYECCION'),
    (31, 8, 'ACOMODACION'),
    (32, 6, 'PROYECCION'),
    (32, 9, 'ACOMODACION'),
    (33, 7, 'PROYECCION'),
    (33, 10, 'ACOMODACION'),
    (34, 5, 'PROYECCION'),
    (34, 8, 'ACOMODACION'),
    (35, 6, 'PROYECCION'),
    (35, 9, 'ACOMODACION'),
    (36, 7, 'PROYECCION'),
    (36, 10, 'ACOMODACION'),
    (37, 5, 'PROYECCION'),
    (37, 8, 'ACOMODACION'),
    (38, 6, 'PROYECCION'),
    (39, 7, 'PROYECCION'),
    (40, 5, 'PROYECCION'),
    (40, 8, 'ACOMODACION');


-- =====================================================================
-- VENTAS Y DETALLE
-- =====================================================================

-- Ventas 
INSERT INTO VENTA (FECHA_HORA, CANAL, MEDIO_PAGO, ID_ESPECTADOR, ID_FUNCION, ID_STAFF) VALUES
    ('2026-10-12 13:00', 'TAQUILLA', 'EFECTIVO', 1, 1, 2),   -- 1
    ('2026-10-11 11:07', 'EN LINEA', 'TARJETA DEBITO', 2, 2, NULL),   -- 2
    ('2026-10-12 13:40', 'TAQUILLA', 'TARJETA CREDITO', 3, 3, 4),   -- 3
    ('2026-10-11 13:21', 'EN LINEA', 'TARJETA CREDITO', 4, 4, NULL),   -- 4
    ('2026-10-12 19:00', 'TAQUILLA', 'TARJETA DEBITO', 5, 5, 3),   -- 5
    ('2026-10-11 15:35', 'EN LINEA', 'TRANSFERENCIA', 6, 6, NULL),   -- 6
    ('2026-10-13 12:40', 'TAQUILLA', 'EFECTIVO', 7, 7, 2),   -- 7
    ('2026-10-12 17:49', 'EN LINEA', 'TARJETA DEBITO', 8, 8, NULL),   -- 8
    ('2026-10-13 14:00', 'TAQUILLA', 'TARJETA CREDITO', 9, 9, 4),   -- 9
    ('2026-10-12 11:03', 'EN LINEA', 'TARJETA CREDITO', 10, 10, NULL),   -- 10
    ('2026-10-13 18:10', 'TAQUILLA', 'TARJETA DEBITO', 11, 11, 3),   -- 11
    ('2026-10-12 13:17', 'EN LINEA', 'TRANSFERENCIA', 12, 12, NULL),   -- 12
    ('2026-10-14 13:00', 'TAQUILLA', 'EFECTIVO', 13, 13, 2),   -- 13: miercoles, mismo dia (descuento)
    ('2026-10-13 15:31', 'EN LINEA', 'TARJETA DEBITO', 14, 14, NULL),   -- 14
    ('2026-10-14 17:40', 'TAQUILLA', 'TARJETA CREDITO', 15, 15, 4),   -- 15: miercoles, mismo dia (descuento)
    ('2026-10-13 17:45', 'EN LINEA', 'TARJETA CREDITO', 16, 16, NULL),   -- 16
    ('2026-10-14 17:00', 'TAQUILLA', 'TARJETA DEBITO', 17, 17, 3),   -- 17: miercoles, mismo dia (descuento)
    ('2026-10-13 11:59', 'EN LINEA', 'TRANSFERENCIA', 18, 18, NULL),   -- 18
    ('2026-10-14 13:40', 'TAQUILLA', 'EFECTIVO', 19, 19, 2),   -- 19: miercoles, mismo dia (descuento)
    ('2026-10-13 13:13', 'EN LINEA', 'TARJETA DEBITO', 20, 20, NULL),   -- 20
    ('2026-10-15 14:00', 'TAQUILLA', 'TARJETA CREDITO', 21, 21, 4),   -- 21
    ('2026-10-14 15:27', 'EN LINEA', 'TARJETA CREDITO', 22, 22, NULL),   -- 22
    ('2026-10-15 14:40', 'TAQUILLA', 'TARJETA DEBITO', 23, 23, 3),   -- 23
    ('2026-10-14 17:41', 'EN LINEA', 'TRANSFERENCIA', 24, 24, NULL),   -- 24
    ('2026-10-15 16:00', 'TAQUILLA', 'EFECTIVO', 25, 25, 2),   -- 25
    ('2026-10-16 11:55', 'EN LINEA', 'TARJETA DEBITO', 26, 26, NULL),   -- 26
    ('2026-10-17 13:40', 'TAQUILLA', 'TARJETA CREDITO', 27, 27, 4),   -- 27
    ('2026-10-16 13:09', 'EN LINEA', 'TARJETA CREDITO', 28, 28, NULL),   -- 28
    ('2026-10-17 17:00', 'TAQUILLA', 'TARJETA DEBITO', 29, 29, 3),   -- 29
    ('2026-10-16 15:23', 'EN LINEA', 'TRANSFERENCIA', 30, 30, NULL),   -- 30
    ('2026-10-17 14:40', 'TAQUILLA', 'EFECTIVO', 31, 31, 2),   -- 31
    ('2026-10-16 17:37', 'EN LINEA', 'TARJETA DEBITO', 32, 32, NULL),   -- 32
    ('2026-10-18 11:00', 'TAQUILLA', 'TARJETA CREDITO', 33, 33, 4),   -- 33
    ('2026-10-17 11:51', 'EN LINEA', 'TARJETA CREDITO', 34, 34, NULL),   -- 34
    ('2026-10-18 15:40', 'TAQUILLA', 'TARJETA DEBITO', 35, 35, 3),   -- 35
    ('2026-10-17 13:05', 'EN LINEA', 'TRANSFERENCIA', 1, 36, NULL),   -- 36
    ('2026-10-18 13:00', 'TAQUILLA', 'EFECTIVO', 2, 37, 2),   -- 37
    ('2026-10-20 15:19', 'EN LINEA', 'TARJETA DEBITO', 3, 38, NULL),   -- 38
    ('2026-10-21 17:40', 'TAQUILLA', 'TARJETA CREDITO', 4, 39, 4),   -- 39: miercoles, mismo dia (descuento)
    ('2026-10-20 17:33', 'EN LINEA', 'TARJETA CREDITO', 5, 40, NULL),   -- 40
    ('2026-10-12 13:00', 'TAQUILLA', 'TARJETA DEBITO', 6, 1, 3),   -- 41
    ('2026-10-11 11:47', 'EN LINEA', 'TRANSFERENCIA', 7, 4, NULL),   -- 42
    ('2026-10-12 18:40', 'TAQUILLA', 'EFECTIVO', 8, 5, 2),   -- 43
    ('2026-10-12 13:01', 'EN LINEA', 'TARJETA DEBITO', 9, 11, NULL),   -- 44
    ('2026-10-14 13:00', 'TAQUILLA', 'TARJETA CREDITO', 10, 13, 4),   -- 45: miercoles, mismo dia (descuento)
    ('2026-10-13 15:15', 'EN LINEA', 'TARJETA CREDITO', 11, 15, NULL),   -- 46
    ('2026-10-14 14:40', 'TAQUILLA', 'TARJETA DEBITO', 12, 16, 3),   -- 47: miercoles, mismo dia (descuento)
    ('2026-10-13 17:29', 'EN LINEA', 'TRANSFERENCIA', 13, 20, NULL),   -- 48
    ('2026-10-15 17:00', 'TAQUILLA', 'EFECTIVO', 14, 22, 2),   -- 49
    ('2026-10-16 11:43', 'EN LINEA', 'TARJETA DEBITO', 15, 26, NULL),   -- 50
    ('2026-10-17 12:40', 'TAQUILLA', 'TARJETA CREDITO', 16, 28, 4),   -- 51
    ('2026-10-16 13:57', 'EN LINEA', 'TARJETA CREDITO', 17, 29, NULL),   -- 52
    ('2026-10-17 18:00', 'TAQUILLA', 'TARJETA DEBITO', 18, 30, 3),   -- 53
    ('2026-10-16 15:11', 'EN LINEA', 'TRANSFERENCIA', 19, 32, NULL),   -- 54
    ('2026-10-18 10:40', 'TAQUILLA', 'EFECTIVO', 20, 33, 2),   -- 55
    ('2026-10-17 17:25', 'EN LINEA', 'TARJETA DEBITO', 21, 35, NULL),   -- 56
    ('2026-10-18 17:00', 'TAQUILLA', 'TARJETA CREDITO', 22, 36, 4),   -- 57
    ('2026-10-20 11:39', 'EN LINEA', 'TARJETA CREDITO', 23, 38, NULL),   -- 58
    ('2026-10-21 17:40', 'TAQUILLA', 'TARJETA DEBITO', 24, 39, 3);   -- 59: miercoles, mismo dia (descuento)

-- Boletas de cada venta 
INSERT INTO DETALLE_VENTA (ID_VENTA, ID_TIPO_BOLETA, CANTIDAD) VALUES
    (1, 1, 2),
    (1, 2, 1),
    (2, 1, 2),
    (3, 4, 3),
    (4, 4, 1),
    (5, 7, 2),
    (6, 10, 3),
    (6, 12, 1),
    (7, 1, 2),
    (7, 2, 1),
    (8, 1, 2),
    (9, 4, 3),
    (10, 4, 1),
    (11, 7, 2),
    (11, 9, 1),
    (12, 10, 3),
    (13, 1, 2),
    (13, 2, 1),
    (14, 1, 2),
    (14, 2, 2),
    (15, 1, 3),
    (16, 4, 1),
    (16, 6, 1),
    (17, 4, 2),
    (18, 7, 3),
    (19, 10, 1),
    (20, 10, 2),
    (21, 1, 3),
    (21, 3, 1),
    (22, 1, 1),
    (23, 4, 2),
    (24, 4, 3),
    (25, 7, 1),
    (26, 1, 2),
    (26, 2, 2),
    (27, 1, 2),
    (27, 2, 3),
    (28, 4, 1),
    (29, 4, 2),
    (30, 7, 3),
    (31, 10, 1),
    (31, 12, 1),
    (32, 10, 2),
    (33, 1, 2),
    (33, 2, 3),
    (34, 4, 1),
    (35, 4, 2),
    (36, 7, 3),
    (36, 9, 1),
    (37, 10, 1),
    (38, 1, 2),
    (38, 2, 2),
    (39, 4, 3),
    (40, 7, 1),
    (41, 1, 2),
    (41, 2, 2),
    (42, 4, 3),
    (43, 7, 1),
    (44, 7, 2),
    (45, 1, 2),
    (45, 2, 3),
    (46, 1, 1),
    (46, 3, 1),
    (47, 4, 2),
    (48, 10, 3),
    (49, 1, 1),
    (50, 1, 2),
    (50, 2, 2),
    (51, 4, 3),
    (51, 6, 1),
    (52, 4, 1),
    (53, 7, 2),
    (54, 10, 3),
    (55, 1, 2),
    (55, 2, 1),
    (56, 4, 2),
    (56, 6, 1),
    (57, 7, 3),
    (58, 1, 2),
    (58, 2, 1),
    (59, 4, 2);

COMMIT;


-- =====================================================================
-- VERIFICACION 
-- =====================================================================

-- Cantidad de registros por tabla
SELECT 'GENERO' AS TABLA, COUNT(*) AS REGISTROS FROM GENERO
UNION ALL
SELECT 'CLASIFICACION' AS TABLA, COUNT(*) AS REGISTROS FROM CLASIFICACION
UNION ALL
SELECT 'IDIOMA' AS TABLA, COUNT(*) AS REGISTROS FROM IDIOMA
UNION ALL
SELECT 'NACIONALIDAD' AS TABLA, COUNT(*) AS REGISTROS FROM NACIONALIDAD
UNION ALL
SELECT 'ROL' AS TABLA, COUNT(*) AS REGISTROS FROM ROL
UNION ALL
SELECT 'TIPO_SALA' AS TABLA, COUNT(*) AS REGISTROS FROM TIPO_SALA
UNION ALL
SELECT 'CATEGORIA_ESPECTADOR' AS TABLA, COUNT(*) AS REGISTROS FROM CATEGORIA_ESPECTADOR
UNION ALL
SELECT 'TIPO_DOCUMENTO' AS TABLA, COUNT(*) AS REGISTROS FROM TIPO_DOCUMENTO
UNION ALL
SELECT 'CARGO' AS TABLA, COUNT(*) AS REGISTROS FROM CARGO
UNION ALL
SELECT 'PELICULA' AS TABLA, COUNT(*) AS REGISTROS FROM PELICULA
UNION ALL
SELECT 'ACTOR_DIRECTOR' AS TABLA, COUNT(*) AS REGISTROS FROM ACTOR_DIRECTOR
UNION ALL
SELECT 'CONTRATO' AS TABLA, COUNT(*) AS REGISTROS FROM CONTRATO
UNION ALL
SELECT 'SALA' AS TABLA, COUNT(*) AS REGISTROS FROM SALA
UNION ALL
SELECT 'FUNCION' AS TABLA, COUNT(*) AS REGISTROS FROM FUNCION
UNION ALL
SELECT 'TIPO_BOLETA' AS TABLA, COUNT(*) AS REGISTROS FROM TIPO_BOLETA
UNION ALL
SELECT 'ESPECTADOR' AS TABLA, COUNT(*) AS REGISTROS FROM ESPECTADOR
UNION ALL
SELECT 'STAFF' AS TABLA, COUNT(*) AS REGISTROS FROM STAFF
UNION ALL
SELECT 'VENTA' AS TABLA, COUNT(*) AS REGISTROS FROM VENTA
UNION ALL
SELECT 'DETALLE_VENTA' AS TABLA, COUNT(*) AS REGISTROS FROM DETALLE_VENTA
UNION ALL
SELECT 'ASIGNACION' AS TABLA, COUNT(*) AS REGISTROS FROM ASIGNACION;
