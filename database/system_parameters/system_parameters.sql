DELETE FROM locaria_core.parameters WHERE parameter_name = 'view_refresh';

INSERT INTO locaria_core.parameters(parameter_name, parameter, acl)
SELECT 'view_refresh',
        jsonb_build_object('sql', 'REFRESH MATERIALIZED VIEW CONCURRENTLY locaria_core.global_search_view'),
       jsonb_build_object('view', jsonb_build_array('Admins'), 'update', jsonb_build_array('Admins'),'delete', jsonb_build_array('Admins'));

DELETE FROM locaria_core.parameters WHERE parameter_name = 'excluded_view_tables';

INSERT INTO locaria_core.parameters(parameter_name, parameter, acl)
SELECT 'excluded_view_tables',
	   json_build_array('ignore_me'),
       jsonb_build_object('view', jsonb_build_array('Admins'), 'update', jsonb_build_array('Admins'),'delete', jsonb_build_array('Admins'));