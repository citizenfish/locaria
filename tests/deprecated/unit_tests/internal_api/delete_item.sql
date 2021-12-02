DO
$$
DECLARE
    ret_var JSONB;
    ret_var2 JSONB;
    item_var JSONB DEFAULT jsonb_build_object(
                                              'attributes', jsonb_build_object('description', jsonb_build_object('title', 'TEST TITLE', 'text', RANDOM()::TEXT)),
                                              'geometry', 'SRID=4326;POINT(-1.1 53.1)',
                                              'category', 'Events',
                                              'search_date', now()::TEXT
                                               );
    item_id TEXT;
BEGIN

    --Add an item
    SELECT locus_core.locus_internal_gateway(jsonb_build_object('method','add_item', 'table', 'test_acl') || item_var) INTO ret_var;

    IF (ret_var->>'error') IS NOT NULL THEN
        RAISE EXCEPTION 'Test step 1 fail %', ret_var;
    END IF;

    --Refresh the view
    SELECT locus_core.locus_internal_gateway(jsonb_build_object('method','refresh_search_view')) INTO ret_var;

    IF (ret_var->>'message') != 'view refreshed' THEN
        RAISE EXCEPTION 'Test step 2 fail %', ret_var;
    END IF;

    --Check for item in view
    SELECT locus_core.locus_gateway(jsonb_build_object('method', 'search', 'search_text', item_var#>>'{attributes,description,text}')) INTO ret_var;

    IF ret_var#>'{features}'->0 IS NULL THEN
        RAISE EXCEPTION 'Test step 3 fail %', ret_var;
    END IF;

   --Now delete it
   SELECT locus_core.locus_internal_gateway(jsonb_build_object('method', 'delete_item', 'fid', ret_var->'features'->0->'properties'->>'fid')) INTO ret_var;

   IF COALESCE(ret_var->>'response_code','') != '200' THEN
       RAISE EXCEPTION 'Test step 4 fail %', ret_var->>'response_code';
   END IF;

   --Add an item with an acl
   item_var = item_var || jsonb_build_object('attributes', jsonb_build_object('description', jsonb_build_object('title', 'TEST TITLE', 'text', RANDOM()::TEXT)));


   --Add an item
       SELECT locus_core.locus_internal_gateway(jsonb_build_object('method','add_item', 'table', 'test_acl') || item_var, jsonb_build_object('delete', jsonb_build_array('100'))) INTO ret_var;

       IF (ret_var->>'error') IS NOT NULL THEN
           RAISE EXCEPTION 'Test step 5 fail %', ret_var;
       END IF;

       --Refresh the view
       SELECT locus_core.locus_internal_gateway(jsonb_build_object('method','refresh_search_view')) INTO ret_var;

       IF (ret_var->>'message') != 'view refreshed' THEN
           RAISE EXCEPTION 'Test step 6 fail %', ret_var;
       END IF;

       --Check for item in view
       SELECT locus_core.locus_gateway(jsonb_build_object('method', 'search', 'search_text', item_var#>>'{attributes,description,text}')) INTO ret_var;

       IF ret_var#>'{features}'->0 IS NULL THEN
           RAISE EXCEPTION 'Test step 7 fail %', ret_var;
       END IF;

      --Now delete it
      --Attempt to delete with no group should fail
      SELECT locus_core.locus_internal_gateway(jsonb_build_object('method', 'delete_item', 'fid', ret_var->'features'->0->'properties'->>'fid')) INTO ret_var2;

      IF COALESCE(ret_var2->>'response_code','') = '200'  THEN
          RAISE EXCEPTION 'Test step 8 fail %', ret_var2;
      END IF;

     --Now delete it
     --Attempt to delete with no group should pass
     SELECT locus_core.locus_internal_gateway(jsonb_build_object('method', 'delete_item', 'fid', ret_var->'features'->0->'properties'->>'fid', '_group', jsonb_build_array(100))) INTO ret_var;

     IF COALESCE(ret_var->>'response_code','') != '200' THEN
         RAISE EXCEPTION 'Test step 9 fail %', ret_var;
     END IF;


   RAISE NOTICE 'TEST PASS %',ret_var;
EXCEPTION WHEN OTHERS THEN

    RAISE NOTICE 'TEST FAILED %', SQLERRM;

END;
$$ LANGUAGE PLPGSQL;