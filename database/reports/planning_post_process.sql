DELETE FROM locaria_core.reports WHERE report_name ='planning_post_process';

INSERT INTO locaria_core.reports(report_name, report_parameters, admin_privilege)
SELECT 'planning_post_process',
jsonb_build_object('sql',
$SQL$



        SELECT jsonb_build_object('opennames_post_process', ($1::JSONB)->>'version');
$SQL$),
       TRUE;
