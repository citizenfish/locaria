CREATE OR REPLACE FUNCTION locaria_core.add_item(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
    acl_var JSONB DEFAULT jsonb_build_object('acl', jsonb_build_object('update', jsonb_build_array('Admins'), 'delete', jsonb_build_array('Admins')));
BEGIN

     SET SEARCH_PATH = 'locaria_core', 'public';

     --Note acl can be set directly by client so no need to add code in here to do it
     IF NOT get_tables()->'tables' ? COALESCE(parameters->>'table','') THEN
        RETURN jsonb_build_object('error', concat_ws(' ', 'Invalid table:', parameters->>'table'));
     END IF;

     --Set a default
     IF (parameters#>'{acl,_newacl}') IS NOT NULL THEN
         acl_var = jsonb_build_object('acl', parameters->'{acl,_newacl}');
     END IF;

     --RAISE NOTICE 'DEBUG %', parameters;

     EXECUTE format($SQL$
                INSERT INTO %1$s (wkb_geometry, attributes, category_id, search_date)
                SELECT ST_TRANSFORM($1, 4326), $2, $3, $4
                RETURNING jsonb_build_object('message', concat_ws(' ', 'add success:', id), 'id', id)
     $SQL$, parameters->>'table')
     INTO ret_var
     USING ST_GEOMFROMEWKT(parameters->>'geometry'),
           parameters->'attributes' || acl_var,
           (SELECT id FROM categories WHERE category = parameters->>'category'),
           COALESCE (parameters->>'search_date', NOW()::TEXT)::TIMESTAMP;

     --Add a history item and return
     RETURN ret_var || jsonb_build_object('history', add_history(parameters));
END;
$$ LANGUAGE PLPGSQL;
