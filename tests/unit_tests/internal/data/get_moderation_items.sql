DO
$$
    DECLARE
        ret_var JSONB;
    BEGIN

        SELECT locaria_core.locaria_internal_gateway(jsonb_build_object('method','get_moderation_items')) INTO ret_var;

        IF ret_var->>'response_code' != '200' THEN
            RAISE EXCEPTION 'Test 1 fail %', ret_var;
        END IF;

        RAISE NOTICE 'TEST 1 PASS %', ret_var;


    EXCEPTION WHEN OTHERS THEN

        RAISE NOTICE 'TEST FAILED %', SQLERRM;

    END;
$$ LANGUAGE PLPGSQL;