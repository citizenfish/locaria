--List categories

CREATE OR REPLACE FUNCTION locaria_core.list_categories(search_parameters JSONB DEFAULT json_build_object())  RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;

BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';

    SELECT json_agg(category)
    INTO ret_var
    FROM (
        SELECT category
        FROM   categories
        GROUP BY category
        ORDER BY category ASC
        ) C;

	RETURN jsonb_build_object('categories',ret_var);

END;
$$
LANGUAGE PLPGSQL;