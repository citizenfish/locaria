DO
$$
    DECLARE
        ret_var JSONB;
        parameters JSONB DEFAULT jsonb_build_object('method', 'add_file', 'file_attributes', jsonb_build_object('type', 'csv', 'name', 'File Foo'));
    BEGIN
        SET SEARCH_PATH = 'locaria_core', 'public';

        RAISE NOTICE '***** WARNING TEST HAS CLEARED FILE TEST DATA ****';

        DELETE FROM files WHERE attributes @> jsonb_build_object('name', 'File Foo');
        SELECT locaria_internal_gateway(parameters) INTO ret_var;

        RAISE NOTICE '%', locaria_tests.test_result_processor('update_file TEST 1', ret_var , '{id}', '*');

        parameters = jsonb_build_object('method', 'update_file', 'status', 'NEWSTATUS', 'id', ret_var->>'id', 'message', 'Foo Message', 'attributes', jsonb_build_object('foo','baa'));

        SELECT locaria_internal_gateway(parameters) INTO ret_var;

        RAISE NOTICE '% : %', locaria_tests.test_result_processor('update_file TEST 2', ret_var , '{id}', '*'), ret_var;

    END;
$$