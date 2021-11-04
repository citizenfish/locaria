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
    acl_var JSONB;
    update_fid TEXT;
BEGIN

    --Add an item
    SELECT locus_core.locus_internal_gateway(jsonb_build_object('method','add_item', 'table', 'test_events') || item_var) INTO ret_var;

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

    update_fid = ret_var->'features'->0->'properties'->>'fid';
   --Now update it
   SELECT locus_core.locus_internal_gateway(jsonb_build_object('method',        'update_item',
                                                               'fid',           update_fid,
                                                               --we update the acl and should not be able to update again
                                                               'attributes',    jsonb_build_object('foo','baa'),
                                                               'category',      'Events',
                                                               'geometry',      'SRID=4326;POINT(1.2 54.1)',
                                                               'search_date',   NOW()::TEXT),jsonb_build_object('update', jsonb_build_array('100'))) INTO ret_var;

   IF COALESCE(ret_var->>'id','') != item_var->'features'->0->'properties'->>'fid' THEN
       RAISE EXCEPTION 'Test step 4 fail %', ret_var;
   END IF;

   RAISE NOTICE 'TEST Step 4 PASS %',ret_var;

   --Refresh the view
   SELECT locus_core.locus_internal_gateway(jsonb_build_object('method','refresh_search_view')) INTO ret_var;

  --Finally attempt to update an item that has an ACL
  SELECT locus_core.locus_internal_gateway(jsonb_build_object('method',        'update_item',
                                                              'fid',           update_fid,
                                                              --we previously update the acl and should not be able to update again
                                                              'attributes',    jsonb_build_object('foo','baa2'),
                                                              'category',      'Events',
                                                              'geometry',      'SRID=4326;POINT(1.2 54.1)',
                                                              'search_date',   NOW()::TEXT)) INTO ret_var;

  IF COALESCE(ret_var->>'id','') = item_var->'features'->0->'properties'->>'fid' THEN
      RAISE EXCEPTION 'Test step 5 fail %', ret_var;
  END IF;

 RAISE NOTICE 'TEST Step 5 (ACL UPDATE) PASS %',ret_var;


EXCEPTION WHEN OTHERS THEN

    RAISE NOTICE 'TEST FAILED %', SQLERRM;

END;
$$ LANGUAGE PLPGSQL;