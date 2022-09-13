CREATE OR REPLACE FUNCTION locaria_core.add_item(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
    --by default only Admins can update and delete
    acl_var JSONB DEFAULT jsonb_build_object('view',   jsonb_build_array('Moderators', 'Admins'),
                                             'update', jsonb_build_array('Admins'),
                                             'delete', jsonb_build_array('Admins'));
    category_id INTEGER;
    moderated_update BOOLEAN;
    table_var TEXT;
BEGIN

     SET SEARCH_PATH = 'locaria_core', 'public';

     --Note acl can be set directly by client so no need to add code in here to do it
     IF NOT get_tables()->'tables' ? COALESCE(parameters->>'table','') THEN
        RETURN jsonb_build_object('error', concat_ws(' ', 'Invalid table:', parameters->>'table'));
     END IF;

     table_var = concat('locaria_data.',parameters->>'table');

     --Override the default acl
     IF (parameters#>'{acl,_newACL}') IS NOT NULL THEN
         acl_var = acl_var || (parameters#>'{acl,_newACL}');
     END IF;

     SELECT id,
            COALESCE((attributes->>'moderated_update')::BOOLEAN, FALSE)
     INTO category_id, moderated_update
     FROM categories
     WHERE category = parameters->>'category';

     EXECUTE format($SQL$
                INSERT INTO %1$s (wkb_geometry, attributes, category_id, search_date)
                SELECT ST_TRANSFORM($1, 4326), $2, $3, $4
                RETURNING jsonb_build_object('message', concat_ws(' ', 'add success:', id), 'id', id)
     $SQL$, concat('locaria_data.',parameters->>'table'))
     INTO ret_var
     USING ST_GEOMFROMEWKT(parameters->>'geometry'),
           parameters->'attributes' || jsonb_build_object('acl', acl_var, 'table', table_var),
           category_id,
           COALESCE (parameters->>'search_date', NOW()::TEXT)::TIMESTAMP;

     --Add to moderation queue if required
    IF moderated_update THEN
        PERFORM add_to_moderation_queue(jsonb_build_object( 'type',         'add',
                                                            'category',     parameters->>'category',
                                                            'category_id',  category_id,
                                                            'fid',          lower(MD5(concat(table_var,':',ret_var->>'id'))),
                                                            'id',           ret_var->>'id',
                                                            'table',        parameters->>'table'));
    END IF;

     --Add a history item and return
     RETURN ret_var || jsonb_build_object('history', add_history(parameters || ret_var));
END;
$$ LANGUAGE PLPGSQL;
