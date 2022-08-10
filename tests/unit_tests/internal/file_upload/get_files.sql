DO
$$
    DECLARE
        ret_var JSONB;
        ret_var2 JSONB;
        get_files_var JSONB;
        parameters JSONB DEFAULT jsonb_build_object('method', 'add_file', 'file_attributes', jsonb_build_object('type', 'csv', 'name', 'File Foo'));
    BEGIN

        SET SEARCH_PATH = 'locaria_core', 'public';
        RAISE NOTICE '***** WARNING TEST HAS CLEARED ALL FILE DATA ****';

        DELETE FROM files;

        SELECT locaria_internal_gateway(parameters) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('add_file TEST 1', ret_var , '{id}', '*');



        parameters = jsonb_build_object('method', 'add_file', 'file_attributes', jsonb_build_object('type', 'csv', 'name', 'File BAA'));

        SELECT locaria_internal_gateway(parameters) INTO ret_var2;
        RAISE NOTICE '%', locaria_tests.test_result_processor('get_files TEST 2', ret_var2 , '{id}', '*');



        --All files come back
        parameters = jsonb_build_object('method', 'get_files');
        SELECT locaria_internal_gateway(parameters) INTO get_files_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor_array('get_files TEST 3', get_files_var->'files' , '{id}', '*', 2);

        RAISE NOTICE '%',get_files_var;

        --Only id comes back
        parameters = jsonb_build_object('method', 'get_files', 'id', ret_var->>'id');
        SELECT locaria_internal_gateway(parameters) INTO get_files_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor_array('get_files TEST 4', get_files_var->'files' , '{id}', ret_var->>'id', 1);

        --Status check
        parameters = jsonb_build_object('method', 'update_file', 'status', 'NEWSTATUS', 'id', ret_var->>'id');
        SELECT locaria_internal_gateway(parameters) INTO ret_var;
        parameters = jsonb_build_object('method', 'get_files', 'status', 'NEWSTATUS');
        SELECT locaria_internal_gateway(parameters) INTO get_files_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor_array('get_files TEST 5', get_files_var->'files' , '{id}', ret_var->>'id', 1);

        --Filter check
        parameters = jsonb_build_object('method', 'get_files', 'filter', jsonb_build_object('name', 'File Baa'));
        SELECT locaria_internal_gateway(parameters) INTO get_files_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor_array('get_files TEST 6', get_files_var->'files' , '{id}', ret_var2->>'id', 0);

        --Deleted check
        UPDATE files SET status = 'DELETED';
        parameters = jsonb_build_object('method', 'get_files');
        SELECT locaria_internal_gateway(parameters) INTO get_files_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor_array('get_files TEST 7', get_files_var->'files' , '{id}', '*', 0);

        --tidy up
        DELETE FROM files;
    END;
$$