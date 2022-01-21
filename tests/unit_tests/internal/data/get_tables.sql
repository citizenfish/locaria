DO
$$
    DECLARE
        ret_var JSONB;
        parameters JSONB DEFAULT jsonb_build_object('method', 'get_tables','category','Planning');
    BEGIN

        SET SEARCH_PATH = 'locaria_core', 'public';

        SELECT locaria_internal_gateway(parameters) INTO ret_var;

        RAISE NOTICE '%', locaria_tests.test_result_processor('get_tables TEST 1', ret_var , '{tables}', '["planning"]');

    END;
$$