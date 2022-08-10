DO
$$
    DECLARE
        ret_var JSONB;
        parameters JSONB DEFAULT jsonb_build_object('method', 'load_preview_file_data', 'table','test_upload', 'id', 1, 'category', 'LOCARIA_TEST');
    BEGIN

        SET SEARCH_PATH = 'locaria_core', 'public';

        SELECT locaria_internal_gateway(parameters) INTO ret_var;

        --RAISE NOTICE '%', locaria_tests.test_result_processor('preview_file_data TEST 1', ret_var->'items'->0 , '{id}', '*');

        --TODO more parameter tests
        RAISE NOTICE '%',ret_var;

    END;
$$