DO
$$
    DECLARE
        ret_var JSONB;
        parameters JSONB DEFAULT jsonb_build_object('method', 'search', 'search_text', '', 'category', '*', 'cluster', 'true');
    BEGIN

        SET SEARCH_PATH = 'locaria_core', 'public';

        SELECT locaria_gateway(parameters) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('search TEST 1', ret_var#>'{geojson,features}'->0 , '{properties,count}', '1');

    END;
$$ LANGUAGE PLPGSQL;