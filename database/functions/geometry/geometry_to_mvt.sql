CREATE OR REPLACE FUNCTION locaria_core.geometry_to_mvt(table_var TEXT, bounds_var GEOMETRY) RETURNS bytea AS
$$
DECLARE
    ret_var bytea;
BEGIN

    --table/view must have wkb_geometry column and attributes column
    EXECUTE format(
        $SQL$
            WITH BBOX AS (
                SELECT $1 AS geom,
                ST_TRANSFORM($1,3857)::BOX2D AS bounds

            ), MVTGEOM AS (

                SELECT ST_AsMVTGeom(ST_TRANSFORM(wkb_geometry, 3857), bounds) AS geom,
                       attributes
                FROM %s,BBOX
                WHERE ST_INTERSECTS(wkb_geometry, $1)
            ) SELECT ST_AsMVT(MVTGEOM.*) FROM MVTGEOM
        $SQL$, table_var)
    USING
        bounds_var
    INTO ret_var;

    RETURN ret_var;
END;
$$ LANGUAGE PLPGSQL;