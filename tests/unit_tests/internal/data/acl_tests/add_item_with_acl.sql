DO
$$
DECLARE
    ret_var JSONB;
    item_var JSONB DEFAULT jsonb_build_object(
                                              'attributes', jsonb_build_object('description', jsonb_build_object('title', 'TEST TITLE', 'text', RANDOM()::TEXT)),
                                              'geometry', 'SRID=4326;POINT(-1.1 53.1)',
                                              'category', 'acl_test',
                                              'search_date', now()::TEXT,
                                              'del_flag', '1'
                                               );
    new_acl_var JSONB DEFAULT jsonb_build_object('_newACL', jsonb_build_object('owner', 'foo'));
    acl_var JSONB DEFAULT jsonb_build_object('_userID', 'foo');
    acl_var2 JSONB DEFAULT jsonb_build_object('_userID', 'foo2');

    item_id TEXT;

BEGIN

    --Clean up data first
    DELETE FROM locaria_data.test_acl WHERE attributes @> jsonb_build_object('del_flag', '1');

    --This should fail
    SELECT locaria_core.locaria_internal_gateway(jsonb_build_object('method','add_item', 'table', 'fail')) INTO ret_var;

    IF (ret_var->>'error') IS NULL THEN
        RAISE EXCEPTION 'Test step 1 fail %', ret_var;
    END IF;

    --Add an item with newACL
    SELECT locaria_core.locaria_internal_gateway(jsonb_build_object('method','add_item', 'table', 'test_acl') || item_var, new_acl_var) INTO ret_var;

    RAISE NOTICE '%', locaria_tests.test_result_processor('add_item TEST 2a', ret_var , '{id}', '*');

    --Add an item with owner

    SELECT locaria_core.locaria_internal_gateway(jsonb_build_object('method','add_item', 'table', 'test_acl') || item_var, acl_var2) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('add_item TEST 2b', ret_var , '{id}', '*');

    item_id = ret_var->>'id';

    --Refresh the view
    SELECT locaria_core.locaria_internal_gateway(jsonb_build_object('method','refresh_search_view')) INTO ret_var;

    RAISE NOTICE '%', locaria_tests.test_result_processor('add_item TEST 3', ret_var , '{message}', 'view refreshed');

    --Check for item in view should not see it by default
    SELECT locaria_core.locaria_gateway(jsonb_build_object('method', 'search', 'search_text', item_var#>>'{attributes,description,text}')) INTO ret_var;

    IF ret_var#>'{geojson,features}'->0 IS NOT NULL THEN
        RAISE NOTICE 'Test step 4 fail %', ret_var;
    END IF;

    SELECT locaria_core.locaria_gateway(jsonb_build_object('method', 'search', 'search_text', item_var#>>'{attributes,description,text}'),acl_var) INTO ret_var;

    RAISE NOTICE '%', locaria_tests.test_result_processor('add_item TEST 5', ret_var->'geojson'->'features'->0->'properties' , '{fid}', '*');

    SELECT locaria_core.locaria_gateway(jsonb_build_object('method', 'search', 'search_text', '', 'owned', true),acl_var2) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('add_item TEST 6', ret_var->'geojson'->'features'->0->'properties' , '{acl,owner}', 'foo2');

EXCEPTION WHEN OTHERS THEN

    RAISE NOTICE 'TEST FAILED %', SQLERRM;

END;
$$ LANGUAGE PLPGSQL;