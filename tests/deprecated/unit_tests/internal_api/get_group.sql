DO
$$
    DECLARE
        ret_var JSONB;
        group_name TEXT DEFAULT RANDOM()::TEXT;
    BEGIN

        SELECT locus_core.locus_internal_gateway(jsonb_build_object('method','add_group', 'group_name', group_name,'attributes', jsonb_build_object('acl', 'baa'))) INTO ret_var;

        IF ret_var->>'response_code' != '200' THEN
            RAISE EXCEPTION 'Test step 1 fail %', ret_var;
        END IF;

        RAISE NOTICE 'TEST 1 PASS %', ret_var;

        SELECT locus_core.locus_internal_gateway(jsonb_build_object('method','get_group', 'group_name', group_name)) INTO ret_var;

        IF ret_var->>'response_code' != '200' THEN
            RAISE EXCEPTION 'Test step 2 fail %', ret_var;
        END IF;

        RAISE NOTICE 'TEST 2 PASS %', ret_var;

    EXCEPTION WHEN OTHERS THEN

        RAISE NOTICE 'TEST FAILED %', SQLERRM;

    END;
$$ LANGUAGE PLPGSQL;