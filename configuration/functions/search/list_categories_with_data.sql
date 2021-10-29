--List categories with data

CREATE OR REPLACE FUNCTION locus_core.list_categories_with_data(search_parameters JSONB DEFAULT json_build_object())  RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;

BEGIN

    SELECT jsonb_agg(category)
    INTO ret_var
    FROM (
          SELECT
                distinct category
          FROM	locus_core.categories
          INNER JOIN locus_core.global_search_view GSV
          ON GSV.attributes->'category'->>0 = category
          ORDER BY 1 ASC) c;

	RETURN ret_var;

END;
$$
LANGUAGE PLPGSQL;