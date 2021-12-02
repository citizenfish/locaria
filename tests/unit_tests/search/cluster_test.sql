DO
$$
    DECLARE
        ret_var JSONB;
        parameters JSONB DEFAULT jsonb_build_object('method', 'search', 'search_text', '', 'category', '*', 'cluster', 'true');
    BEGIN

        SET SEARCH_PATH = 'locaria_core', 'public';

        SELECT locaria_gateway(parameters) INTO ret_var;

        IF (ret_var->'features'->0->'properties'->>'count') != '2' THEN
            IF (ret_var->>'logid') IS NOT NULL THEN
                RAISE EXCEPTION '[cluster_test] %', (SELECT log_message FROM logs WHERE id=(ret_var->>'logid')::BIGINT);
            END IF;

            RAISE EXCEPTION '[cluster_test] TEST 1 %',ret_var;
        END IF;

        RAISE NOTICE '[cluster_test] TEST 1 PASSED %',ret_var;

    END;
$$ LANGUAGE PLPGSQL;