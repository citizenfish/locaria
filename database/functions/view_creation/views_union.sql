
CREATE OR REPLACE FUNCTION locaria_core.views_union() RETURNS TEXT AS $$
DECLARE
	query_var TEXT;
	exclude_list_var JSONB;
BEGIN

    SET SEARCH_PATH = 'locaria_core', 'locaria_data','public';
    --Get list of excluded tables
    SELECT parameter INTO exclude_list_var FROM locaria_core.parameters WHERE parameter_name='excluded_view_tables';

    --TODO include a column integrity check with SELECT * FROM information_schema.columns WHERE table_schema = 'locaria_core' AND table_name   = 'locaria_core_all_views';
    --This creates a new view consolidating all views in the schema that match our search requirements
  SELECT COALESCE (
      (
      SELECT string_agg(' SELECT id::BIGINT,wkb_geometry::GEOMETRY,attributes::JSONB, COALESCE(search_date, now())::TIMESTAMP AS search_date, category_id::INTEGER FROM locaria_data'||'.'||table_name, ' UNION ALL')

        FROM INFORMATION_SCHEMA.views
        WHERE table_schema ='locaria_data'
		AND table_name NOT IN ('search_views_union', 'location_search_view', 'address_search_view', 'global_search_view_live', 'typeahead_search_view')
        AND (exclude_list_var IS NULL OR NOT exclude_list_var ? table_name)
        ),
      'SELECT NULL::BIGINT AS id, NULL::GEOMETRY AS wkb_geometry, NULL::JSONB AS attributes, NULL::TIMESTAMP AS search_date, NULL::INTEGER AS category_id'
      ) INTO query_var;


    EXECUTE 'CREATE OR REPLACE VIEW locaria_data.search_views_union AS '||query_var;
    GRANT SELECT ON locaria_data.global_search_view_live TO locaria_report_user;

RETURN '';
END;
$$ LANGUAGE PLPGSQL;
