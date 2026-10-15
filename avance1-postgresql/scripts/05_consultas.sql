-- =====================================================================
-- CINE EL OASIS
-- Avance 1 - Nucleo transaccional (PostgreSQL)
-- Script 05: 05_consultas.sql
-- Integrantes: Maria Paula Marin Soler, Justin Felipe Narvaez Gutierrez
-- ---------------------------------------------------------------------
-- Se ejecuta DESPUES de 04_procedimientos.sql.
-- Orden de ejecucion: 01 -> 03 -> 02 -> 04 -> 05
-- =====================================================================


-- Ocupacion de cada funcion: boletas vendidas frente a la capacidad de la sala.
SELECT p.titulo,
       f.fecha,
       f.hora_inicio,
       s.nombre AS sala,
       s.capacidad,
       COALESCE(b.boletas, 0) AS boletas_vendidas,
       ROUND(COALESCE(b.boletas, 0) * 100.0 / s.capacidad, 1) AS pct_ocupacion
  FROM funcion f
  JOIN pelicula p ON p.id_pelicula = f.id_pelicula
  JOIN sala s ON s.id_sala = f.id_sala
  LEFT JOIN (SELECT v.id_funcion,
                    SUM(dv.cantidad) AS boletas
               FROM venta v
               JOIN detalle_venta dv ON dv.id_venta = v.id_venta
              GROUP BY v.id_funcion) b ON b.id_funcion = f.id_funcion
 ORDER BY pct_ocupacion ASC, f.fecha ASC;


-- Consultar espectadores que gastaron mas que el promedio, con su posicion en el ranking.
SELECT RANK() OVER (ORDER BY G.TOTAL_GASTADO DESC) AS POSICION,
       E.PRIMER_NOMBRE || ' ' || E.PRIMER_APELLIDO AS ESPECTADOR,
       E.CORREO,
       G.COMPRAS,
       G.BOLETAS,
       G.TOTAL_GASTADO
FROM ESPECTADOR E
JOIN (SELECT V.ID_ESPECTADOR,
             COUNT(DISTINCT V.ID_VENTA) AS COMPRAS,
             SUM(D.CANTIDAD) AS BOLETAS,
             SUM(D.CANTIDAD * D.PRECIO_UNITARIO) AS TOTAL_GASTADO
      FROM VENTA V
      JOIN DETALLE_VENTA D ON D.ID_VENTA = V.ID_VENTA
      GROUP BY V.ID_ESPECTADOR) G ON G.ID_ESPECTADOR = E.ID_ESPECTADOR
WHERE G.TOTAL_GASTADO > (SELECT AVG(T.GASTO)
                         FROM (SELECT SUM(TOTAL) AS GASTO
                               FROM VENTA
                               GROUP BY ID_ESPECTADOR) T)
ORDER BY POSICION, ESPECTADOR;


-- Consultar actores y directores que participan en mas de una pelicula en cartelera
SELECT A.PRIMER_NOMBRE || ' ' || A.PRIMER_APELLIDO AS PERSONA,
       N.NOMBRE AS NACIONALIDAD,
       R.NOMBRE AS ROL,
       COUNT(*) AS PELICULAS,
       STRING_AGG(P.TITULO || COALESCE(' (' || C.PERSONAJE || ')', ''), ', '
                  ORDER BY P.FECHA_ESTRENO) AS PELICULAS_EN_CARTELERA
FROM CONTRATO C
JOIN ACTOR_DIRECTOR A ON A.ID_PERSONA = C.ID_PERSONA
JOIN NACIONALIDAD N ON N.ID_NACIONALIDAD = A.ID_NACIONALIDAD
JOIN ROL R ON R.ID_ROL = C.ID_ROL
JOIN PELICULA P ON P.ID_PELICULA = C.ID_PELICULA
WHERE EXISTS (SELECT 1
              FROM FUNCION F
              WHERE F.ID_PELICULA = C.ID_PELICULA
                AND F.FECHA BETWEEN '2026-10-12' AND '2026-10-18')
GROUP BY A.ID_PERSONA, A.PRIMER_NOMBRE, A.PRIMER_APELLIDO, N.NOMBRE, R.NOMBRE
HAVING COUNT(*) > 1
ORDER BY PELICULAS DESC, PERSONA;
