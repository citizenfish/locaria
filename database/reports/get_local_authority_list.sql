DELETE FROM locaria_core.reports WHERE report_name ='get_local_authority_list';

INSERT INTO locaria_core.reports(report_name, report_parameters, admin_privilege)
SELECT 'get_local_authority_list',
       jsonb_build_object('sql',
$SQL$

  SELECT CASE WHEN  (SELECT EXISTS (
        SELECT  FROM pg_matviews
        WHERE  schemaname = 'locaria_data'
        AND    matviewname   = 'local_authority_boundary'
   )) THEN (
             SELECT jsonb_build_object('authorities', jsonb_agg(jsonb_build_object('id',id, 'name',attributes->>'name'))) FROM locaria_data.local_authority_boundary
            )
      ELSE jsonb_build_object('error', 'Local Authority data not loaded')
    END

$SQL$),
       TRUE;
