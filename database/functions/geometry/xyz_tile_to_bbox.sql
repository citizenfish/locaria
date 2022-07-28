CREATE OR REPLACE FUNCTION locaria_core.xyz_tile_to_bbox(x INTEGER, y INTEGER, z INTEGER) RETURNS GEOMETRY AS
$$
DECLARE
    mercatorMax FLOAT DEFAULT 20037508.3427892;
    mercatorMin FLOAT DEFAULT -20037508.3427892;
    mercatorSize FLOAT DEFAULT 2 * 20037508.3427892;
    worldTileSize FLOAT;
    mercatorTileSize FLOAT;
    ret_var GEOMETRY;
    DENSIFY_FACTOR INTEGER DEFAULT 4;
    xmax FLOAT;
    xmin FLOAT;
BEGIN

    IF x IS NULL OR y IS NULL OR z IS NULL THEN
        RAISE NOTICE 'Missing x/y/z value';
        RETURN NULL;
    END IF;

    worldTileSize = power(2,z);

    IF x >= worldTileSize OR y >= worldTileSize THEN
        RAISE NOTICE 'Oversized x/y';
        RETURN NULL;
    END IF;

    IF x < 0 or y < 0 THEN
        RAISE NOTICE 'Undersized x/y';
        RETURN NULL;
    END IF;

    mercatorTileSize = mercatorSize / worldTileSize;
    xmax = mercatorMin + mercatorTileSize * (x + 1);
    xmin = mercatorMin + mercatorTileSize * x;

    RAISE NOTICE 'DEBUG xmin %, xmax %', xmin, xmax;

    ret_var =  ST_MakeEnvelope(xmin,
                               mercatorMax - mercatorTileSize * (y + 1),
                               xmax,
                               mercatorMax - mercatorTileSize * y, 3857);
    ret_var = ST_Segmentize(ret_var, (xmax - xmin)/DENSIFY_FACTOR);
    ret_var = ST_TRANSFORM(ret_var, 4326);

    RETURN ret_var;

END;
$$ LANGUAGE PLPGSQL;