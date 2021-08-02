DO
$$
DECLARE
    ret_var JSON;
BEGIN


    SELECT locus_core.locus_gateway(
        json_build_object('method',     'locate',
                          'location',   'Swindon'
                          )

    ) INTO ret_var;

    IF (ret_var->>'error') IS NOT NULL THEN

        RAISE NOTICE 'LOG MESSAGE %', (SELECT log_message FROM locus_core.logs WHERE id = (ret_var->>'system_log_id')::BIGINT);
    END IF;

    RAISE NOTICE 'RESULT %', ret_var;

END;
$$ LANGUAGE PLPGSQL;