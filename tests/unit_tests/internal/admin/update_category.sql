DO
$$
DECLARE
    ret_var JSONB;
    category_name TEXT DEFAULT '_TEST';
    category_rename TEXT DEFAULT '_TEST2';
    params JSONB DEFAULT jsonb_build_object('method', 'update_category', 'category', category_name, 'attributes', jsonb_build_object('foo', 'baa'));
    id_var TEXT;

BEGIN

    DELETE FROM locaria_core.categories WHERE category IN(category_name,category_rename);

    SELECT locaria_core.locaria_internal_gateway(params) INTO ret_var;

    RAISE NOTICE '%', locaria_tests.test_result_processor('update_category TEST 1', ret_var , '{id}', '*');
    id_var = ret_var->>'id';

    SELECT locaria_core.locaria_internal_gateway(params) INTO ret_var;

    RAISE NOTICE '%', locaria_tests.test_result_processor('update_category TEST 2', ret_var , '{id}', id_var);

    params = params || jsonb_build_object('rename', category_rename);

    SELECT locaria_core.locaria_internal_gateway(params) INTO ret_var;

    RAISE NOTICE '%', locaria_tests.test_result_processor('update_category TEST 3', ret_var , '{id}', id_var);


END;
$$ LANGUAGE PLPGSQL;