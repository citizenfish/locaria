DO
$$
DECLARE
    ret_var JSONB;
    parameters JSONB DEFAULT jsonb_build_object('method', 'location_search', 'address', 'SN1');
    BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';

    SELECT locaria_gateway(parameters) INTO ret_var;

    IF (ret_var->'features'->0) IS NULL THEN
        IF (ret_var->>'logid') IS NOT NULL THEN
            RAISE EXCEPTION '[address_search_test] %', (SELECT log_message FROM logs WHERE id=(ret_var->>'logid')::BIGINT);
        END IF;

        RAISE EXCEPTION '[address_search_test] TEST 1 %',ret_var;
    END IF;

    RAISE NOTICE 'TEST 1 PASSED %',ret_var;

    parameters = parameters || jsonb_build_object('address', 'THIS FAILS');

    SELECT locaria_gateway(parameters) INTO ret_var;

    IF (ret_var->'features'->0) IS NOT NULL THEN
        IF (ret_var->>'logid') IS NOT NULL THEN
            RAISE EXCEPTION '[address_search_test] %', (SELECT log_message FROM logs WHERE id=(ret_var->>'logid')::BIGINT);
        END IF;

        RAISE EXCEPTION '[address_search_test] TEST 2 %',ret_var;
    END IF;

    RAISE NOTICE 'TEST 2 PASSED %',ret_var;

END;
$$ LANGUAGE PLPGSQL;