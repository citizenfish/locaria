DO
$$
DECLARE
    ret_var JSON;
BEGIN


     SELECT locus_core.locus_gateway(
        json_build_object('method', 'search',
                          'category', 'Planning',
                          'limit', 1,
                          'filter', json_build_object('type', 'Listed Building'))

    ) INTO ret_var;


    IF (ret_var->>'error') IS NOT NULL THEN
        RAISE NOTICE 'LOG MESSAGE %', (SELECT log_message FROM locus_core.logs WHERE id = (ret_var->>'system_log_id')::BIGINT);
    END IF;



    SELECT locus_core.locus_gateway(
        json_build_object('method', 'search',
                          'category', 'Planning',
                          'limit', 1,
                          'filter', '{"type":"Listed Building"}')

    ) INTO ret_var;


    IF (ret_var->>'error') IS NOT NULL THEN
        RAISE NOTICE 'LOG MESSAGE %', (SELECT log_message FROM locus_core.logs WHERE id = (ret_var->>'system_log_id')::BIGINT);
    END IF;


    RAISE NOTICE 'RESULT %', ret_var;
END;
$$ LANGUAGE PLPGSQL