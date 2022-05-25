DO
$$
    DECLARE
        ret_var JSONB;
        group_var JSONB DEFAULT jsonb_build_object('groups', jsonb_build_array('foo', 'baa'));
    BEGIN

        DELETE FROM locaria_core.sessions;

        SELECT locaria_core.session_api('set', '12346', group_var) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('set TEST 1', ret_var , '{id}', '12346');

        SELECT locaria_core.session_api('search_id', '12346') INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('search_id TEST 2', ret_var , '{id}', '[12346]');

        SELECT locaria_core.session_api('search_id', '12346FAIL') INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('search_id TEST 3', ret_var , '{id}', 'EMPTY');

        SELECT locaria_core.session_api('search_group', 'foo') INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('search_group TEST 4', ret_var , '{}', '[12346]');

        SELECT locaria_core.session_api('search_group', 'fooFAIL') INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('search_group TEST 5', ret_var , '{}', 'EMPTY');

END;
$$ LANGUAGE PLPGSQL;