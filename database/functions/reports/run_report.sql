--Run a system report
DROP FUNCTION IF EXISTS locaria_core.run_report(search_parameters JSONB);

CREATE OR REPLACE FUNCTION locaria_core.run_report(search_parameters JSONB, admin_privilege_parameter BOOLEAN DEFAULT FALSE) RETURNS JSONB AS
$$
DECLARE
    query_var TEXT;
    ret_var JSONB;
    logid_var BIGINT;
    cu_var TEXT;
BEGIN

    --This keeps us within our search schema when running code

    SET SEARCH_PATH = 'locaria_core', 'public';

    SELECT report_parameters->>'sql'
    INTO query_var
    FROM reports
    WHERE report_name = search_parameters->>'report_name'
    AND admin_privilege::BOOLEAN = admin_privilege_parameter::BOOLEAN;

    IF query_var IS NULL THEN
        RAISE EXCEPTION 'Invalid or empty report name';
    END IF;

    --Belt and braces we flip to a limited priv user prior to executing query then flip back
    IF NOT admin_privilege_parameter THEN
        SELECT current_user INTO cu_var;
        SET SESSION ROLE locaria_report_user;
    END IF;

    RAISE NOTICE '%',query_var;

    EXECUTE query_var
    USING search_parameters
    INTO ret_var;

    IF NOT admin_privilege_parameter THEN
        EXECUTE 'SET SESSION ROLE '||cu_var;
    END IF;

    IF ret_var IS NULL THEN
        RAISE NOTICE 'No response from query: [%] ',query_var;
        RETURN jsonb_build_object();
    END IF;

    RETURN ret_var;

END;
$$
LANGUAGE PLPGSQL;