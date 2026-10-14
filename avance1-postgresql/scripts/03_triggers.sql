-- =====================================================================
-- CINE EL OASIS
-- Avance 1 - Nucleo transaccional (PostgreSQL)
-- Script 03: 03_triggers.sql
-- Integrantes: Maria Paula Marin Soler, Justin Felipe Narvaez Gutierrez
-- ---------------------------------------------------------------------
-- Se ejecuta DESPUES de 01_creacion_tablas.sql y ANTES de
-- 02_datos_prueba.sql, para que los triggers calculen HORA_FIN,
-- PRECIO_UNITARIO y TOTAL al cargar los datos.
-- Orden de ejecucion: 01 -> 03 -> 02 -> 04 -> 05
-- =====================================================================


-- Tabla donde se guarda el historial de cambios de las tablas auditadas
CREATE TABLE IF NOT EXISTS LOG_AUDITORIA (
    ID_LOG_AUDITORIA BIGINT GENERATED ALWAYS AS IDENTITY,
    TABLA_AFECTADA VARCHAR(30) NOT NULL,
    OPERACION VARCHAR(10) NOT NULL,
    USUARIO_DE_SESION VARCHAR(60) NOT NULL DEFAULT CURRENT_USER,
    FECHA_HORA TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    DATOS_ANTES JSONB,
    DATOS_DESPUES JSONB,
    CONSTRAINT LOG_AUDITORIA_PK PRIMARY KEY (ID_LOG_AUDITORIA),
    CONSTRAINT LOG_AUDITORIA_OPERACION_CK CHECK (OPERACION IN ('INSERT', 'UPDATE', 'DELETE'))
);


-- Trigger que calcula la hora de fin de la funcion y valida la pelicula,
-- la sala, que termine el mismo dia y los 20 minutos de limpieza
CREATE OR REPLACE FUNCTION fn_funcion_programacion()
RETURNS TRIGGER AS $$
DECLARE
    v_duracion INTEGER;
    v_estado_sala SALA.estado%TYPE;
    v_nombre_sala SALA.nombre%TYPE;
BEGIN
    SELECT duracion_min
    INTO v_duracion
    FROM pelicula
    WHERE id_pelicula = NEW.id_pelicula;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'La pelicula con id % no existe', NEW.id_pelicula
        USING HINT = 'verifique el id que esta ingresando';
    END IF;

    SELECT estado, nombre
    INTO v_estado_sala, v_nombre_sala
    FROM sala
    WHERE id_sala = NEW.id_sala;

    IF v_estado_sala = 'MANTENIMIENTO' THEN
        RAISE EXCEPTION 'La sala % se encuentra en mantenimiento', v_nombre_sala
        USING HINT = 'Utilice otra sala o espere a que termine el mantenimiento de la sala que esta buscando';
    END IF;

    NEW.HORA_FIN := NEW.HORA_INICIO + make_interval(mins => v_duracion);

    IF NEW.HORA_FIN <= NEW.HORA_INICIO THEN
        RAISE EXCEPTION 'La funcion de % min no cabe en el dia: empieza a las % y terminaria a las % del dia siguiente',
            v_duracion, NEW.HORA_INICIO, NEW.HORA_FIN
        USING HINT = 'Adelante la hora de inicio o programe la pelicula mas temprano';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM funcion f
        WHERE f.id_sala = NEW.id_sala
          AND f.id_funcion <> NEW.id_funcion
          AND f.fecha = NEW.fecha
          AND f.hora_fin + make_interval(mins => 20) > NEW.hora_inicio
          AND f.hora_inicio < NEW.hora_fin + make_interval(mins => 20)
    ) THEN
        RAISE EXCEPTION 'La funcion que empieza a las % no deja un intervalo de 20 minutos minimos para poder agregarse.',
            NEW.hora_inicio
        USING HINT = 'Agregue la funcion unos minutos mas tarde';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Se ejecuta antes de guardar una funcion nueva o modificada
CREATE OR REPLACE TRIGGER trg_funcion_programacion
BEFORE INSERT OR UPDATE ON FUNCION
FOR EACH ROW
EXECUTE FUNCTION fn_funcion_programacion();


-- Trigger que guarda en LOG_AUDITORIA cada insercion, actualizacion
-- o eliminacion, con los datos de antes y de despues
CREATE OR REPLACE FUNCTION fn_auditoria()
RETURNS TRIGGER AS $$
DECLARE
    v_antes JSONB;
    v_despues JSONB;
BEGIN
    IF TG_OP = 'INSERT' THEN
        v_antes := NULL;
        v_despues := to_jsonb(NEW);
    ELSIF TG_OP = 'UPDATE' THEN
        v_antes := to_jsonb(OLD);
        v_despues := to_jsonb(NEW);
    ELSE -- DELETE
        v_antes := to_jsonb(OLD);
        v_despues := NULL;
    END IF;

    INSERT INTO LOG_AUDITORIA (TABLA_AFECTADA, OPERACION, USUARIO_DE_SESION,
                               DATOS_ANTES, DATOS_DESPUES)
    VALUES (TG_TABLE_NAME, TG_OP, CURRENT_USER, v_antes, v_despues);

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Tabla contrato que se audita con fn_auditoria
CREATE OR REPLACE TRIGGER trg_auditoria_contrato
AFTER INSERT OR UPDATE OR DELETE ON CONTRATO
FOR EACH ROW
EXECUTE FUNCTION fn_auditoria();

-- Tabla tipo_boleta que se audita con fn_auditoria.
CREATE OR REPLACE TRIGGER trg_auditoria_tipo_boleta
AFTER INSERT OR UPDATE OR DELETE ON TIPO_BOLETA
FOR EACH ROW
EXECUTE FUNCTION fn_auditoria();

-- Tabla venta que se audita con fn_auditoria.
CREATE OR REPLACE TRIGGER trg_auditoria_venta
AFTER INSERT OR UPDATE OR DELETE ON VENTA
FOR EACH ROW
EXECUTE FUNCTION fn_auditoria();

-- Tabla staff que se audita con fn_auditoria.
CREATE OR REPLACE TRIGGER trg_auditoria_staff
AFTER INSERT OR UPDATE OR DELETE ON STAFF
FOR EACH ROW
EXECUTE FUNCTION fn_auditoria();


-- Trigger que recalcula el total de la venta cada vez que se agrega,
-- cambia o elimina una boleta del detalle
CREATE OR REPLACE FUNCTION fn_detalle_venta_total()
RETURNS TRIGGER AS $$
DECLARE
   v_id_venta INTEGER;
BEGIN
   IF TG_OP = 'DELETE' THEN
       v_id_venta := OLD.ID_VENTA;
   ELSE
       v_id_venta := NEW.ID_VENTA;
   END IF;
   UPDATE VENTA
      SET TOTAL = (SELECT COALESCE(SUM(CANTIDAD * PRECIO_UNITARIO), 0)
                     FROM DETALLE_VENTA
                    WHERE ID_VENTA = v_id_venta)
    WHERE ID_VENTA = v_id_venta;
   RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_detalle_venta_total ON DETALLE_VENTA;
CREATE TRIGGER trg_detalle_venta_total
AFTER INSERT OR UPDATE OR DELETE ON DETALLE_VENTA
FOR EACH ROW
EXECUTE FUNCTION fn_detalle_venta_total();


-- Trigger que valida la boleta (tipo de sala, aforo y maximo 10 por compra)
-- y calcula su precio, con 50% de descuento si se compra un miercoles para 
-- una funcion de ese mismo miercoles
CREATE OR REPLACE FUNCTION fn_detalle_venta_boleta()
RETURNS TRIGGER AS $$
DECLARE
    v_compra TIMESTAMP;
    v_id_funcion INTEGER;
    v_fecha_funcion DATE;
    v_capacidad INTEGER;
    v_tipo_sala INTEGER;
    v_tipo_boleta INTEGER;
    v_precio_base NUMERIC(10,2);
    v_vendidas INTEGER;
    v_en_compra INTEGER;
BEGIN
    -- Datos de la venta, su funcion y su sala
    SELECT V.FECHA_HORA, F.ID_FUNCION, F.FECHA, S.CAPACIDAD, S.ID_TIPO_SALA
    INTO v_compra, v_id_funcion, v_fecha_funcion, v_capacidad, v_tipo_sala
    FROM VENTA V
    JOIN FUNCION F ON F.ID_FUNCION = V.ID_FUNCION
    JOIN SALA S ON S.ID_SALA = F.ID_SALA
    WHERE V.ID_VENTA = NEW.ID_VENTA;

    -- Datos del tipo de boleta
    SELECT ID_TIPO_SALA, PRECIO_BASE
    INTO v_tipo_boleta, v_precio_base
    FROM TIPO_BOLETA
    WHERE ID_TIPO_BOLETA = NEW.ID_TIPO_BOLETA;

    -- 1. La boleta debe ser del mismo tipo de sala de la funcion
    IF v_tipo_boleta <> v_tipo_sala THEN
        RAISE EXCEPTION 'El tipo de boleta % no corresponde al tipo de sala de la funcion %',
            NEW.ID_TIPO_BOLETA, v_id_funcion
        USING HINT = 'Elija un tipo de boleta de la misma sala de la funcion';
    END IF;

    -- 2. No se puede superar la capacidad de la sala
    SELECT COALESCE(SUM(D.CANTIDAD), 0)
    INTO v_vendidas
    FROM DETALLE_VENTA D
    JOIN VENTA V ON V.ID_VENTA = D.ID_VENTA
    WHERE V.ID_FUNCION = v_id_funcion
    AND NOT (
        TG_OP = 'UPDATE'
        AND D.ID_VENTA = OLD.ID_VENTA
        AND D.ID_TIPO_BOLETA = OLD.ID_TIPO_BOLETA
    );

    IF v_vendidas + NEW.CANTIDAD > v_capacidad THEN
        RAISE EXCEPTION 'Aforo superado en la funcion %: capacidad %, vendidas %, solicitadas %',
            v_id_funcion, v_capacidad, v_vendidas, NEW.CANTIDAD
        USING HINT = 'Reduzca la cantidad de boletas o elija otra funcion';
    END IF;

    -- 3. Maximo 10 boletas por compra
    SELECT COALESCE(SUM(CANTIDAD), 0)
    INTO v_en_compra
    FROM DETALLE_VENTA
    WHERE ID_VENTA = NEW.ID_VENTA
    AND NOT (
        TG_OP = 'UPDATE'
        AND ID_VENTA = OLD.ID_VENTA
        AND ID_TIPO_BOLETA = OLD.ID_TIPO_BOLETA
    );

    IF v_en_compra + NEW.CANTIDAD > 10 THEN
        RAISE EXCEPTION 'La venta % superaria el maximo de 10 boletas por compra (ya tiene %, se agregan %)',
            NEW.ID_VENTA, v_en_compra, NEW.CANTIDAD
        USING HINT = 'Haga una compra nueva para las boletas restantes';
    END IF;

    -- 4. Precio: 50% de descuento si la compra es un miercoles
    -- y la funcion es ese mismo dia
    IF EXTRACT(ISODOW FROM v_compra) = 3
       AND v_compra::DATE = v_fecha_funcion THEN
        NEW.PRECIO_UNITARIO := ROUND(v_precio_base * 0.5, 2);
    ELSE
        NEW.PRECIO_UNITARIO := v_precio_base;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Se ejecuta antes de guardar cada boleta nueva o modificada
CREATE OR REPLACE TRIGGER trg_detalle_venta_boleta
BEFORE INSERT OR UPDATE ON DETALLE_VENTA
FOR EACH ROW
EXECUTE FUNCTION fn_detalle_venta_boleta();


-- Trigger que valida la venta, no se vende para una funcion que ya empezo
-- y en taquilla la venta la debe registrar un empleado ACTIVO
CREATE OR REPLACE FUNCTION fn_venta_validar()
RETURNS TRIGGER AS $$
DECLARE
    v_inicio TIMESTAMP;
    v_estado STAFF.ESTADO%TYPE;
BEGIN
    -- Fecha y hora en que empieza la funcion
    SELECT FECHA + HORA_INICIO
      INTO v_inicio
    FROM FUNCION
    WHERE ID_FUNCION = NEW.ID_FUNCION;
 
    IF NOT FOUND THEN
        RAISE EXCEPTION 'La funcion % no existe', NEW.ID_FUNCION
        USING HINT = 'Verifique el id de la funcion';
    END IF;
 
    -- 1. No se venden boletas para una funcion que ya empezo
    IF NEW.FECHA_HORA >= v_inicio THEN
        RAISE EXCEPTION 'No se pueden vender boletas para la funcion %: inicio el % y la compra es del %',
            NEW.ID_FUNCION, v_inicio, NEW.FECHA_HORA
        USING HINT = 'Elija una funcion que aun no haya empezado';
    END IF;
 
    -- 2. En taquilla la venta la registra un empleado ACTIVO
    IF NEW.CANAL = 'TAQUILLA' THEN
        IF NEW.ID_STAFF IS NULL THEN
            RAISE EXCEPTION 'Una venta en TAQUILLA debe indicar el empleado que la registra'
            USING HINT = 'Ingrese el ID_STAFF del empleado';
        END IF;
 
        SELECT ESTADO
          INTO v_estado
        FROM STAFF
        WHERE ID_STAFF = NEW.ID_STAFF;
 
        IF v_estado IS DISTINCT FROM 'ACTIVO' THEN
            RAISE EXCEPTION 'El empleado % no esta ACTIVO y no puede registrar ventas en taquilla', NEW.ID_STAFF
            USING HINT = 'La venta la debe registrar un empleado activo';
        END IF;
    END IF;
 
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
 
-- Se ejecuta antes de guardar una venta nueva o cuando cambian su fecha, funcion, empleado o canal.
CREATE OR REPLACE TRIGGER trg_venta_validar
BEFORE INSERT OR UPDATE OF FECHA_HORA, ID_FUNCION, ID_STAFF, CANAL ON VENTA
FOR EACH ROW
EXECUTE FUNCTION fn_venta_validar();
 

-- Trigger que protege las funciones programadas una sala con funciones 
-- futuras no pasa a MANTENIMIENTO y su capacidad no puede quedar por 
-- debajo de las boletas ya vendidas.
CREATE OR REPLACE FUNCTION fn_sala_proteger()
RETURNS TRIGGER AS $$
DECLARE
    v_futuras  INTEGER;
    v_vendidas INTEGER;
BEGIN
    -- 1. No pasar a MANTENIMIENTO si la sala tiene funciones futuras
    IF NEW.ESTADO = 'MANTENIMIENTO' AND OLD.ESTADO = 'ACTIVA' THEN
        SELECT COUNT(*)
          INTO v_futuras
        FROM FUNCION
        WHERE ID_SALA = NEW.ID_SALA
          AND FECHA + HORA_INICIO > CURRENT_TIMESTAMP;
 
        IF v_futuras > 0 THEN
            RAISE EXCEPTION 'La sala % tiene % funcion(es) futura(s) programada(s); no puede pasar a MANTENIMIENTO',
                NEW.NOMBRE, v_futuras
            USING HINT = 'Reprograme o cancele esas funciones antes del mantenimiento';
        END IF;
    END IF;
 
    -- 2. No reducir la capacidad por debajo de las boletas vendidas en una funcion futura
    IF NEW.CAPACIDAD < OLD.CAPACIDAD THEN
        SELECT COALESCE(MAX(T.VENDIDAS), 0)
          INTO v_vendidas
        FROM (
            SELECT F.ID_FUNCION, SUM(D.CANTIDAD) AS VENDIDAS
            FROM FUNCION F
            JOIN VENTA V         ON V.ID_FUNCION = F.ID_FUNCION
            JOIN DETALLE_VENTA D ON D.ID_VENTA   = V.ID_VENTA
            WHERE F.ID_SALA = NEW.ID_SALA
              AND F.FECHA + F.HORA_INICIO > CURRENT_TIMESTAMP
            GROUP BY F.ID_FUNCION
        ) T;
 
        IF NEW.CAPACIDAD < v_vendidas THEN
            RAISE EXCEPTION 'No se puede reducir la capacidad de la sala % a %: una funcion futura ya tiene % boletas vendidas',
                NEW.NOMBRE, NEW.CAPACIDAD, v_vendidas
            USING HINT = 'La capacidad debe ser mayor o igual a las boletas ya vendidas';
        END IF;
    END IF;
 
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
 
-- Se ejecuta antes de cambiar el estado o la capacidad de una sala.
CREATE OR REPLACE TRIGGER trg_sala_proteger
BEFORE UPDATE OF ESTADO, CAPACIDAD ON SALA
FOR EACH ROW
EXECUTE FUNCTION fn_sala_proteger();


-- Trigger que valida el contrato: un ACTOR debe tener personaje, un DIRECTOR no,
-- y el contrato debe iniciar antes del estreno de la pelicula.
CREATE OR REPLACE FUNCTION fn_contrato_validar()
RETURNS TRIGGER AS $$
DECLARE
    v_rol     ROL.NOMBRE%TYPE;
    v_estreno PELICULA.FECHA_ESTRENO%TYPE;
BEGIN
    -- Rol del contrato y fecha de estreno de la pelicula
    SELECT UPPER(NOMBRE)
      INTO v_rol
    FROM ROL
    WHERE ID_ROL = NEW.ID_ROL;

    SELECT FECHA_ESTRENO
      INTO v_estreno
    FROM PELICULA
    WHERE ID_PELICULA = NEW.ID_PELICULA;

    -- Un personaje vacio o solo con espacios se guarda como NULL
    NEW.PERSONAJE := NULLIF(TRIM(NEW.PERSONAJE), '');

    -- 1. ACTOR con personaje, DIRECTOR sin personaje
    IF v_rol = 'ACTOR' AND NEW.PERSONAJE IS NULL THEN
        RAISE EXCEPTION 'Un contrato de ACTOR debe indicar el personaje'
        USING HINT = 'Ingrese el nombre del personaje que interpreta';
    ELSIF v_rol = 'DIRECTOR' AND NEW.PERSONAJE IS NOT NULL THEN
        RAISE EXCEPTION 'Un contrato de DIRECTOR no lleva personaje (se recibio "%")', NEW.PERSONAJE
        USING HINT = 'Deje el personaje vacio para los directores';
    END IF;

    -- 2. El contrato inicia antes del estreno
    IF NEW.FECHA_INICIO >= v_estreno THEN
        RAISE EXCEPTION 'El contrato debe iniciar antes del estreno de la pelicula (estreno: %, inicio: %)',
            v_estreno, NEW.FECHA_INICIO
        USING HINT = 'Revise la fecha de inicio del contrato';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Se ejecuta antes de guardar un contrato nuevo o modificado.
CREATE OR REPLACE TRIGGER trg_contrato_validar
BEFORE INSERT OR UPDATE ON CONTRATO
FOR EACH ROW
EXECUTE FUNCTION fn_contrato_validar();