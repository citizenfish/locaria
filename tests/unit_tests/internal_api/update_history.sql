DO
$$
DECLARE
    ret_var JSONB;
BEGIN

    SELECT locus_core.update_history(jsonb_build_object('refresh_view',true)) INTO ret_var;

    IF ret_var->>'error' IS NOT NULL OR  ret_var->>'refresh_view' != 'completed' THEN
        RAISE EXCEPTION 'Error %', ret_var;
    END IF;

    RAISE NOTICE 'TEST 1 PASS %', ret_var;

EXCEPTION WHEN OTHERS THEN

    RAISE NOTICE 'TEST FAILED %', SQLERRM;

END;
$$ LANGUAGE PLPGSQL;