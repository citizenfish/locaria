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

            IF (ret_var->>'logid') IS NOT NULL THEN
                RAISE EXCEPTION '[run_report_test] %', (SELECT log_message FROM logs WHERE id=(ret_var->>'logid')::BIGINT);
            END IF;

            RAISE EXCEPTION '[run_report_test] TEST 1 expecting "worked" got %',ret_var;
        END IF;

        RAISE NOTICE '[run_report_test] TEST 1 expecting "worked" got %',ret_var;

        DELETE FROM locaria_core.reports WHERE report_name='_test_report';
        INSERT INTO locaria_core.reports(report_name,report_parameters,admin_privilege)
        SELECT '_test_report',
               jsonb_build_object('sql', $SQL$SELECT jsonb_build_object('_test_report','worked')$SQL$),
               TRUE;

        SELECT locaria_gateway(parameters) INTO ret_var;

        IF (ret_var->>'error') IS  NULL THEN

            IF (ret_var->>'logid') IS  NULL THEN
                RAISE EXCEPTION '[run_report_test] %', (SELECT log_message FROM logs WHERE id=(ret_var->>'logid')::BIGINT);
            END IF;

            RAISE EXCEPTION '[run_report_test] TEST 2 NOT expecting "worked" got %',ret_var;
        END IF;

        RAISE NOTICE '[run_report_test] TEST 2 expecting "error" got %',ret_var;

        SELECT locaria_internal_gateway(parameters) INTO ret_var;
        IF (ret_var->>'_test_report') IS NULL THEN

            IF (ret_var->>'logid') IS NOT NULL THEN
                RAISE EXCEPTION '[run_report_test] %', (SELECT log_message FROM logs WHERE id=(ret_var->>'logid')::BIGINT);
            END IF;

            RAISE EXCEPTION '[run_report_test] TEST 1 expecting "worked" got %',ret_var;
        END IF;

        RAISE NOTICE '[run_report_test] TEST 3 expecting "worked" got %',ret_var;

        DELETE FROM locaria_core.reports WHERE report_name='_test_report';

        RAISE NOTICE '[run_report_test] TEST 3 expecting "worked" got %',ret_var;

        END;
    $$ LANGUAGE PLPGSQL;