DO
$$
DECLARE
    ret_var JSONB;
BEGIN


    SELECT locus_core.locus_gateway(jsonb_build_object())
    INTO ret_var;

    IF COALESCE(ret_var->>'error', '') != 'unsupported method' THEN
        RAISE EXCEPTION 'Invalid empty api error %', ret_var;
    END IF;

    --SEARCH
    SELECT locus_core.locus_gateway(jsonb_build_object('method', 'search'))
    INTO ret_var;

    IF COALESCE(ret_var->>'error', '') != '' THEN
        RAISE EXCEPTION 'search method fail % ', ret_var;
    END IF;

    --BBOXSEARCH
    SELECT locus_core.locus_gateway(jsonb_build_object('method', 'bboxsearch'))
    INTO ret_var;

    IF COALESCE(ret_var->>'error', '') != '' THEN
        RAISE EXCEPTION 'bboxsearch method fail % ', ret_var;
    END IF;

    --POINTSEARCH
    SELECT locus_core.locus_gateway(jsonb_build_object('method', 'pointsearch'))
    INTO ret_var;

    IF COALESCE(ret_var->>'error', '') != '' THEN
        RAISE EXCEPTION 'pointsearch method fail % ', ret_var;
    END IF;

    --DATESEARCH
    SELECT locus_core.locus_gateway(jsonb_build_object('method', 'datesearch'))
    INTO ret_var;

    IF COALESCE(ret_var->>'error', '') != '' THEN
        RAISE EXCEPTION 'datesearch method fail % ', ret_var;
    END IF;

    --FILTERSEARCH
    SELECT locus_core.locus_gateway(jsonb_build_object('method', 'filtersearch'))
    INTO ret_var;

    IF COALESCE(ret_var->>'error', '') != '' THEN
        RAISE EXCEPTION 'filtersearch method fail % ', ret_var;
    END IF;

    --GET_ITEM
    SELECT locus_core.locus_gateway(jsonb_build_object('method', 'get_item'))
    INTO ret_var;

    IF COALESCE(ret_var->>'error', '') != '' THEN
        RAISE EXCEPTION 'get_item method fail % ', ret_var;
    END IF;

    --LIST_CATEGORIES
    SELECT locus_core.locus_gateway(jsonb_build_object('method', 'list_categories'))
    INTO ret_var;

    IF COALESCE(ret_var->>'error', '') != '' THEN
        RAISE EXCEPTION 'list_categories method fail % ', ret_var;
    END IF;

    --LIST_CATEGORIES_WITH_DATA
    SELECT locus_core.locus_gateway(jsonb_build_object('method', 'list_categories_with_data'))
    INTO ret_var;

    IF COALESCE(ret_var->>'error', '') != '' THEN
        RAISE EXCEPTION 'list_categories_with_data method fail % ', ret_var;
    END IF;

     --ADDRESS_SEARCH
    SELECT locus_core.locus_gateway(jsonb_build_object('method', 'address_search'))
    INTO ret_var;

    IF COALESCE(ret_var->>'error', '') != '' THEN
         RAISE EXCEPTION 'address_search method fail % ', ret_var;
    END IF;

    RAISE NOTICE 'check_api_functions TEST PASSED %', ret_var;

EXCEPTION WHEN OTHERS THEN

    RAISE NOTICE 'check_api_functions TEST FAILED [%]', SQLERRM;
END;
$$ LANGUAGE PLPGSQL;