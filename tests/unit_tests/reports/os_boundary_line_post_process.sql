DO
$$
    DECLARE
        ret_var JSONB;
        file_id_var INTEGER DEFAULT 46;
        parameters JSONB DEFAULT jsonb_build_object('method', 'report', 'report_name', 'os_boundary_line_post_process');
    BEGIN

        SET SEARCH_PATH = 'locaria_data','locaria_core', 'public';

        SELECT parameters || attributes
        INTO parameters
        FROM files
        WHERE id = file_id_var;

        SELECT locaria_internal_gateway(parameters) INTO ret_var;

        RAISE NOTICE 'DEBUG %', ret_var;
        --RAISE NOTICE '%', locaria_tests.test_result_processor('os_boundary_line_post_process TEST 1', ret_var , '{}', '[12346]');
    END;
$$ LANGUAGE PLPGSQL;