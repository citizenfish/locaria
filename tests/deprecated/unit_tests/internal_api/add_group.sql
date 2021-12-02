DO
$$
    DECLARE
        ret_var JSONB;
    BEGIN

        DELETE FROM locus_core.groups WHERE group_name = 'foo';

        SELECT locus_core.locus_internal_gateway(jsonb_build_object('method','add_group', 'group_name', 'foo','attributes', jsonb_build_object('foo', 'baa')), jsonb_build_object('group','combi')) INTO ret_var;

        IF ret_var->>'response_code' != '200' THEN
            RAISE EXCEPTION 'Test step 1 fail %', ret_var;
        END IF;

        RAISE NOTICE 'TEST 1 PASS %', ret_var;

        --Must fail as duplicate group name
        SELECT locus_core.locus_internal_gateway(jsonb_build_object('method','add_group', 'group_name', 'foo')) INTO ret_var;

        IF ret_var->>'response_code' != '650' THEN
            RAISE EXCEPTION 'Test step 2 fail %', ret_var;
        END IF;

        RAISE NOTICE 'TEST 2 PASS %', ret_var;

    EXCEPTION WHEN OTHERS THEN

        RAISE NOTICE 'TEST FAILED %', SQLERRM;

    END;
$$ LANGUAGE PLPGSQL;