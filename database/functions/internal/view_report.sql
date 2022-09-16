CREATE OR REPLACE AGGREGATE  jsonb_object_agg(jsonb) (
  SFUNC = 'jsonb_concat',
  STYPE = jsonb,
  INITCOND = '{}'
);

CREATE OR REPLACE FUNCTION locaria_core.view_report(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB DEFAULT jsonb_build_object();
BEGIN

    SET SEARCH_PATH = 'locaria_core', 'locaria_data', 'public';

    WITH PENDING_RECORDS AS (
            SELECT
                COALESCE(attributes->>'fid', attributes->>'id') AS fid,
                attributes->>'method' AS method
            FROM history
            WHERE NOT in_view
            AND attributes->>'method' IN ('add_item', 'update_item', 'delete_item')

        ), COUNTS AS (

            SELECT distinct on (method) method,
                   jsonb_build_object(method||'_fids', jsonb_strip_nulls(jsonb_agg(fid)),
                   method,
                   count(*)) AS obj
            FROM PENDING_RECORDS
            GROUP BY method

        ), MODERATION_COUNT AS (

            SELECT count(*) AS mc
            FROM moderation_queue
            WHERE status = 'RECEIVED'

    )  SELECT  jsonb_build_object('total',          (SELECT count(*) FROM global_search_view),
                                  'moderations',    (SELECT mc FROM MODERATION_COUNT),
                                  'update_item',    0,
                                  'add_item',       0,
                                  'delete_item',    0) || jsonb_object_agg(obj)
        INTO ret_var
        FROM counts;

     RETURN ret_var;
EXCEPTION WHEN OTHERS THEN

    RETURN jsonb_build_object('error', SQLERRM);
END;
$$ LANGUAGE PLPGSQL;
