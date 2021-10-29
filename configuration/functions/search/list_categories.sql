--List categories

CREATE OR REPLACE FUNCTION locus_core.list_categories(search_parameters JSONB DEFAULT json_build_object())  RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;

BEGIN

    SELECT json_agg(category)
    INTO ret_var
    FROM (
        SELECT category
        FROM   locus_core.categories
        GROUP BY category
        ORDER BY category ASC
        ) C;

	RETURN ret_var;

END;
$$
LANGUAGE PLPGSQL;