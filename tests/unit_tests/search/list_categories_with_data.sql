DO
$$
    DECLARE
        ret_var JSONB;
        parameters JSONB DEFAULT jsonb_build_object('method',  'list_categories_with_data');
    BEGIN

        SET SEARCH_PATH = 'locaria_core', 'public';

        SELECT locaria_gateway(parameters) INTO ret_var;

        IF (ret_var->'categories'->0) IS NULL  OR  ret_var->'categories' ? 'LOCARIA_TEST_NO_DATA'  THEN
            IF (ret_var->>'logid') IS NOT NULL THEN
                RAISE EXCEPTION '[list_categories] %', (SELECT log_message FROM logs WHERE id=(ret_var->>'logid')::BIGINT);
            END IF;

            RAISE EXCEPTION '[list_categories_with_data] TEST 1 expected LOCARIA_TEST got %',ret_var->'categories';
        END IF;

        RAISE NOTICE '[list_categories_with_data] TEST 1 PASSED expected LOCARIA_TEST got %',ret_var->'categories';


        EXCEPTION WHEN OTHERS THEN
        --we need transaction to complete so writes to log table will work
        RAISE NOTICE 'TEST FAIL %', SQLERMM;
    END;
$$ LANGUAGE PLPGSQL;