DO
$$
DECLARE
    ret_var JSONB;
BEGIN

    SELECT locus_core.add_history(jsonb_build_object('test','foo 1')) INTO ret_var;

    IF ret_var->>'error' IS NOT NULL THEN
        RAISE EXCEPTION 'Error %', ret_var;
    END IF;

    RAISE NOTICE 'TEST 1 PASS %', ret_var;

EXCEPTION WHEN OTHERS THEN

    RAISE NOTICE 'TEST FAILED %', SQLERRM;

END;
$$ LANGUAGE PLPGSQL;