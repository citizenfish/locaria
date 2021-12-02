--List tags

CREATE OR REPLACE FUNCTION locaria_core.list_tags(search_parameters JSONB DEFAULT json_build_object())  RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
    filter_var JSONB DEFAULT jsonb_build_object();
BEGIN

    SET SEARCH_PATH = 'locaria_core',  'locaria_data','public';

    filter_var = COALESCE(search_parameters->'filter', filter_var);

    SELECT json_agg(tag)
    INTO ret_var
     FROM (
        SELECT distinct jsonb_array_elements_text(attributes#>'{tags}') tag
        FROM global_search_view
        WHERE attributes @> filter_var
	) TAGS
	WHERE tag != '';

	RETURN jsonb_build_object('tags',COALESCE(ret_var, jsonb_build_array()));

END;
$$
LANGUAGE PLPGSQL;