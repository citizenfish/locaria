DO
$$
    DECLARE
        ret_var JSONB;
        acl JSONB DEFAULT jsonb_build_object(
                '_userID', 'acl 1',
                '_groups' ,  jsonb_build_array('1')
            );
        parameters JSONB DEFAULT jsonb_build_object('method',  'add_user_store', 'user_store', jsonb_build_object('foo','baa'));
    BEGIN

        SET SEARCH_PATH = 'locaria_core', 'public';

        DELETE FROM user_store;

        SELECT locaria_gateway(parameters, acl) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('add_user_store TEST 1', ret_var , '{insert}', '1');

        parameters = jsonb_set(parameters, '{user_store}', jsonb_build_object('foo2','baa2'));

        SELECT locaria_gateway(parameters, acl) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('add_user_store TEST 2', ret_var , '{update}', '1');

        RAISE NOTICE '%',ret_var;
    END;
$$ LANGUAGE PLPGSQL;