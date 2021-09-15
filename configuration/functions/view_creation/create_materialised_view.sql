--The materialized view global_search_view is used for the majority of search operations

CREATE OR REPLACE FUNCTION locus_core.create_materialised_view() RETURNS JSONB AS
$$

BEGIN

    RAISE NOTICE 'Creating locus search materialised view';

    DROP MATERIALIZED VIEW IF EXISTS  locus_core.global_search_view CASCADE;

    --This creates a view of views to simplify the SQL below

    PERFORM locus_core.views_union();

    CREATE  MATERIALIZED VIEW locus_core.global_search_view AS

    SELECT --MD5(id||(attributes->>'table')) AS fid,
           row_number() OVER() AS fid,
           wkb_geometry,
           category,
	       date_added,
	       attributes || jsonb_build_object('ofid', id) as attributes
    FROM (

        SELECT  id,
                wkb_geometry,
                category,
                jsonb_build_object( 'url',          COALESCE(attributes->>'url', ''),
                                    'title',        COALESCE(attributes->>'title', ''),
                                    'description',  COALESCE(attributes->'description', jsonb_build_object()),
                                    'table',        COALESCE(attributes->>'table', tableoid::regclass::text),
                                    'ref',          COALESCE(attributes->>'ref', '')
                                   ) AS attributes,
                date_added
        FROM locus_core.base_table

       UNION ALL

        SELECT  id,
                wkb_geometry,
                category,
                attributes,
                date_added
        FROM locus_core.search_views_union

    ) SEARCH_TABLES;

    --This unique index is important so that we can refresh the view concurrently which in turn prevents downtime
    CREATE UNIQUE INDEX locus_core_global_search_view_u_idx  ON locus_core.global_search_view (fid);
    --Supporting geometry searches
    CREATE INDEX locus_core_search_view_geometry_idx ON locus_core.global_search_view USING GIST (wkb_geometry);
    --Supporting attribute searches
    CREATE INDEX search_view_jsonb_ts_vector  ON locus_core.global_search_view USING GIN (jsonb_to_tsvector('English'::regconfig, attributes, '["string", "numeric"]'::jsonb));
    --Supporting date range searches
    CREATE INDEX locus_core_global_search_view_date_idx ON locus_core.global_search_view (CAST(date_added AS DATE));
    --tags
    CREATE INDEX locus_core_global_search_view_jsonb_ops_idx ON locus_core.global_search_view USING GIN((attributes#>'{description,tags}'));
    --jsonb_path operations
    CREATE INDEX locus_core_global_search_view_jsonb_path_ops_idx ON locus_core.global_search_view USING GIN(attributes jsonb_path_ops);

    --Permissions
    GRANT SELECT ON locus_core.global_search_view TO PUBLIC;

	RETURN jsonb_build_object('success', 'locus search materialised view created');

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '%',SQLERRM;
    RETURN jsonb_build_object('error', 'locus search materialised view could not be installed due to an SQL error [%]', 'sql_error', SQLERRM);
END;
$$
LANGUAGE PLPGSQL;