DELETE FROM locus_core.parameters WHERE parameter_name = 'view_refresh';

INSERT INTO locus_core.parameters(parameter_name, parameter)
SELECT 'view_refresh',
        jsonb_build_object('sql', 'REFRESH MATERIALIZED VIEW CONCURRENTLY locus_core.global_search_view');

DELETE FROM locus_core.parameters WHERE parameter_name = 'excluded_view_tables';

INSERT INTO locus_core.parameters(parameter_name, parameter)
SELECT 'excluded_view_tables',
	   json_build_array('ignore_me');