DO
$$
    DECLARE
        ret_var JSONB;
        parameters JSONB DEFAULT jsonb_build_object('method',           'set_parameters',
                                                    'parameter_name',   'test_1',
                                                    'parameters',       jsonb_build_object('test_1', '10'),
                                                    'acl',              'external');
        id_var BIGINT;
    BEGIN

        SET SEARCH_PATH = 'locaria_core', 'public';

        SELECT locaria_internal_gateway(parameters) INTO ret_var;

        RAISE NOTICE '%', locaria_tests.test_result_processor('set_parameters TEST 1', ret_var , '{id}', '*');
        parameters = parameters || jsonb_build_object('acl', 'internal');
        id_var = (ret_var->>'id')::BIGINT;

        SELECT locaria_gateway(jsonb_build_object('method', 'get_parameters', 'parameter_name', 'test_1')) INTO ret_var;

        RAISE NOTICE '%', locaria_tests.test_result_processor('get_parameters TEST 1', ret_var , '{test_1}', '10');

        SELECT locaria_internal_gateway(parameters) INTO ret_var;

        RAISE NOTICE '%', locaria_tests.test_result_processor('set_parameters TEST 2', ret_var , '{id}', id_var::TEXT);

        SELECT locaria_gateway(jsonb_build_object('method', 'get_parameters', 'parameter_name', 'test_1')) INTO ret_var;

        RAISE NOTICE '%', locaria_tests.test_result_processor('get_parameters TEST 2', ret_var , '{error}', 'parameter not found');

    END;
$$