DO
$$
DECLARE
    ret_var JSONB;
    parameters JSONB DEFAULT jsonb_build_object('method', 'search', 'expired', 'false');
    sc TEXT;
BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';

    SELECT attributes->>'sc' INTO sc FROM locaria_data.global_search_view WHERE (attributes->>'sc') IS NOT NULL LIMIT 1 OFFSET 3;

    parameters = parameters || jsonb_build_object('shortcode', sc);
    --Test one should find an item
    SELECT locaria_gateway(parameters) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('shortcode TEST 1', ret_var, '{url}', '*');
    RAISE NOTICE '%',ret_var;

    parameters = parameters || jsonb_build_object('shortcode', 'THIS WILL FAIL');
    SELECT locaria_gateway(parameters) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('shortcode TEST 2', ret_var, '{url}', 'NULL');

END;
$$ LANGUAGE PLPGSQL;