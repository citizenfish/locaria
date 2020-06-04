DO
$$
DECLARE
    table_var TEXT;
    ret_var JSON;
BEGIN

    SELECT (locus_core.get_json_data_urls()).* INTO table_var,ret_var;

    RAISE NOTICE 'TABLE VALUE  % ', table_var;
    RAISE NOTICE 'DATE VALUE  % ', ret_var->>'last_run';

    RAISE NOTICE '***UPDATING***';

    SELECT locus_core.update_json_data_urls(table_var, ret_var) INTO ret_var;

    RAISE NOTICE 'JSON VALUE  % ', ret_var;
END;
$$ LANGUAGE PLPGSQL;
