DO
$$
    DECLARE
        ret_var JSONB;
        parameters JSONB DEFAULT jsonb_build_object('method',           'set_parameters',
                                                    'parameter_name',   'test_1',
                                                    'usage',            'BAA',
                                                    'parameters',       jsonb_build_object('test_1', '10', 'data', jsonb_build_object('foo', 'baa')));
        id_var BIGINT;
        acl_var JSONB DEFAULT jsonb_build_object('_groups', jsonb_build_array('Admins'));
    BEGIN

        SET SEARCH_PATH = 'locaria_core', 'public';
        DELETE FROM parameters WHERE parameter_name ='test_1';

        SELECT locaria_internal_gateway(parameters) INTO ret_var;

        RAISE NOTICE '%', locaria_tests.test_result_processor('set_parameters TEST 1', ret_var , '{id}', '*');
        parameters = parameters || jsonb_build_object('_acl', jsonb_build_object('_groups', jsonb_build_array('Admins')));
        id_var = (ret_var->>'id')::BIGINT;

        SELECT locaria_internal_gateway(jsonb_build_object('method', 'delete_parameters', 'parameter_name', 'test_1')) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('delete_parameters TEST 1', ret_var , '{error}', 'delete failure: test_1');

        SELECT locaria_internal_gateway(jsonb_build_object('method', 'delete_parameters', 'parameter_name', 'test_1'), acl_var) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('delete_parameters TEST 1', ret_var , '{message}', 'delete success: test_1');

    END;
$$