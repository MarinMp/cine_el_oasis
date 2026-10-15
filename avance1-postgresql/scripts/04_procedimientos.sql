-- =====================================================================
-- CINE EL OASIS
-- Avance 1 - Nucleo transaccional (PostgreSQL)
-- Script 04: 04_procedimientos.sql
-- Integrantes: Maria Paula Marin Soler, Justin Felipe Narvaez Gutierrez
-- ---------------------------------------------------------------------
-- Se ejecuta DESPUES de 02_datos_prueba.sql.
-- Orden de ejecucion: 01 -> 03 -> 02 -> 04 -> 05
-- =====================================================================


-- Procedimiento que reprograma la funcion mas vendida de la 
-- semana en el fin de semana.
CREATE OR REPLACE PROCEDURE sp_reprogramar_funcion_mas_vendida(
    p_inicio_semana DATE,
    p_final_de_semana DATE,
    INOUT p_nueva_fecha DATE
) AS $$
DECLARE
    funcionMasVista RECORD;
BEGIN
    SELECT f.id_funcion,
           f.fecha,
           f.hora_inicio,
           f.id_pelicula,
           f.id_sala,
           f.version_proyeccion,
           SUM(dv.cantidad) AS boletas_vendidas
    INTO funcionMasVista
    FROM funcion f
    INNER JOIN venta v  ON v.id_funcion = f.id_funcion
    INNER JOIN detalle_venta dv ON dv.id_venta  = v.id_venta
    WHERE f.fecha BETWEEN p_inicio_semana AND p_final_de_semana
    GROUP BY f.id_funcion, f.fecha, f.hora_inicio, f.id_pelicula,
                  f.id_sala, f.version_proyeccion
    ORDER BY SUM(dv.cantidad) DESC
    LIMIT 1;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No hubo ventas entre % y %',
            p_inicio_semana, p_final_de_semana;
    END IF;
    RAISE NOTICE 'Funcion % del % a las % -> % boletas vendidas',
        funcionMasVista.id_funcion,
        funcionMasVista.fecha,
        funcionMasVista.hora_inicio,
        funcionMasVista.boletas_vendidas;
    BEGIN
        INSERT INTO funcion (fecha, hora_inicio, hora_fin,
                             version_proyeccion, id_pelicula, id_sala)
        VALUES (p_nueva_fecha,
                funcionMasVista.hora_inicio,
                TIME '00:00',
                funcionMasVista.version_proyeccion,
                funcionMasVista.id_pelicula,
                funcionMasVista.id_sala);
    EXCEPTION
        WHEN raise_exception THEN
            RAISE EXCEPTION 'No se pudo reprogramar: %', SQLERRM;
        WHEN OTHERS THEN
            RAISE EXCEPTION 'Error desconocido [%]: %', SQLSTATE, SQLERRM;
    END;
    RAISE NOTICE 'Reprogramada la funcion % para el %',
        funcionMasVista.id_funcion, p_nueva_fecha;
END;
$$ LANGUAGE plpgsql;


-- Procedimiento que retira de cartelera la pelicula menos vista 
-- de la semana.
CREATE OR REPLACE PROCEDURE sp_retirar_pelicula_menos_vista(
    p_inicio DATE,
    p_fin DATE
) AS $$
DECLARE
    peliculaMenosVista RECORD;
    v_retiradas INTEGER;
BEGIN
    IF p_inicio > p_fin THEN
        RAISE EXCEPTION 'La fecha de inicio (%) no puede ser posterior a la fecha fin (%)',
            p_inicio, p_fin;
    END IF;
    SELECT p.id_pelicula,
           p.titulo,
           COALESCE(SUM(dv.cantidad), 0) AS numero_ventas
    INTO peliculaMenosVista
    FROM pelicula p
    LEFT JOIN funcion f ON  p.id_pelicula = f.id_pelicula
                        AND f.fecha BETWEEN p_inicio AND p_fin
    LEFT JOIN  venta v ON  v.id_funcion = f.id_funcion
    LEFT JOIN  detalle_venta dv ON  dv.id_venta = v.id_venta
    GROUP BY p.id_pelicula, p.titulo
    ORDER BY COALESCE(SUM(dv.cantidad), 0) ASC, p.id_pelicula ASC
    LIMIT 1;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No hay peliculas en el catalogo';
    END IF;
    RAISE NOTICE 'Menos vista entre % y %: "%" con % boletas',
        p_inicio, p_fin, peliculaMenosVista.titulo, peliculaMenosVista.numero_ventas;
    IF EXISTS (SELECT 1
                 FROM funcion f
                 INNER JOIN venta   v ON v.id_funcion = f.id_funcion
                WHERE f.id_pelicula = peliculaMenosVista.id_pelicula
                  AND f.fecha > CURRENT_DATE) THEN
        RAISE EXCEPTION 'No se puede retirar "%": tiene funciones futuras con boletas vendidas',
            peliculaMenosVista.titulo;
    END IF;
    BEGIN
        DELETE FROM funcion
         WHERE id_pelicula = peliculaMenosVista.id_pelicula
           AND fecha > CURRENT_DATE;
        GET DIAGNOSTICS v_retiradas = ROW_COUNT;
    EXCEPTION
        WHEN foreign_key_violation THEN
            RAISE EXCEPTION 'No se pudo retirar "%": alguna funcion futura tiene ventas asociadas',
                peliculaMenosVista.titulo;
        WHEN OTHERS THEN
            RAISE EXCEPTION 'Error inesperado [%]: %', SQLSTATE, SQLERRM;
    END;
    RAISE NOTICE 'Retirada de cartelera "%": % funcion(es) futura(s) cancelada(s)',
        peliculaMenosVista.titulo, v_retiradas;
END;
$$ LANGUAGE plpgsql;


-- Reporte de ventas por pelicula en un periodo: funciones, boletas, 
-- dinero recaudado, descuento del miercoles y boletas vendidas en taquilla y en linea.
CREATE OR REPLACE FUNCTION fn_reporte_ventas_pelicula(p_inicio DATE, p_fin DATE)
RETURNS TABLE (
    PELICULA TEXT,
    FUNCIONES BIGINT,
    BOLETAS BIGINT,
    RECAUDO NUMERIC,
    DESCUENTO_MIERCOLES NUMERIC,
    BOLETAS_TAQUILLA BIGINT,
    BOLETAS_EN_LINEA BIGINT
) AS $$
BEGIN
    IF p_inicio IS NULL OR p_fin IS NULL THEN
        RAISE EXCEPTION 'Debe indicar la fecha de inicio y la fecha de fin del periodo'
        USING HINT = 'Ejemplo: SELECT * FROM fn_reporte_ventas_pelicula(''2026-10-12'', ''2026-10-18'');';
    END IF;

    IF p_inicio > p_fin THEN
        RAISE EXCEPTION 'Periodo invalido: la fecha de inicio (%) es posterior a la fecha de fin (%)', p_inicio, p_fin
        USING HINT = 'Revise el orden de las fechas';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM FUNCION WHERE FECHA BETWEEN p_inicio AND p_fin) THEN
        RAISE EXCEPTION 'No hay funciones programadas entre el % y el %', p_inicio, p_fin
        USING HINT = 'Elija un periodo con funciones en la cartelera';
    END IF;

    BEGIN
        RETURN QUERY
        SELECT P.TITULO::TEXT,
               COUNT(DISTINCT F.ID_FUNCION),
               COALESCE(SUM(D.CANTIDAD), 0)::BIGINT,
               COALESCE(SUM(D.CANTIDAD * D.PRECIO_UNITARIO), 0),
               COALESCE(SUM(D.CANTIDAD * D.PRECIO_UNITARIO)
                   FILTER (WHERE EXTRACT(ISODOW FROM V.FECHA_HORA) = 3
                   AND V.FECHA_HORA::DATE = F.FECHA), 0),
               COALESCE(SUM(D.CANTIDAD) FILTER (WHERE V.CANAL = 'TAQUILLA'), 0)::BIGINT,
               COALESCE(SUM(D.CANTIDAD) FILTER (WHERE V.CANAL = 'EN LINEA'), 0)::BIGINT
        FROM PELICULA P
        JOIN FUNCION F ON F.ID_PELICULA = P.ID_PELICULA
            AND F.FECHA BETWEEN p_inicio AND p_fin
        LEFT JOIN VENTA V ON V.ID_FUNCION = F.ID_FUNCION
        LEFT JOIN DETALLE_VENTA D ON D.ID_VENTA = V.ID_VENTA
        GROUP BY P.ID_PELICULA, P.TITULO
        ORDER BY 4 DESC, 1;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE EXCEPTION 'No se pudo generar el reporte de ventas: %', SQLERRM;
    END;
END;
$$ LANGUAGE plpgsql;