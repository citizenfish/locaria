--The materialized view global_search_view is used for the majority of search operations

CREATE OR REPLACE FUNCTION locus_core.create_materialised_view() RETURNS JSONB AS
$$

BEGIN

    RAISE NOTICE 'Creating locus search materialised view';

    DROP MATERIALIZED VIEW IF EXISTS  locus_core.global_search_view CASCADE;

    --This creates a view of views to simplify the SQL below

    PERFORM locus_core.views_union();

    CREATE  MATERIALIZED VIEW locus_core.global_search_view AS

    SELECT row_number() OVER() AS fid,
           wkb_geometry,
	       jsonb_build_object(  'url',          COALESCE(attributes->>'url', ''),
                                'tags',         COALESCE(attributes->'tags', jsonb_build_object()),
                                'description',  COALESCE(attributes->'description', jsonb_build_object()),
                                'table',        COALESCE(attributes->>'table', table_location),
                                'ref',          COALESCE(attributes->>'ref', ''),
                                'ofid',         id,
                                'category',     category
                              ) AS attributes,
           search_date AS start_date,
           COALESCE(to_timestamp(attributes->>'end_date', 'DD/MM/YYYY HH24:MI:SS')::TIMESTAMP ,search_date) AS end_date,
           COALESCE(attributes->>'range_min','0')::FLOAT as range_min,
           COALESCE(attributes->>'range_max','0')::FLOAT AS range_max


    FROM (

        SELECT  id,
                wkb_geometry,
                category,
                B.tableoid::regclass::text AS table_location,
                B.attributes,
                search_date
        FROM locus_core.base_table B
        INNER JOIN locus_core.categories C USING (category_id)

       UNION ALL

        SELECT  id,
                wkb_geometry,
                category,
                COALESCE(B.attributes->>'table', B.attributes->>'table', 'locus_core.search_views_union') AS table_location,
                B.attributes,
                search_date
        FROM locus_core.search_views_union B
        INNER JOIN locus_core.categories C USING (category_id)

    ) SEARCH_TABLES;

    --This unique index is important so that we can refresh the view concurrently which in turn prevents downtime
    CREATE UNIQUE INDEX locus_core_global_search_view_u_idx  ON locus_core.global_search_view (fid);

    --Supporting geometry searches
    CREATE INDEX locus_core_search_view_geometry_idx ON locus_core.global_search_view USING GIST (wkb_geometry);

    --Supporting free text searches
    CREATE INDEX search_view_jsonb_ts_vector  ON locus_core.global_search_view USING GIN (jsonb_to_tsvector('English'::regconfig, attributes->'description', '["string", "numeric"]'::jsonb));

    --Supporting date range searches between on a single date
    CREATE INDEX locus_core_global_search_date_idx ON locus_core.global_search_view (CAST((start_date) AS DATE),CAST((end_date) AS DATE) DESC);

    --Supporting a numeric range
    CREATE INDEX locus_core_global_range_idx ON locus_core.global_search_view (range_min, range_max DESC);

    --tags
    CREATE INDEX locus_core_global_search_view_jsonb_ops_idx ON locus_core.global_search_view USING GIN((attributes#>'{tags}'));

    --jsonb_path operations
    CREATE INDEX locus_core_global_search_view_jsonb_path_ops_idx ON locus_core.global_search_view USING GIN(attributes jsonb_path_ops);


    --TODO range indexes for date and min/max

    --Permissions
    GRANT SELECT ON locus_core.global_search_view TO PUBLIC;

	RETURN jsonb_build_object('success', 'locus search materialised view created');

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '%',SQLERRM;
    RETURN jsonb_build_object('error', 'locus search materialised view could not be installed due to an SQL error [%]', 'sql_error', SQLERRM);
END;
$$
LANGUAGE PLPGSQL;