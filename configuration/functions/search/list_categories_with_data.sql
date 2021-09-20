--List categories with data

CREATE OR REPLACE FUNCTION locus_core.list_categories_with_data(search_parameters JSONB DEFAULT json_build_object())  RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;

BEGIN

    SELECT jsonb_agg(json) INTO ret_var FROM (
							SELECT distinct ON (category)
								jsonb_build_object('category',	  category,
												  'sub_category', COALESCE(json_agg(sub_category) FILTER (WHERE sub_category IS NOT NULL) OVER (partition by category), json_build_array())
												  ) as json
							FROM (
								SELECT distinct on( category[1], attributes#>'{description,type}')
										category[1] as category,
										attributes#>'{description,type}' as sub_category
								FROM locus_core.global_search_view
								WHERE search_parameters->>'category' IS NULL OR (category[1])::TEXT = search_parameters->>'category'
								) FOO
	) BAA;

	RETURN ret_var;

END;
$$
LANGUAGE PLPGSQL;