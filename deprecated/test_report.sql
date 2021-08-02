DO
$$
DECLARE
    ret_var JSON;
BEGIN

    DELETE FROM locus_core.reports;
    INSERT INTO locus_core.reports(report_name, report_parameters)
    SELECT 'democracy_location', jsonb_build_object('sql',

    $SQL$

        SELECT json_build_object('foo', 'baa');

    $SQL$
    );


    SELECT locus_core.locus_gateway(
        json_build_object('method',      'report',
                          'report_name', 'democracy_location')

    ) INTO ret_var;

    IF COALESCE(ret_var->>'error', ''::TEXT) != '' THEN
        RAISE NOTICE '%', ret_var;
        RAISE EXCEPTION 'Report error %', (SELECT log_message FROM locus_core.logs WHERE id = (ret_var->>'system_log_id')::BIGINT);
    END IF;

    RAISE NOTICE 'RESULT %', ret_var;
END;
$$ LANGUAGE PLPGSQL