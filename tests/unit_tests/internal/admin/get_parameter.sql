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

        --set a parameter public
        parameters = jsonb_build_object('method',           'set_parameters',
                                        'parameter_name',   'test_2_PUBLIC',
                                        'usage',            'BAA',
                                        'parameters',       jsonb_build_object('test_2_PUBLIC', '12', 'data', jsonb_build_object('foo', 'baa_public')));

        SELECT locaria_internal_gateway(parameters) INTO ret_var;

        --same for admin only
        parameters = jsonb_build_object('method',           'set_parameters',
                                        'parameter_name',   'test_2',
                                        'usage',            'BAA',
                                        'parameters',       jsonb_build_object('test_2', '12', 'data', jsonb_build_object('foo', 'baa_admin')));

        SELECT locaria_internal_gateway(parameters, jsonb_build_object('_newACL', jsonb_build_object('view', jsonb_build_array('Admins')))) INTO ret_var;

        SELECT locaria_gateway(jsonb_build_object('method', 'get_parameters', 'usage', 'BAA','parameter_name', 'test_2')) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('get_parameters TEST 5', ret_var , '{parameters,test_2,data,test_2_PUBLIC}', '12');

    END;
$$