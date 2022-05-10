DO
$$
    DECLARE
        ret_var JSONB;
        parameters JSONB DEFAULT jsonb_build_object('method', 'report', 'report_name', 'statistics_dashboard_line_items');
    BEGIN

        SELECT locaria_internal_gateway(parameters) INTO ret_var;
        RAISE NOTICE '%',ret_var;

        parameters = parameters || jsonb_build_object('date', (NOW() - Interval '5 days')::DATE);

        RAISE NOTICE '%', parameters;

        SELECT locaria_internal_gateway(parameters) INTO ret_var;
        RAISE NOTICE '%',ret_var;

END;
$$ LANGUAGE PLPGSQL