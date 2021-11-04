CREATE OR REPLACE FUNCTION locus_core.view_report(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB DEFAULT jsonb_build_object();
BEGIN

    SET SEARCH_PATH = 'locus_core', 'public';

    WITH PENDING_RECORDS AS (
        SELECT attributes FROM history WHERE NOT in_view
    ), COUNTS AS (
            SELECT
                attributes->>'method' as method,
                count(*) as count
            FROM PENDING_RECORDS
            WHERE (attributes->>'method') IN ('add_item', 'update_item', 'delete_item')
            GROUP BY attributes->>'method'
    ) SELECT jsonb_build_object('total', (SELECT count(*) FROM global_search_view),'update_item', 0, 'add_item',0,'delete_item',0) ||
             COALESCE(jsonb_object_agg(method,count), jsonb_build_object())
      INTO ret_var
      FROM counts;

     RETURN ret_var;
EXCEPTION WHEN OTHERS THEN

    RETURN jsonb_build_object('error', SQLERRM);
END;
$$ LANGUAGE PLPGSQL;
