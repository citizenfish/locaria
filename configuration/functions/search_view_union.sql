CREATE OR REPLACE FUNCTION locus_core.views_union() RETURNS TEXT AS $$
DECLARE
	query_var TEXT;
	exclude_list_var JSONB;
BEGIN


    --Get list of excluded tables
    SELECT parameter INTO exclude_list_var FROM locus_core.parameters WHERE parameter_name='excluded_view_tables';

    --TODO include a column integrity check with SELECT * FROM information_schema.columns WHERE table_schema = 'locus_core' AND table_name   = 'locus_core_all_views';
    --This creates a new view consolidating all views in the schema that match our search requirements
  SELECT COALESCE (
      (
      SELECT string_agg(' SELECT id::BIGINT,wkb_geometry::GEOMETRY,attributes::JSONB, COALESCE(date_added, now())::TIMESTAMP AS date_added, COALESCE(category, ''{General}'') AS category FROM locus_core'||'.'||table_name, ' UNION ALL')

        FROM INFORMATION_SCHEMA.views
        WHERE table_schema ='locus_core'
		AND table_name NOT IN ('search_views_union', 'location_search_view', 'address_search_view')
        AND (exclude_list_var IS NULL OR NOT exclude_list_var ? table_name)
        ),
      'SELECT NULL::BIGINT as id, NULL::GEOMETRY as wkb_geometry, NULL::JSONB as attributes, NULL::TIMESTAMP as date_added, NULL::locus_core.search_category[] as category'
      ) INTO query_var;


EXECUTE 'CREATE OR REPLACE VIEW locus_core.search_views_union AS '||query_var;

RETURN '';
END;
$$ LANGUAGE PLPGSQL;
