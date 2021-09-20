DO
$$
DECLARE
    ret_var JSONB;
BEGIN

    SELECT jsonb_agg(R.*)
    INTO ret_var
    FROM (
        SELECT * FROM locus_core.search_get_records(jsonb_build_object('category', 'Planning', 'search_text', 'offices'))
    ) R;

    RAISE NOTICE '%', ret_var;

END;
$$
LANGUAGE PLPGSQL;