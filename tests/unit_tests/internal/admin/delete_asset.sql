DO
$$
    DECLARE
        ret_var JSONB;
        uuid_var TEXT DEFAULT '12345678';
        acl_var JSONB DEFAULT jsonb_build_object('_groups', jsonb_build_array('Admins'));
        params JSONB DEFAULT jsonb_build_object('method',           'add_asset',
                                                'uuid',             uuid_var,
                                                'attributes',       jsonb_build_object('foo', 'baa'));

    BEGIN

        DELETE FROM locaria_core.assets WHERE uuid IN(uuid_var);

        SELECT locaria_core.locaria_internal_gateway(params) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('delete_asset TEST 1', ret_var , '{uuid}', uuid_var);

        --Now delete
        params = params || jsonb_build_object('method', 'delete_asset');

        SELECT locaria_core.locaria_internal_gateway(params,acl_var) INTO ret_var;
        RAISE NOTICE '% [%]', locaria_tests.test_result_processor('delete_asset TEST 2', ret_var , '{delete}', 'success'),ret_var;

    END;
$$
LANGUAGE PLPGSQL;