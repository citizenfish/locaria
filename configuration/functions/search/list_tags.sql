--List tags

CREATE OR REPLACE FUNCTION locus_core.list_tags(search_parameters JSONB DEFAULT json_build_object())  RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
    filter_var JSONB DEFAULT jsonb_build_object();
BEGIN

    filter_var = COALESCE(search_parameters->'filter', filter_var);

    SELECT json_agg(tag)
    INTO ret_var
     FROM (
        SELECT distinct jsonb_array_elements_text(attributes#>'{tags}') tag
        FROM locus_core.global_search_view
        WHERE attributes @> filter_var
	) TAGS
	WHERE tag != '';

	RETURN ret_var;

END;
$$
LANGUAGE PLPGSQL;