DO
$$
DECLARE
    ret_var JSONB;
    parameters JSONB DEFAULT jsonb_build_object('method', 'location_search', 'address', 'XX1');
    BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';

    SELECT locaria_gateway(parameters) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('search TEST 1', ret_var#>'{features}'->0 , '{properties,postcode}', 'XX1 1XA');

END;
$$ LANGUAGE PLPGSQL;