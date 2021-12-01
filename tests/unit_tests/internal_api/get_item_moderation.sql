DO
$$
    DECLARE
        ret_var JSONB;
        fid_var TEXT;
    BEGIN

        SELECT fid INTO fid_var FROM locus_core.moderation_queue LIMIT 1;

        SELECT locus_core.locus_gateway(jsonb_build_object('method', 'get_item', 'fid', fid_var, 'live', true))
        INTO ret_var;

        IF  ret_var->>'response_code' != '200' THEN
            RAISE EXCEPTION 'get_item method fail % ', (SELECT log_message FROM locus_core.logs where id = (ret_var#>>'{system_log_id,logid}')::BIGINT);

        END IF;

        RAISE NOTICE 'get_item TEST 1 PASS %', ret_var->'features'->0->'properties'->'_moderations';


    END;
$$ LANGUAGE PLPGSQL;