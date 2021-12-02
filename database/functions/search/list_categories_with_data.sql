--List categories with data

CREATE OR REPLACE FUNCTION locaria_core.list_categories_with_data(search_parameters JSONB DEFAULT json_build_object())  RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;

BEGIN

    SET SEARCH_PATH = 'locaria_core', 'locaria_data', 'public';
    SELECT jsonb_agg(category)
    INTO ret_var
    FROM (
          SELECT
                distinct category
          FROM	locaria_core.categories
          INNER JOIN global_search_view GSV
          ON GSV.attributes->'category'->>0 = category
          ORDER BY 1 ASC) c;

	RETURN jsonb_build_object('categories',ret_var);

END;
$$
LANGUAGE PLPGSQL;