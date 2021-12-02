DO
$$
DECLARE
    ret_var JSONB;
    fid_var TEXT;
BEGIN

    SELECT fid INTO fid_var FROM locus_core.global_search_view LIMIT 1;

    SELECT locus_core.locus_gateway(jsonb_build_object('method', 'get_item', 'fid', fid_var))
    INTO ret_var;

    IF COALESCE(ret_var->>'error', '') != '' AND ret_var->>'response_code' = '200' THEN
        RAISE EXCEPTION 'get_item method fail % ', ret_var;
    END IF;

    RAISE NOTICE 'get_item TEST 1 PASS %', ret_var;

    SELECT locus_core.locus_gateway(jsonb_build_object('method', 'get_item', 'fid', fid_var, 'live', true))
    INTO ret_var;

    IF COALESCE(ret_var->>'error', '') != '' AND ret_var->>'response_code' = '200' THEN
        RAISE EXCEPTION 'get_item method fail % ', ret_var;
    END IF;

    RAISE NOTICE 'get_item TEST 2 (live) PASS %', ret_var;
END;
$$ LANGUAGE PLPGSQL;