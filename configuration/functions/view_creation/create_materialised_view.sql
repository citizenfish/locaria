--The materialized view global_search_view is used for the majority of search operations

CREATE OR REPLACE FUNCTION locus_core.create_materialised_view() RETURNS JSONB AS
$$

BEGIN

    SET SEARCH_PATH = 'locus_core', 'public';

    RAISE NOTICE 'Creating locus search materialised view';

    DROP MATERIALIZED VIEW IF EXISTS  locus_core.global_search_view CASCADE;

    --This creates a view live view which we then materialize and index to get the performance

    PERFORM locus_core.views_union();

    CREATE OR REPLACE VIEW locus_core.global_search_view_live AS

    SELECT distinct lower(MD5(concat(attributes#>>'{table}',':',id))) AS fid,
           wkb_geometry,
           --note dependency on get_item here
	       jsonb_build_object(  'tags',         COALESCE(strip_array_blanks(attributes->'tags'), jsonb_build_array()),
                                'description',  COALESCE(attributes->'description', jsonb_build_object()),
                                'table',        COALESCE(attributes->>'table', table_location),
                                'ref',          COALESCE(attributes->>'ref', ''),
                                'ofid',         id,
                                --stored as array to future proof but we only use single categories at present
                                'category',     json_build_array(category),
                                'acl',          attributes->'acl'
                              ) AS attributes,
           search_date AS start_date,
           --not we default end date to the end of the day
           COALESCE(to_timestamp(attributes->>'end_date', 'DD/MM/YYYY HH24:MI:SS')::TIMESTAMP ,search_date::DATE::TIMESTAMP + INTERVAL '23 HOURS 59 MINUTES') AS end_date,
           COALESCE(attributes->>'range_min','0')::FLOAT as range_min,
           COALESCE(attributes->>'range_max','0')::FLOAT AS range_max,
           edit,
           moderated_update


    FROM (

        SELECT  id,
                wkb_geometry,
                category,
                locus_core.table_name(B.tableoid) AS table_location,
                B.attributes,
                search_date,
                TRUE AS edit,
                COALESCE(C.attributes->>'moderated_update', 'false')::BOOLEAN AS moderated_update
        FROM locus_core.base_table B
        INNER JOIN locus_core.categories C USING (category_id)

       UNION ALL

        SELECT  id,
                wkb_geometry,
                category,
                COALESCE(B.attributes->>'table', B.attributes->>'table', 'locus_core.search_views_union') AS table_location,
                B.attributes,
                search_date,
                false AS edit,
                false AS moderated_update
        FROM locus_core.search_views_union B
        INNER JOIN locus_core.categories C USING (category_id)

    ) SEARCH_TABLES;

    --Materialize the live view for performance
    CREATE  MATERIALIZED VIEW locus_core.global_search_view AS SELECT * FROM locus_core.global_search_view_live;

    --This unique index is important so that we can refresh the view concurrently which in turn prevents downtime
    CREATE UNIQUE INDEX locus_core_global_search_view_u_idx  ON locus_core.global_search_view (fid);

    --Supporting geometry searches
    CREATE INDEX locus_core_search_view_geometry_idx ON locus_core.global_search_view USING GIST (wkb_geometry);

    --Supporting free text searches
    CREATE INDEX search_view_jsonb_ts_vector  ON locus_core.global_search_view USING GIN (jsonb_to_tsvector('English'::regconfig, attributes->'description', '["string", "numeric"]'::jsonb));

    --Supporting date range searches
    CREATE INDEX locus_core_global_search_tsdate_idx ON locus_core.global_search_view USING btree ((start_date::timestamp) ASC NULLS LAST, (end_date::timestamp) DESC NULLS LAST);

    --Supporting a numeric range
    CREATE INDEX locus_core_global_range_idx ON locus_core.global_search_view (range_min, range_max DESC);

    --tags
    CREATE INDEX locus_core_global_search_view_tags_idx ON locus_core.global_search_view USING GIN((attributes#>'{tags}'));

    --jsonb_path operations
    CREATE INDEX locus_core_global_search_view_jsonb_path_ops_idx ON locus_core.global_search_view USING GIN(attributes jsonb_path_ops);

    --categories
    CREATE INDEX locus_core_global_search_view_category_idx on locus_core.global_search_view USING GIN((attributes->'category'));

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