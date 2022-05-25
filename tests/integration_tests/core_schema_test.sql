DO
$$
    DECLARE
        ret_var JSONB;

    BEGIN

        RAISE NOTICE 'Running test_core_schema TEST';

        SET SEARCH_PATH = 'locaria_core', 'public';

        --Check base tables
        PERFORM id FROM categories LIMIT 1;
        PERFORM id FROM files LIMIT 1;
        PERFORM group_name FROM groups LIMIT 1;
        PERFORM id FROM history LIMIT 1;
        PERFORM id FROM sessions LIMIT 1;
        PERFORM id FROM logs LIMIT 1;
        PERFORM id FROM parameters LIMIT 1;
        PERFORM id FROM reports LIMIT 1;

        --Check views
        SET SEARCH_PATH = 'locaria_data', 'public';
        PERFORM fid FROM global_search_view;
        PERFORM fid FROM global_search_view_live;
        PERFORM id FROM search_views_union;
        PERFORM id FROM base_table;
        PERFORM id FROM imports;
        PERFORM id FROM locaria_core.statistics_view;

        RAISE NOTICE 'test_core_schema TEST PASSED';

    EXCEPTION WHEN OTHERS THEN

        RAISE EXCEPTION 'test_core_schema TEST FAILED [%]', SQLERRM;

    END;
$$ LANGUAGE PLPGSQL;
