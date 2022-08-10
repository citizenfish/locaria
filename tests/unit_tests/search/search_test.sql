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
    RAISE NOTICE '%', locaria_tests.test_result_processor('search TEST 2', ret_var#>'{geojson,features}'->0 , '{properties,description,title}', 'find me order');

    --Test three change category
    parameters = parameters || jsonb_build_object('search_text', '*', 'category', 'LOCARIA_TEST_MOD');
    SELECT locaria_gateway(parameters) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('search TEST 3', ret_var#>'{geojson,features}'->0 , '{properties,description,title}', 'find me two');

    --Test Four change ranking_attributes
    parameters = jsonb_build_object('search_text', 'bbbbb', 'method', 'search', 'ranking_attribute', 'description,order') ;
    SELECT locaria_gateway(parameters) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('search TEST 4', ret_var#>'{geojson,features}'->0 , '{properties,description,title}', 'find me two');

    --Test Five _order override
    parameters = jsonb_build_object('search_text', '', 'method', 'search') ;
    SELECT locaria_gateway(parameters) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('search TEST 5', ret_var#>'{geojson,features}'->0 , '{properties,description,title}', 'find me order');

    --Test Six display_limit _order override
    parameters = jsonb_build_object('search_text', '', 'method', 'search', 'display_limit', 1) ;
    SELECT locaria_gateway(parameters) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('search TEST 6', ret_var#>'{geojson,features}'->0 , '{properties,description,title}', 'find me order');

    RAISE NOTICE ' Should only be one feature %', ret_var#>>'{geojson,features}';
END;
$$ LANGUAGE PLPGSQL;