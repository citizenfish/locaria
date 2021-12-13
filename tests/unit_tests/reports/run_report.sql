DO
$$
    DECLARE
        ret_var JSONB;
        parameters JSONB DEFAULT jsonb_build_object('method', 'report', 'report_name', '_test_report');
    BEGIN

        SET SEARCH_PATH = 'locaria_data','locaria_core', 'public';
        DELETE FROM locaria_core.reports WHERE report_name='_test_report';

        INSERT INTO locaria_core.reports(report_name,report_parameters)
        SELECT '_test_report',
               jsonb_build_object('sql', $SQL$SELECT jsonb_build_object('_test_report','worked')$SQL$);

        SELECT locaria_gateway(parameters) INTO ret_var;

        IF (ret_var->>'_test_report') IS NULL THEN
            RAISE EXCEPTION '[run_report_test] TEST 1 expecting "worked" got %',ret_var;
        END IF;

        RAISE NOTICE '[run_report_test] TEST 1 expecting "worked" got %',ret_var;

        EXCEPTION WHEN OTHERS THEN
            --we need transaction to complete so writes to log table will work
            RAISE NOTICE '%', SQLERMM;
        END;
    $$ LANGUAGE PLPGSQL;