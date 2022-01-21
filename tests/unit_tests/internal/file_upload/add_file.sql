DO
$$
DECLARE
    ret_var JSONB;
    parameters JSONB DEFAULT jsonb_build_object('method', 'add_file', 'file_attributes', jsonb_build_object('type', 'csv', 'name', 'File Foo', 'path', '/demo1.locaria.org-data/uploads/OLS Activities (1).xlsx'));
BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';
    RAISE NOTICE '***** WARNING TEST HAS CLEARED FILE TEST DATA ****';

    DELETE FROM files WHERE attributes @> jsonb_build_object('name', 'File Foo');
    SELECT locaria_internal_gateway(parameters) INTO ret_var;

    RAISE NOTICE '%', locaria_tests.test_result_processor('add_file TEST 1', ret_var , '{id}', '*');

END;
$$