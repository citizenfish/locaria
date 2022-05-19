DO
$$
DECLARE
    ret_var JSONB;
    acl JSONB DEFAULT jsonb_build_object(
            '_userID', 'acl 3',
            '_groups' ,  jsonb_build_array('1')
        );
    search_params JSONB DEFAULT jsonb_build_object('method', 'search', 'search_text', 'acl none');
BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';

    IF (SELECT 1 FROM locaria_data.test_acl limit 1) IS NULL THEN
        RAISE EXCEPTION 'acl_test table missing please run acl_test_data.sql';
    END IF;

    --TEST 1 - single item with no acl
    SELECT locaria_core.locaria_gateway(search_params) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('search_test_with_acl TEST 1', ret_var , '{geojson,features}', '*');

    --TEST 2 - item with acl
    search_params = search_params || jsonb_build_object('search_text', 'acl 1');
    SELECT locaria_core.locaria_gateway(search_params) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('search_test_with_acl TEST 2', ret_var , '{geojson,features}', '[]');

    --TEST 3 - repeat but with correct acl
    search_params = search_params || jsonb_build_object('search_text', 'acl 1');
    SELECT locaria_core.locaria_gateway(search_params, acl) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('search_test_with_acl TEST 3', ret_var , '{geojson,features}', '*');

    --TEST 4 - repeat but with correct acl on incorrect item
    search_params = search_params || jsonb_build_object('search_text', 'acl 2');
    SELECT locaria_core.locaria_gateway(search_params, acl) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('search_test_with_acl TEST 4', ret_var , '{geojson,features}', '[]');

    --TEST 5 - owner search
    search_params = search_params || jsonb_build_object('search_text', 'acl 3');
    SELECT locaria_core.locaria_gateway(search_params, acl) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('search_test_with_acl TEST 5', ret_var , '{geojson,features}', '*');

    --TEST 6 - owner search which should fail
    search_params = search_params || jsonb_build_object('search_text', 'acl 3');
    acl = jsonb_build_object(
            '_userID', 'acl 4',
            '_groups' ,  jsonb_build_array('1')
        );
    SELECT locaria_core.locaria_gateway(search_params, acl) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('search_test_with_acl TEST 6', ret_var , '{geojson,features}', '[]');

END;
$$LANGUAGE PLPGSQL;