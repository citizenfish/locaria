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
        RAISE NOTICE '%', locaria_tests.test_result_processor('run_report TEST 1', ret_var , '{_test_report}', 'worked');

        DELETE FROM locaria_core.reports WHERE report_name='_test_report';
        INSERT INTO locaria_core.reports(report_name,report_parameters,admin_privilege)
        SELECT '_test_report',
               jsonb_build_object('sql', $SQL$SELECT jsonb_build_object('_test_report','worked')$SQL$),
               TRUE;

        SELECT locaria_gateway(parameters) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('run_report TEST 2', ret_var , '{error}', '*');

        SELECT locaria_internal_gateway(parameters) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('run_report TEST 3', ret_var , '{_test_report}', 'worked');

        DELETE FROM locaria_core.reports WHERE report_name='_test_report';

        INSERT INTO locaria_core.reports(report_name,report_parameters,admin_privilege)
        SELECT '_test_report',
               jsonb_build_object('sql', $SQL$SELECT jsonb_build_object('_test_report','worked')$SQL$, 'acl', jsonb_build_object('view', jsonb_build_array('TESTERS'))),
               TRUE;

        SELECT locaria_internal_gateway(parameters) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('run_report TEST 4', ret_var , '{error}', '*');

        SELECT locaria_internal_gateway(parameters, jsonb_build_object('_groups', jsonb_build_array('TESTERS'))) INTO ret_var;
        RAISE NOTICE '%', locaria_tests.test_result_processor('run_report TEST 5', ret_var , '{_test_report}', 'worked');

        END;
    $$ LANGUAGE PLPGSQL;