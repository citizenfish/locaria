DO
$$
    DECLARE
        ret_var JSONB;
        parameters JSONB DEFAULT jsonb_build_object('method', 'report', 'report_name', 'get_local_authority_list');
    BEGIN

        SET SEARCH_PATH = 'locaria_data','locaria_core', 'public';

        SELECT locaria_internal_gateway(parameters) INTO ret_var;

        RAISE NOTICE '%', locaria_tests.test_result_processor('get_local_authority_list TEST 1', ret_var , '{}', '[12346]');
    END;
$$ LANGUAGE PLPGSQL;