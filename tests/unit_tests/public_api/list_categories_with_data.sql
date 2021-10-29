DO
$$
DECLARE
    ret_var JSONB;
BEGIN


    SELECT locus_core.locus_gateway(jsonb_build_object('method', 'list_categories_with_data'))
    INTO ret_var;

    IF COALESCE(ret_var->>'error', '') != '' AND ret_var->>'response_code' = '200'  THEN
        RAISE EXCEPTION 'list_categories_with_data method fail % ', ret_var;
    END IF;

    RAISE NOTICE 'list_categories_with_data TEST PASS %', ret_var;
END;
$$ LANGUAGE PLPGSQL;