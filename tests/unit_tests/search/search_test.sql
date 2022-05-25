DO
$$
DECLARE
    ret_var JSONB;
    parameters JSONB DEFAULT jsonb_build_object('method', 'search', 'search_text', 'find me one');
BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';

    --Test one should find an item
    SELECT locaria_gateway(parameters) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('search TEST 1', ret_var#>'{geojson,features}'->0 , '{properties,description,title}', 'find me one');

    --Test two search on category
    parameters = parameters || jsonb_build_object('search_text', '*', 'category', 'LOCARIA_TEST');
    SELECT locaria_gateway(parameters) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('search TEST 1', ret_var#>'{geojson,features}'->0 , '{properties,description,title}', 'find me one');

    --Test three change category
    parameters = parameters || jsonb_build_object('search_text', '*', 'category', 'LOCARIA_TEST_MOD');
    SELECT locaria_gateway(parameters) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('search TEST 1', ret_var#>'{geojson,features}'->0 , '{properties,description,title}', 'find me two');


END;
$$ LANGUAGE PLPGSQL;