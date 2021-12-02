DO
$$
    DECLARE
        ret_var JSONB;
        parameters JSONB DEFAULT jsonb_build_object('method',  'list_categories');
    BEGIN

        SET SEARCH_PATH = 'locaria_core', 'public';

        SELECT locaria_gateway(parameters) INTO ret_var;

        IF (ret_var->'categories'->0) IS NULL  OR NOT ret_var->'categories' ? 'LOCARIA_TEST'  THEN
            IF (ret_var->>'logid') IS NOT NULL THEN
                RAISE EXCEPTION '[list_categories] %', (SELECT log_message FROM logs WHERE id=(ret_var->>'logid')::BIGINT);
            END IF;

            RAISE EXCEPTION '[list_categories] TEST 1 expected LOCARIA_TEST got %',ret_var->'categories';
        END IF;

        RAISE NOTICE '[list_categories] TEST 1 PASSED expected LOCARIA_TEST got %',ret_var->'categories';

    END;
$$ LANGUAGE PLPGSQL;