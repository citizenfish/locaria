CREATE OR REPLACE FUNCTION locaria_core.update_item(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    item_var JSONB;
    ret_var JSONB;
    moderated_update_var BOOLEAN;

BEGIN

     SET SEARCH_PATH = 'locaria_core', 'locaria_data', 'public';

     SELECT attributes,
            moderated_update
     INTO item_var,
         moderated_update_var
     FROM global_search_view_live
          --Only allow editables to be updated
     WHERE fid = parameters->>'fid' AND edit;

     IF item_var IS NULL THEN
        RETURN jsonb_build_object('error', concat_ws(' ', 'fid not found or cannot be updated:', parameters->>'fid'));
     END IF;

     --Moderated updates don't need acl as they go into queue for auth
     IF moderated_update_var AND (parameters->>'moderation_id') IS NULL THEN
         RETURN add_to_moderation_queue(parameters);
     END IF;

    IF NOT (acl_check(parameters->'acl', item_var->'acl')->>'update')::BOOLEAN THEN
        RETURN jsonb_build_object('error', 'acl_failure', 'response_code', 602);
    END IF;

    EXECUTE format($SQL$
                UPDATE %1$s
                SET attributes = attributes || COALESCE($1, jsonb_build_object())
                                            || jsonb_build_object('acl', (attributes->'acl') || $6),
                    wkb_geometry = COALESCE($2, wkb_geometry),
                    category_id  = COALESCE($3, category_id),
                    search_date  = COALESCE($4, search_date)
                WHERE id = $5::BIGINT
                RETURNING jsonb_build_object('message', concat_ws(' ', 'update success:', id))
         $SQL$, item_var->>'table')
         INTO ret_var
         USING  parameters->'attributes',
                ST_TRANSFORM(ST_GEOMFROMEWKT(parameters->>'geometry'),4326),
                (SELECT id FROM categories WHERE category = parameters->>'category'),
                (parameters->>'search_date')::TIMESTAMP,
                item_var->>'ofid',
                COALESCE(parameters#>'{acl,_newACL}', jsonb_build_object());

    --If this was a moderation then update its status

     UPDATE moderation_queue
         SET status = 'ACCEPTED'
     WHERE (parameters->>'moderation_id') IS NOT NULL
     AND id = (parameters->>'moderation_id')::BIGINT;

    RETURN ret_var || jsonb_build_object('history', add_history(parameters || ret_var));

END;
$$ LANGUAGE PLPGSQL;
