DO
$$
    DECLARE
        ret_var JSONB;
        parameters JSONB DEFAULT jsonb_build_object('method',  'add_message',
                                                    'message', jsonb_build_object('email', 'dave@nautoguide.com', 'message', 'Hello'));

    BEGIN

        SET SEARCH_PATH = 'locaria_core', 'public';

        SELECT locaria_gateway(parameters) INTO ret_var;

        RAISE NOTICE '%', locaria_tests.test_result_processor('set_parameters TEST 1', ret_var , '{id}', '*');

    END;
$$