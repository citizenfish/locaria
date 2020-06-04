DO
$$
DECLARE
    ret_var JSON;
BEGIN

    SELECT locus_core.locus_gateway(
        json_build_object('method', 'address_search',
                          'address', 'crofters church lane GU24 9EA')

    ) INTO ret_var;

 	IF COALESCE(ret_var->>'error', ''::TEXT) != '' THEN
        RAISE NOTICE '%', ret_var;
        RAISE EXCEPTION 'Report error %', (SELECT log_message FROM locus_core.logs WHERE id = (ret_var->>'log_id')::BIGINT);
    END IF;

    RAISE NOTICE 'RESULT %', ret_var;
EXCEPTION WHEN OTHERS THEN
	RAISE NOTICE 'ERROR ***';
END;
$$ LANGUAGE PLPGSQL