DO
$$
    DECLARE
        ret_var JSONB;
        parameters JSONB DEFAULT jsonb_build_object('method',  'list_categories');
    BEGIN

        SET SEARCH_PATH = 'locaria_core', 'public';

        SELECT locaria_gateway(parameters) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor_array('list_categories TEST 1', ret_var->'categories' , '{0}', 'acl_test', -1);

        RAISE NOTICE '%',ret_var;

        parameters = parameters || jsonb_build_object('attributes', 'true');
        SELECT locaria_gateway(parameters) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor_array('list_categories TEST 2', ret_var->'categories' , '{key}', 'acl_test', -1);


        parameters = parameters || jsonb_build_object('attributes', 'true', 'category', ret_var->'categories'->0->>'key');
        SELECT locaria_gateway(parameters) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor_array('list_categories TEST 3', ret_var->'categories' , '{key}', 'acl_test', -1);

        RAISE NOTICE '%', ret_var;
    END;
$$ LANGUAGE PLPGSQL;