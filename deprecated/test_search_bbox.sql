DO
$$
DECLARE
    ret_var JSON;
BEGIN

    SELECT locus_core.locus_gateway(
        json_build_object('method', 'bboxsearch',
                          'search_text', '', 'category', 'Events',
                          'bbox', '-0.8 51.3,-0.7 51.4')

    ) INTO ret_var;


    RAISE NOTICE 'RESULT %', ret_var;
END;
$$ LANGUAGE PLPGSQL