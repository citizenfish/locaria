CREATE OR REPLACE FUNCTION locaria_core.get_vector_tile(tablename TEXT, x INTEGER, y INTEGER, z INTEGER, tilecache BOOLEAN DEFAULT FALSE) RETURNS BYTEA AS
$$
DECLARE
    ret_var BYTEA;
BEGIN
    SET SEARCH_PATH = 'locaria_core', 'public';

    IF tablename IS NULL THEN
        RAISE NOTICE 'Missing table  %',tablename;
        RETURN NULL;
    END IF;

    IF tilecache THEN
        SELECT tile
        INTO ret_var
        FROM tilecache T
        WHERE tileset = tablename
        AND x = x_val
        AND y = y_val
        AND z = z_val
        AND expiry > now();

        IF ret_var IS NOT NULL THEN
            RETURN ret_var;
        END IF;

    END IF;

    SELECT geometry_to_mvt(tablename, xyz_tile_to_bbox(x,y,z))
    INTO ret_var;

    IF tilecache THEN
        --Tiles default to a year in cache
        INSERT INTO tilecache(tile,tileset,x_val,y_val,z_val)
        SELECT ret_var, tablename,x,y,z;
    END IF;

    RETURN ret_var;

END;
$$ LANGUAGE PLPGSQL;