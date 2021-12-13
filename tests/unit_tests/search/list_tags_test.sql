DO
$$
    DECLARE
        ret_var JSONB;
        parameters JSONB DEFAULT jsonb_build_object('method',  'list_tags');
    BEGIN

        SET SEARCH_PATH = 'locaria_core', 'public';

        UPDATE locaria_data.locaria_test_data
        SET attributes = attributes || jsonb_build_object('tags', jsonb_build_array('test', 'test2'));

        PERFORM locaria_internal_gateway(jsonb_build_object('method', 'refresh_search_view'));

        SELECT locaria_gateway(parameters) INTO ret_var;

        IF (ret_var->'tags'->0) IS NULL  OR NOT ret_var->'tags' ? 'test2'   THEN
            IF (ret_var->>'logid') IS NOT NULL THEN
                RAISE EXCEPTION '[list_tags] %', (SELECT log_message FROM logs WHERE id=(ret_var->>'logid')::BIGINT);
            END IF;

            RAISE EXCEPTION '[list_tags] TEST 1 expected [test,test2] got %',ret_var->'tags';
        END IF;

        RAISE NOTICE '[list_tags] TEST 1 PASSED expected [test,test2] got %',ret_var->'tags';

        UPDATE locaria_data.locaria_test_data
        SET attributes = attributes -'tags';

        PERFORM locaria_internal_gateway(jsonb_build_object('method', 'refresh_search_view'));


        EXCEPTION WHEN OTHERS THEN
        --we need transaction to complete so writes to log table will work
        RAISE NOTICE 'TEST FAIL %', SQLERMM;
    END;
$$ LANGUAGE PLPGSQL;