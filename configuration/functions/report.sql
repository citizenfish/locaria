CREATE OR REPLACE FUNCTION locus_core.run_report(search_parameters JSON) RETURNS JSON AS
$$
DECLARE
    query_var TEXT;
    ret_var JSON;
    logid_var BIGINT;
BEGIN

    --This keeps us within our search schema when running code
    SET SEARCH_PATH = 'locus_core', 'public';

    SELECT report_parameters->>'sql'
    INTO query_var
    FROM reports
    WHERE report_name = search_parameters->>'report_name';

    IF query_var IS NULL THEN
        RAISE EXCEPTION 'Invalid or empty report name';
    END IF;


    EXECUTE query_var
    USING search_parameters
    INTO ret_var;

    IF ret_var IS NULL THEN
        RAISE EXCEPTION 'No response from query: [%] ',query_var;
    END IF;

    RETURN ret_var;

EXCEPTION WHEN OTHERS THEN
        INSERT INTO locus_core.logs(log_type, log_message)
        SELECT 'run_report',
               jsonb_build_object('parameters',search_parameters, 'response', SQLERRM)
        RETURNING id INTO logid_var;

    RETURN json_build_object('error', 'request could not be completed','system_log_id', logid_var);

END;
$$
LANGUAGE PLPGSQL;