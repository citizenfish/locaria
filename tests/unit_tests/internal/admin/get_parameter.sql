DO
$$
    DECLARE
        ret_var JSONB;
        parameters JSONB DEFAULT jsonb_build_object('method',           'set_parameters',
                                                    'parameter_name',   'test_1',
                                                    'usage',            'BAA',
                                                    'parameters',       jsonb_build_object('test_1', '10', 'data', jsonb_build_object('foo', 'baa')));
        id_var BIGINT;
    BEGIN

        SET SEARCH_PATH = 'locaria_core', 'public';
        DELETE FROM parameters WHERE parameter_name ='test_1';

        SELECT locaria_internal_gateway(parameters) INTO ret_var;

        RAISE NOTICE '%', locaria_tests.test_result_processor('set_parameters TEST 1', ret_var , '{id}', '*');
        parameters = parameters || jsonb_build_object('_acl', jsonb_build_object('_groups', jsonb_build_array('Admins')));
        id_var = (ret_var->>'id')::BIGINT;

        SELECT locaria_gateway(jsonb_build_object('method', 'get_parameters', 'parameter_name', 'test_1')) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('get_parameters TEST 1', ret_var , '{parameters,test_1,data, test_1}', '10');

        SELECT locaria_gateway(jsonb_build_object('method', 'get_parameters')) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('get_parameters TEST 2', ret_var , '{parameters}', '*');

        SELECT locaria_gateway(jsonb_build_object('method', 'get_parameters', 'usage', 'BAA')) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('get_parameters TEST 3', ret_var , '{parameters,test_1,data,test_1}', '10');

        SELECT locaria_gateway(jsonb_build_object('method', 'get_parameters', 'usage', 'FOO','parameter_name', 'test_1')) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('get_parameters TEST 4', ret_var , '{error}', 'parameter not found');

        SELECT locaria_gateway(jsonb_build_object('method', 'get_parameters', 'usage', 'BAA','parameter_name', 'test_1')) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('get_parameters TEST 5', ret_var , '{parameters,test_1,data,test_1}', '10');

        SELECT locaria_gateway(jsonb_build_object('method', 'get_parameters', 'delete_key', 'data','parameter_name', 'test_1')) INTO ret_var;
        RAISE NOTICE '%',ret_var;
        --RAISE NOTICE '%', locaria_tests.test_result_processor('get_parameters TEST 5', ret_var , '{test_1,test_1}', '10');

        RAISE NOTICE '%',ret_var;
    END;
$$