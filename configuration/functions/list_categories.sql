--List categories

CREATE OR REPLACE FUNCTION locus_core.list_categories(search_parameters JSONB DEFAULT json_build_object())  RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;

BEGIN

    SELECT json_agg(CAT.unnest) INTO ret_var FROM (
                    select * FROM unnest(enum_range(enum_first(null::locus_core.search_category)))
	        ) CAT;

	RETURN ret_var;

END;
$$
LANGUAGE PLPGSQL;