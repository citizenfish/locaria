DO
$$
DECLARE
    ret_var JSONB;
    item_var JSONB DEFAULT jsonb_build_object(
            'attributes', jsonb_build_object('description', jsonb_build_object('title', 'TEST TITLE', 'text', RANDOM()::TEXT)),
            'geometry', 'SRID=4326;POINT(-1.1 53.1)',
            'category', 'LOCARIA_TEST_MOD',
            'search_date', now()::TEXT
        );
    acl_var JSONB DEFAULT jsonb_build_object('_userID', 'foo');
    item_id TEXT;
BEGIN
    SET SEARCH_PATH = 'locaria_core', 'locaria_data', 'public';

    IF (SELECT 1 from categories WHERE category ='LOCARIA_TEST_MOD') IS NULL THEN
        RAISE EXCEPTION 'TEST DATA NOT LOADED';
    END IF;

    DELETE FROM imports;
    DELETE FROM moderation_queue;

    SELECT locaria_gateway(jsonb_build_object('method', 'add_item', 'table', 'imports') || item_var, acl_var) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('add_item TEST 1', ret_var , '{id}', '*');

    SELECT locaria_internal_gateway(jsonb_build_object('method', 'refresh_search_view')) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('add_item TEST 2', ret_var , '{message}', 'view refreshed');

    --item should not be in view for normal user
    SELECT locaria_gateway(jsonb_build_object('method', 'search', 'search_text', item_var#>>'{attributes,description,text}') || item_var, acl_var) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('add_item TEST 3', ret_var , '{options,count}', '0');

    acl_var = jsonb_build_object('_groups', jsonb_build_array('Admins'));
    SELECT locaria_gateway(jsonb_build_object('method', 'search', 'search_text', item_var#>>'{attributes,description,text}') || item_var, acl_var) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('add_item TEST 4', ret_var#>'{geojson,features}'->0 , '{properties,fid}', '*');
    item_id = ret_var#>'{geojson,features}'->0->'properties'->>'fid';
    RAISE NOTICE 'Working with item %',ret_var;

    --check moderation queue
    SELECT locaria_internal_gateway(jsonb_build_object('method', 'get_moderation_items')) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('add_item TEST 5', ret_var#>'{moderation_items}'->0 , '{fid}', item_id);
    RAISE NOTICE '%',ret_var;

    --now update item to bring it into view
    SELECT locaria_internal_gateway(
        jsonb_build_object('method', 'update_item','fid', item_id, 'moderation_id', ret_var#>'{moderation_items}'->0->>'id'),
        jsonb_build_object('_groups', jsonb_build_array('Admins'), '_newACL', jsonb_build_object('view', jsonb_build_array('PUBLIC')))
        ) INTO ret_var;

    RAISE NOTICE '%', locaria_tests.test_result_processor('add_item TEST 6', ret_var , '{message}', '*');

    --Check item removed from view
    SELECT locaria_internal_gateway(jsonb_build_object('method', 'get_moderation_items')) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('add_item TEST 7', ret_var , '{moderation_items}', '[]');

END;
$$