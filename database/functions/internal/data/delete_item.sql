CREATE OR REPLACE FUNCTION locaria_core.delete_item(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    item_var JSONB;
    delete_count INTEGER;
BEGIN

     SET SEARCH_PATH = 'locaria_core', 'locaria_data','public';

     RAISE NOTICE 'DEBUG %', parameters;

     SELECT attributes
     INTO item_var
     FROM global_search_view
     --Only allow editables to be deleted
     WHERE fid = parameters->>'fid' AND edit;

     IF item_var IS NULL THEN
        RETURN jsonb_build_object('error', concat_ws(' ', 'fid not found or cannot be deleted:', parameters->>'fid'));
     END IF;

    RAISE NOTICE 'DEBUG 2 %', item_var#>'{acl,delete}';
    IF (item_var#>'{acl,delete}') IS NOT NULL
           AND (
            NOT item_var #> '{acl,delete}' ?| json2text(parameters->'_group')
                --OR
                --item_var#>>'{acl,owner}' != parameters->>'_userID'
            )

        THEN
        RETURN jsonb_build_object('error', 'acl_failure', 'response_code', 602);
    END IF;

    EXECUTE format($SQL$
            DELETE FROM %1$s WHERE id = $1::BIGINT
    $SQL$, item_var->>'table')
    USING item_var->>'ofid';

    GET DIAGNOSTICS delete_count = ROW_COUNT;

    IF delete_count = 1 THEN
        RETURN jsonb_build_object('message', concat_ws(' ', 'delete success:', parameters->>'fid'),'history', add_history(parameters));
    END IF;


    RETURN jsonb_build_object('error',  concat_ws(' ', 'delete failure:', parameters->>'fid'));
END;
$$ LANGUAGE PLPGSQL;
