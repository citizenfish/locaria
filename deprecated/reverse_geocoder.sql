DO
$$
DECLARE
    ret_var JSON;
BEGIN

    SELECT locus_core.locus_gateway(
        json_build_object('method', 'revgeocoder',
                          'lon', '-0.739096370306078',
                          'lat', '51.3248153472153')

    ) INTO ret_var;

 	IF COALESCE(ret_var->>'error', ''::TEXT) != '' THEN
        RAISE NOTICE '%', ret_var;
        RAISE EXCEPTION 'Report error %', (SELECT log_message FROM locus_core.logs WHERE id = (ret_var->>'system_log_id')::BIGINT);
    END IF;

    RAISE NOTICE 'RESULT % Distance %', ret_var->'features'->0->'properties'->>'title', ret_var->'features'->0->'properties'->>'distance_rank';
EXCEPTION WHEN OTHERS THEN
	RAISE NOTICE 'ERROR *** % ***', SQLERRM;
END;
$$ LANGUAGE PLPGSQL