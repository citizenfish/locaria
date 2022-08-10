DO
$$
    DECLARE
        ret_var JSONB;
        parameters JSONB DEFAULT jsonb_build_object('method', 'add_file', 'file_attributes', jsonb_build_object('type', 'csv', 'name', 'File Foo'));
    BEGIN

        SET SEARCH_PATH = 'locaria_core', 'public';
        RAISE NOTICE '***** WARNING TEST HAS CLEARED FILE  DATA ****';

        DELETE FROM files;
        SELECT locaria_internal_gateway(parameters) INTO ret_var;

        RAISE NOTICE '%', locaria_tests.test_result_processor('delete_file TEST 1', ret_var , '{id}', '*');

        parameters = jsonb_build_object('method', 'delete_file', 'id', ret_var->>'id');
        SELECT locaria_internal_gateway(parameters) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('delete_file TEST 2', ret_var , '{message}', 'file marked as deleted');

        RAISE NOTICE '%',ret_var;

        --Check no files returned
        parameters = jsonb_build_object('method', 'get_files');
        SELECT locaria_internal_gateway(parameters) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor_array('delete_file TEST 3', ret_var->'files' , '{id}', '*', 0);

        RAISE NOTICE '%',ret_var;

    END;
$$