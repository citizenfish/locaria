DO
$$
    DECLARE
        ret_var JSONB;
        item_var JSONB DEFAULT jsonb_build_object(
                'attributes', jsonb_build_object('description', jsonb_build_object('title', 'UPDATE TEST TITLE', 'text', RANDOM()::TEXT)),
                'geometry', 'SRID=4326;POINT(-1.1 53.1)',
                'category', 'acl_test',
                'search_date', now()::TEXT

            );
        acl_var JSONB DEFAULT jsonb_build_object('owner', 'foo', 'update', jsonb_build_array('fooGroup','baaGroup'), 'delete', jsonb_build_array('baaGroup'));

        item_id TEXT;
        fid TEXT;

    BEGIN


        --Add an item
        SELECT locaria_core.locaria_internal_gateway(jsonb_build_object('method','add_item', 'table', 'test_acl') || item_var, acl_var) INTO ret_var;

        RAISE NOTICE '%', locaria_tests.test_result_processor('update_item TEST 1', ret_var , '{id}', '*');

        item_id = ret_var->>'id';
        RAISE NOTICE 'Created %', item_id;
        RAISE NOTICE '%',ret_var;

        --Refresh the view
        SELECT locaria_core.locaria_internal_gateway(jsonb_build_object('method','refresh_search_view')) INTO ret_var;

        IF (ret_var->>'message') != 'view refreshed' THEN
            RAISE EXCEPTION 'Test step 2 fail %', ret_var;
        END IF;

        --Check for item in view
        SELECT locaria_core.locaria_gateway(jsonb_build_object('method', 'search', 'search_text', item_var#>>'{attributes,description,text}')) INTO ret_var;

        IF ret_var#>'{geojson,features}'->0 IS NULL THEN
            RAISE EXCEPTION 'Test step 3 fail %', ret_var;
        END IF;

        fid = ret_var#>'{geojson,features}'->0->'properties'->>'fid';

        RAISE NOTICE 'Test step 3 pass %',fid;

        --No acl should fail update
        SELECT locaria_core.locaria_internal_gateway(
                       jsonb_build_object('method', 'update_item',
                                          'fid', fid,
                                          'attributes', jsonb_build_object('update1', 'ok'))) INTO ret_var;

        RAISE NOTICE '%', locaria_tests.test_result_processor('update_item TEST 4', ret_var , '{response_code}', '602');

        --Update the item's attributes, geometry and date set it to require moderation for next update
        SELECT locaria_core.locaria_internal_gateway(
            jsonb_build_object('method', 'update_item',
                                          'fid', fid,
                                          'category', 'LOCARIA_TEST_MOD',
                                          'attributes', jsonb_build_object('moderated_update', 'true'),
                                          'geometry', 'SRID=4326;POINT(-1.3 54.2)',
                                          'search_date', '2022-07-01'),
            jsonb_build_object('_groups', jsonb_build_array('Admins'))) INTO ret_var;

        RAISE NOTICE '%', locaria_tests.test_result_processor('update_item TEST 5', ret_var , '{response_code}', '200');

        --Refresh the view
        SELECT locaria_core.locaria_internal_gateway(jsonb_build_object('method','refresh_search_view')) INTO ret_var;

        IF (ret_var->>'message') != 'view refreshed' THEN
            RAISE EXCEPTION 'Test step 6 fail %', ret_var;
        END IF;

        --Now repeat the update and it should go to moderation
        SELECT locaria_core.locaria_internal_gateway(
                       jsonb_build_object('method', 'update_item',
                                          'fid', fid,
                                          'attributes', jsonb_build_object('new_update', 'true'),
                                          'geometry', 'SRID=4326;POINT(-1.3 54.2)',
                                          'search_date', '2022-07-01'),
                       jsonb_build_object('_groups', jsonb_build_array('Admins'))) INTO ret_var;

        RAISE NOTICE '%',ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('update_item TEST 7', ret_var , '{message}', 'Item added to moderation queue');

    EXCEPTION WHEN OTHERS THEN

        RAISE NOTICE 'TEST FAILED %', SQLERRM;

    END;
$$ LANGUAGE PLPGSQL;