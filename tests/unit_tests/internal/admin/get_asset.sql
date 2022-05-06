DO
$$
DECLARE
    ret_var JSONB;
    uuid_var TEXT DEFAULT '12345678';
    params JSONB DEFAULT jsonb_build_object('method',           'add_asset',
                                            'uuid',             uuid_var,
                                            'attributes',       jsonb_build_object('foo', 'baa'));

BEGIN

    DELETE FROM locaria_core.assets WHERE uuid IN(uuid_var);

    SELECT locaria_core.locaria_internal_gateway(params) INTO ret_var;

    RAISE NOTICE '%', locaria_tests.test_result_processor('get_asset TEST 1', ret_var , '{uuid}', uuid_var);

    params = params || jsonb_build_object('method', 'get_asset');
    SELECT locaria_core.locaria_internal_gateway(params) INTO ret_var;

    RAISE NOTICE 'get_asset TEST 2 %', ret_var;

    params = params - 'uuid' || jsonb_build_object('filter', jsonb_build_object('foo', 'baa'));

    SELECT locaria_core.locaria_internal_gateway(params) INTO ret_var;

    RAISE NOTICE 'get_asset TEST 3 %', ret_var;

    params = params - 'uuid' || jsonb_build_object('filter', jsonb_build_object('foo', 'not baa'));

    SELECT locaria_core.locaria_internal_gateway(params) INTO ret_var;

    RAISE NOTICE 'get_asset TEST 4 %', ret_var;

END;
$$
LANGUAGE PLPGSQL;