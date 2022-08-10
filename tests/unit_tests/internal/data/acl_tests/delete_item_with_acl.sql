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
    BEGIN

        --Add an item
        SELECT locaria_core.locaria_internal_gateway(jsonb_build_object('method','add_item', 'table', 'test_acl', '_newacl', acl_var) || item_var) INTO ret_var;

        RAISE NOTICE '%', locaria_tests.test_result_processor('delete_item TEST 1', ret_var , '{id}', '*');

        --Refresh the view
        SELECT locaria_core.locaria_internal_gateway(jsonb_build_object('method','refresh_search_view')) INTO ret_var;

        IF (ret_var->>'message') != 'view refreshed' THEN
            RAISE EXCEPTION 'Test step 2 fail %', ret_var;
        END IF;

        SELECT locaria_core.locaria_gateway(jsonb_build_object('method', 'search', 'search_text', item_var#>>'{attributes,description,text}')) INTO ret_var;
        --RAISE NOTICE '%', ret_var->'geojson'->'features'->0#>>'{properties,fid}';
        item_id = ret_var->'geojson'->'features'->0#>>'{properties,fid}';

        RAISE NOTICE '%', item_id;

        --DELETE TEST 1 try with no acl, should fail
        SELECT locaria_core.locaria_internal_gateway(jsonb_build_object('method','delete_item', 'fid', item_id)) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('delete_item TEST 2', ret_var , '{response_code}', '602');

        --DELETE 2 with wrong owner should fail
        SELECT locaria_core.locaria_internal_gateway(jsonb_build_object('method','delete_item', 'fid', item_id), jsonb_build_object('_userID', 'baa')) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('delete_item TEST 3', ret_var , '{response_code}', '602');

        --DELETE with correct user should work
        SELECT locaria_core.locaria_internal_gateway(jsonb_build_object('method','delete_item', 'fid', item_id), jsonb_build_object('_userID', 'foo')) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('delete_item TEST 4', ret_var , '{response_code}', '200');

        RAISE NOTICE '%',ret_var;

    EXCEPTION WHEN OTHERS THEN

        RAISE NOTICE 'TEST FAILED %', SQLERRM;

    END;
$$ LANGUAGE PLPGSQL;