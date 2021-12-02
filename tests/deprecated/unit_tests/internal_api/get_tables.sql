DO
$$
DECLARE
    ret_var JSONB;
BEGIN

    SELECT locus_core.locus_internal_gateway(jsonb_build_object('method','get_tables')) INTO ret_var;

    RAISE NOTICE 'TEST 1 PASS %', ret_var;

    SELECT locus_core.locus_internal_gateway(jsonb_build_object('method','get_tables', 'category', 'Crime')) INTO ret_var;

        RAISE NOTICE 'TEST 2 PASS %', ret_var;

EXCEPTION WHEN OTHERS THEN

    RAISE NOTICE 'TEST FAILED %', SQLERRM;

END;
$$ LANGUAGE PLPGSQL;