DO
$$
DECLARE
    ret_var JSON;
BEGIN




    SELECT locus_core.locus_gateway(
        json_build_object('method',      'report',
                          'report_name', 'democracy_location',
                          'location',    'SRID=4326;POINT(-0.743166424536075 51.3394703242612)')

    ) INTO ret_var;

    IF COALESCE(ret_var->>'error', ''::TEXT) != '' THEN
        RAISE NOTICE '%', ret_var;
        RAISE EXCEPTION 'Report error %', (SELECT log_message FROM locus_core.logs WHERE id = (ret_var->>'system_log_id')::BIGINT);
    END IF;

    RAISE NOTICE 'RESULT %', ret_var;
END;
$$ LANGUAGE PLPGSQL