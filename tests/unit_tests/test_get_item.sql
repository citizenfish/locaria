DO
$$
DECLARE
    ret_var JSON;
BEGIN

    SELECT locus_core.locus_gateway(
        json_build_object('method', 'search',
                          'search_text', '', 'category', 'Waste and Recycling', 'limit', '1')

    ) INTO ret_var;

    SELECT locus_core.locus_gateway(
        json_build_object('method', 'get_item',
                          'fid',    ((ret_var->'features')->0)#>>'{properties,fid}'
                          )
    ) INTO ret_var;

    RAISE NOTICE 'FULL ITEM : %', ret_var;
END;
$$ LANGUAGE PLPGSQL;