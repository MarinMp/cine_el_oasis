-- =====================================================================
-- CINE EL OASIS
-- Avance 1 - Nucleo transaccional (PostgreSQL)
-- Script 04: 04_procedimientos.sql
-- Integrantes: Maria Paula Marin Soler, Justin Felipe Narvaez Gutierrez
-- ---------------------------------------------------------------------
-- Se ejecuta DESPUES de 02_datos_prueba.sql.
-- Orden de ejecucion: 01 -> 03 -> 02 -> 04 -> 05
-- =====================================================================

-- Procedimiento 1 (calculo / transaccion)
-- Reprograma la funcion mas vendida de la semana en el fin de semana
-- siguiente
CREATE OR REPLACE PROCEDURE sp_reprogramar_funcion_mas_vendida(
    p_inicio_semana DATE,
    p_final_de_semana DATE,
    INOUT p_nueva_fecha DATE
) AS $$
DECLARE
    funcionMasVista RECORD;
    v_nueva_funcion INTEGER;
    v_asignaciones INTEGER;
BEGIN

    IF p_inicio_semana IS NULL OR p_final_de_semana IS NULL OR p_nueva_fecha IS NULL THEN
        RAISE EXCEPTION 'Debe indicar el inicio y el fin de la semana y la nueva fecha'
        USING HINT = 'Ejemplo: CALL sp_reprogramar_funcion_mas_vendida(''2026-10-12'', ''2026-10-18'', ''2026-10-24'');';
    END IF;
 
    IF p_inicio_semana > p_final_de_semana THEN
        RAISE EXCEPTION 'Periodo invalido: el inicio (%) es posterior al fin (%)',
            p_inicio_semana, p_final_de_semana
        USING HINT = 'Revise el orden de las fechas';
    END IF;
 
    -- La funcion solo se reprograma un sabado (6) o domingo (7)
    IF EXTRACT(ISODOW FROM p_nueva_fecha) NOT IN (6, 7) THEN
        RAISE EXCEPTION 'La nueva fecha % no es sabado ni domingo', p_nueva_fecha
        USING HINT = 'La funcion mas vendida solo se reprograma para el fin de semana';
    END IF;
 
    -- Debe ser el fin de semana siguiente a la semana analizada
    IF p_nueva_fecha <= p_final_de_semana OR p_nueva_fecha > p_final_de_semana + 7 THEN
        RAISE EXCEPTION 'La nueva fecha % no corresponde al fin de semana siguiente a la semana del % al %',
            p_nueva_fecha, p_inicio_semana, p_final_de_semana
        USING HINT = 'Elija el sabado o domingo inmediatamente posterior a la semana analizada';
    END IF;
 
    -- Funcion con mas boletas vendidas en la semana
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
    ORDER BY SUM(dv.cantidad) DESC, f.id_funcion ASC
    LIMIT 1;
 
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No hubo ventas entre % y %',
            p_inicio_semana, p_final_de_semana
        USING HINT = 'Elija una semana con funciones y boletas vendidas';
    END IF;
 
    RAISE NOTICE 'Funcion % del % a las % -> % boletas vendidas',
        funcionMasVista.id_funcion,
        funcionMasVista.fecha,
        funcionMasVista.hora_inicio,
        funcionMasVista.boletas_vendidas;
 
    BEGIN
        -- HORA_FIN se envia en 00:00 porque el trigger trg_funcion_programacion
        -- la calcula y valida la sala y los 20 minutos de limpieza
        INSERT INTO funcion (fecha, hora_inicio, hora_fin,
                             version_proyeccion, id_pelicula, id_sala)
        VALUES (p_nueva_fecha,
                funcionMasVista.hora_inicio,
                TIME '00:00',
                funcionMasVista.version_proyeccion,
                funcionMasVista.id_pelicula,
                funcionMasVista.id_sala)
        RETURNING id_funcion INTO v_nueva_funcion;
 
        -- La nueva funcion queda con el mismo personal de la original
        INSERT INTO asignacion (id_funcion, id_staff, tarea)
        SELECT v_nueva_funcion, a.id_staff, a.tarea
          FROM asignacion a
         WHERE a.id_funcion = funcionMasVista.id_funcion;
        GET DIAGNOSTICS v_asignaciones = ROW_COUNT;
    EXCEPTION
        WHEN raise_exception THEN
            RAISE EXCEPTION 'No se pudo reprogramar: %', SQLERRM;
        WHEN OTHERS THEN
            RAISE EXCEPTION 'Error desconocido [%]: %', SQLSTATE, SQLERRM;
    END;
 
    -- Cada funcion debe tener al menos un empleado asignado.
    -- Si la original no tenia personal, se cancela toda la operacion.
    IF v_asignaciones = 0 THEN
        RAISE EXCEPTION 'La funcion % no tiene personal asignado para copiar a la nueva funcion',
            funcionMasVista.id_funcion
        USING HINT = 'Asigne al menos un empleado a la funcion original en ASIGNACION';
    END IF;
 
    RAISE NOTICE 'Reprogramada la funcion % como funcion % para el % (% empleado(s) asignado(s))',
        funcionMasVista.id_funcion, v_nueva_funcion, p_nueva_fecha, v_asignaciones;
END;
$$ LANGUAGE plpgsql;

-- Procedimiento 2 (mantenimiento / operacion)
-- Retira de cartelera la pelicula menos vista de la semana.
CREATE OR REPLACE PROCEDURE sp_retirar_pelicula_menos_vista(
    p_inicio DATE,
    p_fin DATE
) AS $$
DECLARE
    peliculaMenosVista RECORD;
    v_retiradas INTEGER;
    v_asignaciones INTEGER;
BEGIN
    IF p_inicio IS NULL OR p_fin IS NULL THEN
        RAISE EXCEPTION 'Debe indicar la fecha de inicio y la fecha de fin del periodo'
        USING HINT = 'Ejemplo: CALL sp_retirar_pelicula_menos_vista(''2026-10-12'', ''2026-10-18'');';
    END IF;
 
    IF p_inicio > p_fin THEN
        RAISE EXCEPTION 'La fecha de inicio (%) no puede ser posterior a la fecha fin (%)',
            p_inicio, p_fin
        USING HINT = 'Revise el orden de las fechas';
    END IF;
 
    -- Pelicula con menos boletas vendidas entre las que tuvieron
    -- funciones en el periodo
    SELECT p.id_pelicula,
           p.titulo,
           COALESCE(SUM(dv.cantidad), 0) AS numero_boletas
    INTO peliculaMenosVista
    FROM pelicula p
    INNER JOIN funcion f ON  f.id_pelicula = p.id_pelicula
                         AND f.fecha BETWEEN p_inicio AND p_fin
    LEFT JOIN  venta v ON  v.id_funcion = f.id_funcion
    LEFT JOIN  detalle_venta dv ON  dv.id_venta = v.id_venta
    GROUP BY p.id_pelicula, p.titulo
    ORDER BY COALESCE(SUM(dv.cantidad), 0) ASC, p.id_pelicula ASC
    LIMIT 1;
 
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No hay funciones programadas entre % y %', p_inicio, p_fin
        USING HINT = 'Elija un periodo con funciones en la cartelera';
    END IF;
 
    RAISE NOTICE 'Menos vista entre % y %: "%" con % boletas',
        p_inicio, p_fin, peliculaMenosVista.titulo, peliculaMenosVista.numero_boletas;
 
    -- No se cancela nada si alguna funcion futura ya tiene ventas
    IF EXISTS (SELECT 1
                 FROM funcion f
                 INNER JOIN venta v ON v.id_funcion = f.id_funcion
                WHERE f.id_pelicula = peliculaMenosVista.id_pelicula
                  AND f.fecha > CURRENT_DATE) THEN
        RAISE EXCEPTION 'No se puede retirar "%": tiene funciones futuras con boletas vendidas',
            peliculaMenosVista.titulo
        USING HINT = 'Espere a que pasen esas funciones o gestione primero sus ventas';
    END IF;
 
    BEGIN
        -- Liberar el personal asignado a las funciones futuras
        DELETE FROM asignacion
         WHERE id_funcion IN (SELECT id_funcion
                                FROM funcion
                               WHERE id_pelicula = peliculaMenosVista.id_pelicula
                                 AND fecha > CURRENT_DATE);
        GET DIAGNOSTICS v_asignaciones = ROW_COUNT;
 
        -- Cancelar las funciones futuras
        DELETE FROM funcion
         WHERE id_pelicula = peliculaMenosVista.id_pelicula
           AND fecha > CURRENT_DATE;
        GET DIAGNOSTICS v_retiradas = ROW_COUNT;
    EXCEPTION
        WHEN foreign_key_violation THEN
            RAISE EXCEPTION 'No se pudo retirar "%": una funcion futura sigue referenciada por otra tabla (%)',
                peliculaMenosVista.titulo, SQLERRM;
        WHEN OTHERS THEN
            RAISE EXCEPTION 'Error inesperado [%]: %', SQLSTATE, SQLERRM;
    END;
 
    IF v_retiradas = 0 THEN
        RAISE NOTICE '"%" no tenia funciones futuras programadas, no se cancelo ninguna',
            peliculaMenosVista.titulo;
    ELSE
        RAISE NOTICE 'Retirada de cartelera "%": % funcion(es) futura(s) cancelada(s) y % asignacion(es) de personal liberada(s)',
            peliculaMenosVista.titulo, v_retiradas, v_asignaciones;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Procedimiento 3 (reporte con agregacion)
-- Reporte de ventas por pelicula en un periodo: funciones, boletas, 
-- dinero recaudado, descuento del miercoles y boletas vendidas en taquilla y en linea.
CREATE OR REPLACE PROCEDURE sp_reporte_ventas_pelicula(
    p_inicio DATE,
    p_fin DATE,
    INOUT p_cursor REFCURSOR DEFAULT 'rpt_ventas'
) AS $$
BEGIN
    IF p_inicio IS NULL OR p_fin IS NULL THEN
        RAISE EXCEPTION 'Debe indicar la fecha de inicio y la fecha de fin del periodo'
        USING HINT = 'Ejemplo: CALL sp_reporte_ventas_pelicula(''2026-10-12'', ''2026-10-18'', ''rpt_ventas'');';
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
        OPEN p_cursor FOR
        SELECT P.TITULO::TEXT AS PELICULA,
               COUNT(DISTINCT F.ID_FUNCION) AS FUNCIONES,
               COALESCE(SUM(D.CANTIDAD), 0)::BIGINT AS BOLETAS,
               COALESCE(SUM(D.CANTIDAD * D.PRECIO_UNITARIO), 0) AS RECAUDO,
               COALESCE(SUM(D.CANTIDAD * D.PRECIO_UNITARIO)
                   FILTER (WHERE EXTRACT(ISODOW FROM V.FECHA_HORA) = 3
                   AND V.FECHA_HORA::DATE = F.FECHA), 0) AS DESCUENTO_MIERCOLES,
               COALESCE(SUM(D.CANTIDAD) FILTER (WHERE V.CANAL = 'TAQUILLA'), 0)::BIGINT AS BOLETAS_TAQUILLA,
               COALESCE(SUM(D.CANTIDAD) FILTER (WHERE V.CANAL = 'EN LINEA'), 0)::BIGINT AS BOLETAS_EN_LINEA
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
 
    RAISE NOTICE 'Reporte de ventas del % al % listo en el cursor "%"', p_inicio, p_fin, p_cursor;
END;
$$ LANGUAGE plpgsql;
