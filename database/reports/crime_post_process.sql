DELETE FROM locaria_core.reports WHERE report_name ='crime_post_process';

INSERT INTO locaria_core.reports(report_name, report_parameters, admin_privilege)
SELECT 'crime_post_process',
       jsonb_build_object('sql',

$SQL$
        CREATE TABLE IF NOT EXISTS locaria_data.crime_neighbourhoods( neighbourhood_id TEXT primary key) INHERITS(locaria_data.base_table);
        CREATE TABLE IF NOT EXISTS locaria_data.crime_data( crime_id TEXT primary key) INHERITS(locaria_data.base_table);

        SELECT jsonb_build_object('crime_post_process', 'OK');

$SQL$),
TRUE;
