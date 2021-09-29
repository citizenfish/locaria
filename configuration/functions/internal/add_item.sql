CREATE OR REPLACE FUNCTION locus_core.add_item(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
BEGIN

     SET SEARCH_PATH = 'locus_core', 'public';

     IF NOT get_tables()->'tables' ? COALESCE(parameters->>'table','') THEN
        RETURN jsonb_build_object('error', concat_ws(' ', 'Invalid table:', parameters->>'table'));
     END IF;

     EXECUTE format($SQL$
                INSERT INTO %1$s (wkb_geometry, attributes, category_id, search_date)
                SELECT ST_TRANSFORM($1, 4326), $2, $3, $4
                RETURNING jsonb_build_object('message', concat_ws(' ', 'add success:', id))
     $SQL$, parameters->>'table')
     INTO ret_var
     USING ST_GEOMFROMEWKT(parameters->>'geometry'),
           parameters->'attributes',
           (SELECT category_id FROM categories WHERE category = parameters->>'category'),
           COALESCE (parameters->>'search_date', NOW()::TEXT)::TIMESTAMP;


     RETURN ret_var;
END;
$$ LANGUAGE PLPGSQL;
