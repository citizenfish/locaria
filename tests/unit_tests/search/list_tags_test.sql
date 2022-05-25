DO
$$
    DECLARE
        ret_var JSONB;
        parameters JSONB DEFAULT jsonb_build_object('method',  'list_tags');
    BEGIN

        SET SEARCH_PATH = 'locaria_core', 'public';

        UPDATE locaria_data.locaria_test_data
        SET attributes = attributes || jsonb_build_object('tags', jsonb_build_array('test', 'test2'));

        PERFORM locaria_internal_gateway(jsonb_build_object('method', 'refresh_search_view'));

        SELECT locaria_gateway(parameters) INTO ret_var;

        RAISE NOTICE '%', locaria_tests.test_result_processor_array('list_categories TEST 1', ret_var->'tags' , '{0}', 'test', -1);

        UPDATE locaria_data.locaria_test_data
        SET attributes = attributes -'tags';

        PERFORM locaria_internal_gateway(jsonb_build_object('method', 'refresh_search_view'));

    END;
$$ LANGUAGE PLPGSQL;