DO
$$
DECLARE
    item_var JSONB;
    ret_var JSONB;
BEGIN

    SELECT attributes
    INTO item_var
    FROM locus_core.global_search_view
    WHERE attributes->'category' ?| locus_core.json2text(jsonb_build_array('acl_test'))
    AND (attributes->>'acl') IS NULL
    LIMIT 1;

    IF item_var IS NULL THEN
        RAISE EXCEPTION 'TEST FAILED - no acl_test data loaded';
    END IF;

    --Basic search using just text
    SELECT locus_core.locus_gateway(jsonb_build_object('method','search', 'search_text', item_var#>>'{description,text}')) INTO ret_var;

    IF ret_var->>'response_code' != '200' OR (ret_var->'features'->0) IS NULL THEN
        RAISE EXCEPTION 'TEST 1 FAIL %',ret_var;
    END IF;

    --Category Search [single]
    SELECT locus_core.locus_gateway(jsonb_build_object('method','search', 'category', 'acl_test')) INTO ret_var;

    IF ret_var->>'response_code' != '200' OR (ret_var->'features'->0) IS NULL THEN
        RAISE EXCEPTION 'TEST 2 FAIL %',ret_var;
    END IF;

    --Category Search [multiple]
    SELECT locus_core.locus_gateway(jsonb_build_object('method','search', 'category', jsonb_build_array('acl_test','foo'))) INTO ret_var;

    IF ret_var->>'response_code' != '200' OR (ret_var->'features'->0) IS NULL THEN
        RAISE EXCEPTION 'TEST 3 FAIL %',ret_var;
    END IF;

    --LIMIT TEST
    SELECT locus_core.locus_gateway(jsonb_build_object('method','search', 'search_text', item_var#>>'{description,text}','limit', '0')) INTO ret_var;

    IF ret_var->>'response_code' != '200' OR (ret_var->'features'->0) IS NOT NULL THEN
        RAISE EXCEPTION 'TEST 4 FAIL %',ret_var;
    END IF;


    RAISE NOTICE 'TEST PASS';
END;
$$
LANGUAGE PLPGSQL;