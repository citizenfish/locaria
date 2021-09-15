--List tags

CREATE OR REPLACE FUNCTION locus_core.list_tags(search_parameters JSONB DEFAULT json_build_object())  RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;

BEGIN

    SELECT json_agg(tag)
    INTO ret_var
     FROM (
        SELECT distinct jsonb_array_elements_text(attributes#>'{description,tags}') tag
        FROM locus_core.global_search_view
	) TAGS;

	RETURN ret_var;

END;
$$
LANGUAGE PLPGSQL;