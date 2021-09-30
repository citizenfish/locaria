DO
$$
DECLARE
    ret_var JSONB;
    item_var JSONB DEFAULT jsonb_build_object(
                                              'attributes', jsonb_build_object('description', jsonb_build_object('title', 'TEST TITLE', 'text', RANDOM()::TEXT)),
                                              'geometry', 'SRID=4326;POINT(-1.1 53.1)',
                                              'category', 'Events',
                                              'search_date', now()::TEXT
                                               );
    item_id TEXT;
BEGIN

    --This should fail
    SELECT locus_core.locus_internal_gateway(jsonb_build_object('method','add_item', 'table', 'fail')) INTO ret_var;

    IF (ret_var->>'error') IS NULL THEN
        RAISE EXCEPTION 'Test step 1 fail %', ret_var;
    END IF;

    --Add an item
    SELECT locus_core.locus_internal_gateway(jsonb_build_object('method','add_item', 'table', 'test_events') || item_var) INTO ret_var;

    IF (ret_var->>'id') IS NULL THEN
        RAISE EXCEPTION 'Test step 2 fail %', ret_var;
    END IF;

    item_id = ret_var->>'id';
    RAISE NOTICE 'Created %', item_id;

    --Refresh the view
    SELECT locus_core.locus_internal_gateway(jsonb_build_object('method','refresh_search_view')) INTO ret_var;

    IF (ret_var->>'message') != 'view refreshed' THEN
        RAISE EXCEPTION 'Test step 3 fail %', ret_var;
    END IF;

    --Check for item in view
    SELECT locus_core.locus_gateway(jsonb_build_object('method', 'search', 'search_text', item_var#>>'{attributes,description,text}')) INTO ret_var;

    IF ret_var#>'{features}'->0 IS NULL THEN
        RAISE EXCEPTION 'Test step 4 fail %', ret_var;
    END IF;

    RAISE NOTICE 'TEST PASS %',ret_var;
EXCEPTION WHEN OTHERS THEN

    RAISE NOTICE 'TEST FAILED %', SQLERRM;

END;
$$ LANGUAGE PLPGSQL;