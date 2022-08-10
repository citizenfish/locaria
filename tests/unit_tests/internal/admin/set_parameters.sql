DO
$$
    DECLARE
        ret_var JSONB;
        parameters JSONB DEFAULT jsonb_build_object('method',           'set_parameters',
                                                    'parameter_name',   'test_1',
                                                    'parameters',       jsonb_build_object('test_1', '10'),
                                                    'acl',              jsonb_build_object('_groups', jsonb_build_array('Admins'))
                                                    );
        id_var BIGINT;
    BEGIN

        SET SEARCH_PATH = 'locaria_core', 'public';
        DELETE FROM parameters WHERE parameter_name ='test_1';

        SELECT locaria_internal_gateway(parameters) INTO ret_var;

        RAISE NOTICE '%', locaria_tests.test_result_processor('set_parameters TEST 1', ret_var , '{id}', '*');
        parameters = parameters || jsonb_build_object('_newACL', jsonb_build_object('view', jsonb_build_array('NOTAdmins')));
        id_var = (ret_var->>'id')::BIGINT;

        SELECT locaria_gateway(jsonb_build_object('method', 'get_parameters', 'parameter_name', 'test_1')) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('get_parameters TEST 2', ret_var , '{parameters,test_1,test_1}', '10');


        SELECT locaria_internal_gateway(parameters,parameters->'acl') INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('set_parameters TEST 3', ret_var , '{id}', id_var::TEXT);

        RAISE NOTICE '%',ret_var;

        SELECT locaria_gateway(jsonb_build_object('method', 'get_parameters', 'parameter_name', 'test_1')) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('get_parameters TEST 4', ret_var , '{error}', 'parameter not found');

    END;
$$