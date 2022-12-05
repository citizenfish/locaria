--The materialized view global_search_view is used for the majority of search operations
CREATE OR REPLACE FUNCTION locaria_core.create_typeahead_search_view() RETURNS JSONB AS
$$

BEGIN

    SET SEARCH_PATH = 'locaria_core', 'locaria_data', 'public';

    RAISE NOTICE 'Creating typeahead_search view';

    DROP VIEW IF EXISTS locaria_data.typeahead_search_view;

    CREATE OR REPLACE VIEW locaria_data.typeahead_search_view AS
    SELECT fid AS fid ,
           attributes#>>'{description,title}' AS search_text,
           attributes->'category'->>0 AS category,
           'f' AS feature_type,
           --jsonb_build_array(ST_X(wkb_geometry), ST_Y(wkb_geometry)) AS location
           --not needed at present if added in make sure centroid used
           jsonb_build_array() AS location,
           NULL AS region
    FROM locaria_data.global_search_view
    UNION ALL
    SELECT id::TEXT AS fid,
           attributes->>'name1' AS search_text,
           'Location' AS category,
           'l' AS feature_type,
           jsonb_build_array(ST_X(wkb_geometry), ST_Y(wkb_geometry)) AS location,
           concat_ws(' ', attributes ->> 'county_unitary'::text, Concat('(',attributes ->> 'region'::text,')'))  AS region
    FROM locaria_data.location_search_view;

    CREATE INDEX IF NOT EXISTS gsv_typeahead_idx ON locaria_data.global_search_view (LOWER(attributes#>>'{description,title}') text_pattern_ops);

    CREATE INDEX IF NOT EXISTS lsv_typeahead_idx ON locaria_data.location_search_view (LOWER(attributes->>'name1')  text_pattern_ops);

    --Permissions
    GRANT SELECT ON locaria_data.typeahead_search_view TO PUBLIC;

    RETURN jsonb_build_object('success', 'locaria typeahead_search view created');

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '%',SQLERRM;
    RETURN jsonb_build_object('error', 'locaria typeahead_search view could not be created due to an SQL error [%]', 'sql_error', SQLERRM);
END;
$$
    LANGUAGE PLPGSQL;