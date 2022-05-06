--List categories

CREATE OR REPLACE FUNCTION locaria_core.list_categories(search_parameters JSONB DEFAULT json_build_object())  RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;

BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';
    RAISE NOTICE '%', search_parameters->>'category';

    IF COALESCE(search_parameters->>'attributes', 'false')::BOOLEAN THEN
        SELECT json_agg(COALESCE(attributes, jsonb_build_object()) || jsonb_build_object('key', category))
        INTO ret_var
        FROM (
                 SELECT category,
                        attributes
                 FROM   categories
                 WHERE (search_parameters->>'category' IS NULL) OR category = search_parameters->>'category'
                 ORDER BY category ASC
             ) C;
    ELSE
        SELECT json_agg(category)
        INTO ret_var
        FROM (
                 SELECT category
                 FROM   categories
                 GROUP BY category
                 ORDER BY category ASC
             ) C;
    END IF;

	RETURN jsonb_build_object('categories',ret_var);

END;
$$
LANGUAGE PLPGSQL;