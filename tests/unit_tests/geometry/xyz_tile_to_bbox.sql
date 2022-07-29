DO
$$
DECLARE
    ret_var GEOMETRY;
BEGIN

    SELECT locaria_core.xyz_tile_to_bbox(16062,11056,15) INTO ret_var;

    RAISE NOTICE '%',ret_var;

    ret_var = ST_TRANSFORM(ret_var, 3857);
    RAISE NOTICE 'BBOX %', ret_var::BOX2D;
    RAISE NOTICE 'xmin %, xmax %, ymin %, ymax %', ST_XMIN(ret_var), ST_XMAX(ret_var), ST_YMIN(ret_var), ST_YMAX(ret_var);

END;
$$