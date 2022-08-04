DO
$$
    DECLARE
        ret_var JSONB;
        acl JSONB DEFAULT jsonb_build_object(
                '_userID', 'acl 3',
                '_groups' ,  jsonb_build_array('1')
            );
        search_params JSONB DEFAULT jsonb_build_object('method', 'get_item');
        fid_var TEXT;
    BEGIN

        SET SEARCH_PATH = 'locaria_core', 'public';

        IF (SELECT 1 FROM locaria_data.test_acl limit 1) IS NULL THEN
            RAISE EXCEPTION 'acl_test table missing run acl_test_data.sql';
        END IF;

        SELECT fid
        INTO fid_var
        FROM locaria_data.global_search_view
        WHERE attributes @> jsonb_build_object('description', jsonb_build_object('text', 'acl none'));
        search_params = search_params || jsonb_build_object('fid', fid_var);

        --TEST 1 - single item with no acl
        SELECT locaria_core.locaria_gateway(search_params) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('search_test_with_acl TEST 1', ret_var , '{features}', '*');

        --TEST 2 item with view acl
        SELECT fid
        INTO fid_var
        FROM locaria_data.global_search_view
        WHERE attributes @> jsonb_build_object('description', jsonb_build_object('text', 'acl 3'));
        search_params = search_params || jsonb_build_object('fid', fid_var);

        SELECT locaria_core.locaria_gateway(search_params) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('search_test_with_acl TEST 2', ret_var , '{features}', '[]');

        --TEST 3 this should return the item
        SELECT locaria_core.locaria_gateway(search_params,acl) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('search_test_with_acl TEST 3', ret_var , '{features}', '*');

    END;
$$LANGUAGE PLPGSQL;