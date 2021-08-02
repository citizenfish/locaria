DO
$$
DECLARE
    ret_var JSON;
BEGIN

    SELECT locus_core.locus_gateway(
        json_build_object('method', 'search', 'category', 'Community')

    ) INTO ret_var;


    RAISE NOTICE 'RESULT %', ret_var;
END;
$$ LANGUAGE PLPGSQL