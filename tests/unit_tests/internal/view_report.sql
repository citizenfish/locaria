DO
$$
    DECLARE
        ret_var JSONB;
        parameters JSONB DEFAULT jsonb_build_object('method',  'view_report');
        item_var JSONB DEFAULT jsonb_build_object(
                'attributes', jsonb_build_object('description', jsonb_build_object('title', 'UPDATE TEST TITLE', 'text', RANDOM()::TEXT)),
                'geometry', 'SRID=4326;POINT(-1.1 53.1)',
                'category', 'acl_test',
                'search_date', now()::TEXT

            );
        acl_var JSONB DEFAULT jsonb_build_object('owner', 'foo', 'update', jsonb_build_array('fooGroup','baaGroup'), 'delete', jsonb_build_array('baaGroup'));
        fid TEXT;
    BEGIN

        SET SEARCH_PATH = 'locaria_core', 'public';

        SELECT locaria_core.locaria_internal_gateway(jsonb_build_object('method','refresh_search_view')) INTO ret_var;

        SELECT locaria_core.locaria_internal_gateway(jsonb_build_object('method','add_item', 'table', 'test_acl') || item_var, acl_var) INTO ret_var;

        SELECT locaria_internal_gateway(parameters) INTO ret_var;

        RAISE NOTICE '%', locaria_tests.test_result_processor('view_report TEST 1', ret_var , '{add_item}', '1');

        --Refresh then update
        SELECT locaria_core.locaria_internal_gateway(jsonb_build_object('method','refresh_search_view')) INTO ret_var;
        SELECT locaria_core.locaria_gateway(jsonb_build_object('method', 'search', 'search_text', item_var#>>'{attributes,description,text}')) INTO ret_var;
        fid = ret_var#>'{geojson,features}'->0->'properties'->>'fid';

        SELECT locaria_core.locaria_internal_gateway(
                       jsonb_build_object('method', 'update_item',
                                          'fid', fid,
                                          'category', 'LOCARIA_TEST_MOD',
                                          'attributes', jsonb_build_object('moderated_update', 'true'),
                                          'geometry', 'SRID=4326;POINT(-1.3 54.2)',
                                          'search_date', '2022-07-01'),
                       jsonb_build_object('_groups', jsonb_build_array('Admins'))) INTO ret_var;

        SELECT locaria_internal_gateway(parameters) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('view_report TEST 2', ret_var , '{update_item}', '1');

        SELECT locaria_core.locaria_internal_gateway(jsonb_build_object('method','delete_item', 'fid', fid), jsonb_build_object('_groups', jsonb_build_array('Admins'))) INTO ret_var;

        RAISE NOTICE '%',ret_var;

        SELECT locaria_internal_gateway(parameters) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('view_report TEST 2', ret_var , '{delete_item}', '1');

        RAISE NOTICE '%',ret_var;
    END;
$$ LANGUAGE PLPGSQL;