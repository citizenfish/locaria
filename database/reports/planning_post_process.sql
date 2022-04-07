DELETE FROM locaria_core.reports WHERE report_name ='planning_post_process';

INSERT INTO locaria_core.reports(report_name, report_parameters, admin_privilege)
SELECT 'planning_post_process',
jsonb_build_object('sql',
$SQL$
    UPDATE  locaria_data.imports
    SET attributes = jsonb_set(attributes, '{data,otherfields}',REPLACE(attributes#>>'{data,other_fields}','\"', '"')::JSONB)
    WHERE category_id = (SELECT id FROM locaria_core.categories WHERE category='Planning')
$SQL$),
       TRUE;
