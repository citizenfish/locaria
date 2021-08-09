DO
$$
DECLARE
    ret_var JSONB;
BEGIN

    RAISE NOTICE 'Running check_core_tables TEST';

    --Check our core tables exist
    PERFORM id FROM locus_core.base_table LIMIT 1;
    PERFORM id FROM locus_core.parameters LIMIT 1;
    PERFORM id FROM locus_core.reports LIMIT 1;
    PERFORM id FROM locus_core.lex_sessions LIMIT 1;
    PERFORM id FROM locus_core.logs LIMIT 1;

    --Check our categories exist
    SELECT json_agg(CAT.unnest)
    INTO ret_var
    FROM (
          select * FROM unnest(enum_range(enum_first(null::locus_core.search_category)))
	) CAT;

	--VIEWS
    PERFORM fid FROM locus_core.global_search_view;
    PERFORM id  FROM locus_core.search_views_union;

    RAISE NOTICE 'check_core_tables PASSED';

EXCEPTION WHEN OTHERS THEN

    RAISE EXCEPTION 'check_core_tables TEST FAILED [%]', SQLERRM;
END;
$$
LANGUAGE PLPGSQL;