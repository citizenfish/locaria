DO
$$
DECLARE
    acl_var JSONB;
    ret_var JSONB;
BEGIN

    SELECT attributes#>'{acl,view}'
    INTO acl_var
    FROM locus_core.global_search_view
    WHERE (attributes#>'{acl,view}') IS NOT NULL
    LIMIT 1;

    IF acl_var IS NULL THEN
        RAISE EXCEPTION 'Empty acl, test cannot continue, please load acl test data';
    ELSE
        RAISE NOTICE 'Search with acl %', acl_var;
    END IF;

    SELECT jsonb_agg(R.*)
    INTO ret_var
    FROM (
        SELECT * FROM locus_core.search_get_records(jsonb_build_object('category', 'acl_test', 'search_text', '', '_group', acl_var))
    ) R;

    IF ret_var IS NULL THEN
        RAISE EXCEPTION 'ERROR TEST 1 no data returned for acl %', acl_var;
    ELSE
        RAISE NOTICE 'TEST PASSED %', ret_var->0#>'{_attributes,metadata}';
    END IF;

    SELECT jsonb_agg(R.*)
        INTO ret_var
        FROM (
            SELECT * FROM locus_core.search_get_records(jsonb_build_object('category', 'acl_test', 'search_text', ''))
        ) R;

    IF ret_var IS NOT NULL THEN
        RAISE EXCEPTION 'ERROR  TEST 2 data returned for empty acl %', ret_var->0#>'{_attributes,metadata,acl}';
    ELSE
        RAISE NOTICE 'TEST 1 PASSED No data returned';
    END IF;


END;
$$
LANGUAGE PLPGSQL;