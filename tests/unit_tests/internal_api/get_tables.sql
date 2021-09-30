DO
$$
DECLARE
    ret_var JSONB;
BEGIN

    SELECT locus_core.locus_internal_gateway(jsonb_build_object('method','get_tables')) INTO ret_var;

    RAISE NOTICE 'TEST PASS %', ret_var;

EXCEPTION WHEN OTHERS THEN

    RAISE NOTICE 'TEST FAILED %', SQLERRM;

END;
$$ LANGUAGE PLPGSQL;