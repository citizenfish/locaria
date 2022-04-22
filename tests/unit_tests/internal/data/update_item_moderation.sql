DO
$$
    DECLARE
        ret_var JSONB;
        fid_var TEXT;
    BEGIN

    SELECT fid,
           attributes
    INTO fid_var,ret_var
        FROM locaria_data.global_search_view SV
        WHERE moderated_update
        AND (attributes->>'acl') IS NOT NULL
    LIMIT 1;

    SELECT locaria_core.locaria_internal_gateway(jsonb_build_object('method',        'update_item',
                                                                'fid',           fid_var,
                                                                'attributes',    jsonb_build_object('foo','baa')
                                                                )) INTO ret_var;

    IF COALESCE(ret_var->>'message','') != 'Item added to moderation queue'  THEN
        RAISE EXCEPTION 'Test step 1 fail %', ret_var;
    END IF;

    RAISE NOTICE 'TEST PASSED %', ret_var;

    END;
    $$ LANGUAGE PLPGSQL;