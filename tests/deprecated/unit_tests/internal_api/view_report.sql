DO
$$
DECLARE
    ret_var JSONB;
BEGIN

    SELECT locus_core.locus_internal_gateway(jsonb_build_object('method','refresh_search_view')) INTO ret_var;

    IF ret_var->>'response_code' != '200' THEN
        RAISE EXCEPTION 'Test step 1 fail %', ret_var;
    END IF;

    RAISE NOTICE 'TEST 1 PASS %', ret_var;

    SELECT locus_core.locus_internal_gateway(jsonb_build_object('method','view_report')) INTO ret_var;

    IF ret_var->>'response_code' != '200'
        OR COALESCE(ret_var->>'add_item',ret_var->>'update_item', ret_var->>'delete_item') IS NULL
        OR concat_ws('',ret_var->>'add_item',ret_var->>'update_item', ret_var->>'delete_item') != '000'
        THEN
        RAISE EXCEPTION 'Test step 1 fail %', ret_var;
    END IF;

     RAISE NOTICE 'TEST 2 PASS %', ret_var;

EXCEPTION WHEN OTHERS THEN

    RAISE NOTICE 'TEST FAILED %', SQLERRM;

END;
$$ LANGUAGE PLPGSQL;