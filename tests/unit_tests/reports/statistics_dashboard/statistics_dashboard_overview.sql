DO
$$
    DECLARE
        ret_var JSONB;
        parameters JSONB DEFAULT jsonb_build_object('method', 'report', 'report_name', 'statistics_dashboard_overview');
    BEGIN

        SELECT locaria_internal_gateway(parameters) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('statistics_dashboard_overview TEST 1', ret_var , '{today,searches}', '*');
        RAISE NOTICE '%', locaria_tests.test_result_processor('statistics_dashboard_overview TEST 2', ret_var , '{week,searches}', '*');
        RAISE NOTICE '%', locaria_tests.test_result_processor('statistics_dashboard_overview TEST 3', ret_var , '{month,searches}', '*');
        RAISE NOTICE '%', locaria_tests.test_result_processor('statistics_dashboard_overview TEST 4', ret_var , '{year,searches}', '*');


        parameters = parameters || jsonb_build_object('date', (NOW() - Interval '1 days')::DATE);

        SELECT locaria_internal_gateway(parameters) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('statistics_dashboard_overview TEST 5', ret_var , '{today,searches}', '*');
        RAISE NOTICE '%', locaria_tests.test_result_processor('statistics_dashboard_overview TEST 6', ret_var , '{week,searches}', '*');
        RAISE NOTICE '%', locaria_tests.test_result_processor('statistics_dashboard_overview TEST 7', ret_var , '{month,searches}', '*');
        RAISE NOTICE '%', locaria_tests.test_result_processor('statistics_dashboard_overview TEST 8', ret_var , '{year,searches}', '*');

END;
$$ LANGUAGE PLPGSQL