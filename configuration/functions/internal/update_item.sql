CREATE OR REPLACE FUNCTION locus_core.update_item(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    item_var JSONB;
    ret_var JSONB;
BEGIN

     SET SEARCH_PATH = 'locus_core', 'public';

     SELECT attributes
     INTO item_var
     FROM global_search_view
     --Only allow editables to be updated
     WHERE fid = parameters->>'fid' AND edit;

     IF item_var IS NULL THEN
        RETURN jsonb_build_object('error', concat_ws(' ', 'fid not found or cannot be updated:', parameters->>'fid'));
     END IF;

    IF (item_var#>'{acl,update}') IS NOT NULL AND NOT item_var#>'{acl,update}' ?| json2text(parameters->'_group') THEN
        RETURN jsonb_build_object('error', 'acl_failure', 'response_code', 601);
    END IF;

    EXECUTE format($SQL$
                UPDATE %1$s
                SET attributes = attributes || COALESCE($1, jsonb_build_object()),
                    wkb_geometry = COALESCE($2, wkb_geometry),
                    category_id  = COALESCE($3, category_id),
                    search_date  = COALESCE($4, search_date)
                WHERE id = $5::BIGINT
                RETURNING jsonb_build_object('message', concat_ws(' ', 'update success:', id))
         $SQL$, item_var->>'table')
         INTO ret_var
         USING  parameters->'attributes',
                ST_TRANSFORM(ST_GEOMFROMEWKT(parameters->>'geometry'),4326),
                (SELECT category_id FROM categories WHERE category = parameters->>'category'),
                (parameters->>'search_date')::TIMESTAMP,
                item_var->>'ofid';

    RETURN ret_var || jsonb_build_object('history', add_history(parameters));

END;
$$ LANGUAGE PLPGSQL;
