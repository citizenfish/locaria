DO
$$
    DECLARE
        ret_var JSONB;
        parameters JSONB DEFAULT jsonb_build_object('method', 'get_item');
        fid_var TEXT;
    BEGIN

        SET SEARCH_PATH = 'locaria_data','locaria_core', 'public';

        parameters = parameters || jsonb_build_object('fid', (SELECT fid FROM global_search_view WHERE edit AND moderated_update AND attributes#>>'{description,title}' = 'find me two'));

        --Update base data but not the global search view
        UPDATE locaria_data.locaria_test_data
        SET attributes = attributes -'acl' || jsonb_build_object('tags', jsonb_build_array('test'));

        --Simple get_item call
        SELECT locaria_gateway(parameters) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('get_item TEST 1', ret_var#>'{features}'->0 , '{properties,description,title}', 'find me two');

        --Get live view, tags should be present

        parameters = parameters || jsonb_build_object('live', true);

        RAISE NOTICE 'DEBUG %', parameters;
        SELECT locaria_gateway(parameters) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('get_item TEST 2', ret_var#>'{features}'->0 , '{properties,fid}', parameters->>'fid');


        --Add an acl to item and we should now not get it

        UPDATE locaria_data.locaria_test_data
        SET attributes = attributes || jsonb_build_object('acl', jsonb_build_object('view', jsonb_build_array('test')));

        SELECT locaria_gateway(parameters) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('get_item TEST 3', ret_var#>'{features}' , '{}', 'EMPTY');

        --Set _group and we should get it now

        --parameters = parameters || jsonb_build_object('acl',jsonb_build_object('_group', jsonb_build_array('test')));

        SELECT locaria_gateway(parameters, jsonb_build_object('_groups', jsonb_build_array('test'))) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('get_item TEST 4', ret_var#>'{features}'->0 , '{properties,description,title}', 'find me two');

        --Add a moderation item and check it comes down

        DELETE FROM moderation_queue;

        INSERT INTO moderation_queue(fid, attributes,status)
        SELECT parameters->>'fid',
               jsonb_build_object('moderate', 'test'),
               'RECEIVED';

        SELECT locaria_gateway(parameters,jsonb_build_object('_groups', jsonb_build_array('test','Admins'))) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('get_item TEST 5', ret_var#>'{features}'->0#>'{properties,_moderations}'->0 , '{fid}', parameters->>'fid');

        --RESET TEST DATA

        UPDATE locaria_data.locaria_test_data
        SET attributes = attributes -'acl' -'tags';
        PERFORM locaria_internal_gateway(jsonb_build_object('method', 'refresh_search_view'));

    END;
$$ LANGUAGE PLPGSQL;