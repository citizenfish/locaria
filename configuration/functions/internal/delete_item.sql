CREATE OR REPLACE FUNCTION locus_core.delete_item(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    item_var JSONB;
    delete_count INTEGER;
BEGIN

     SET SEARCH_PATH = 'locus_core', 'public';

     SELECT attributes
     INTO item_var
     FROM global_search_view
     --Only allow editables to be deleted
     WHERE fid = parameters->>'fid' AND edit;

     IF item_var IS NULL THEN
        RETURN jsonb_build_object('error', concat_ws(' ', 'fid not found or cannot be deleted:', parameters->>'fid'));
     END IF;

    EXECUTE format($SQL$
            DELETE FROM %1$s WHERE id = $1::BIGINT
    $SQL$, item_var->>'table')
    USING item_var->>'ofid';

    GET DIAGNOSTICS delete_count = ROW_COUNT;

    IF delete_count = 1 THEN
        RETURN jsonb_build_object('message', concat_ws(' ', 'delete success:', parameters->>'fid'));
    END IF;


    RETURN jsonb_build_object('error',  concat_ws(' ', 'delete failure:', parameters->>'fid'));
END;
$$ LANGUAGE PLPGSQL;
