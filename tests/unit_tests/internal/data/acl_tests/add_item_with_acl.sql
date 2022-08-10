DO
$$
DECLARE
    ret_var JSONB;
    item_var JSONB DEFAULT jsonb_build_object(
                                              'attributes', jsonb_build_object('description', jsonb_build_object('title', 'TEST TITLE', 'text', RANDOM()::TEXT)),
                                              'geometry', 'SRID=4326;POINT(-1.1 53.1)',
                                              'category', 'acl_test',
                                              'search_date', now()::TEXT

                                               );
    acl_var JSONB DEFAULT jsonb_build_object('owner', 'foo', 'update', jsonb_build_array('fooGroup','baaGroup'), 'delete', jsonb_build_array('baaGroup'));

    item_id TEXT;
    group_id TEXT DEFAULT 'FOO GROUP';
    user_id TEXT DEFAULT 'foo';
BEGIN

    --This should fail
    SELECT locaria_core.locaria_internal_gateway(jsonb_build_object('method','add_item', 'table', 'fail')) INTO ret_var;

    IF (ret_var->>'error') IS NULL THEN
        RAISE EXCEPTION 'Test step 1 fail %', ret_var;
    END IF;

    --Add an item
    SELECT locaria_core.locaria_internal_gateway(jsonb_build_object('method','add_item', 'table', 'test_acl') || item_var, acl_var) INTO ret_var;

    RAISE NOTICE '%', locaria_tests.test_result_processor('add_item TEST 2', ret_var , '{id}', '*');

    item_id = ret_var->>'id';
    RAISE NOTICE 'Created %', item_id;
    RAISE NOTICE '%',ret_var;

    --Refresh the view
    SELECT locaria_core.locaria_internal_gateway(jsonb_build_object('method','refresh_search_view')) INTO ret_var;

    IF (ret_var->>'message') != 'view refreshed' THEN
        RAISE EXCEPTION 'Test step 3 fail %', ret_var;
    END IF;

    --Check for item in view
    SELECT locaria_core.locaria_gateway(jsonb_build_object('method', 'search', 'search_text', item_var#>>'{attributes,description,text}')) INTO ret_var;

    IF ret_var#>'{geojson,features}'->0 IS NULL THEN
        RAISE EXCEPTION 'Test step 4 fail %', ret_var;
    END IF;

    RAISE NOTICE 'TEST PASS %',ret_var;
EXCEPTION WHEN OTHERS THEN

    RAISE NOTICE 'TEST FAILED %', SQLERRM;

END;
$$ LANGUAGE PLPGSQL;