DELETE FROM locaria_core.reports WHERE report_name ='statistics_dashboard_last_24_hours';
DELETE FROM locaria_core.reports WHERE report_name ='statistics_dashboard_bar_charts';
INSERT INTO locaria_core.reports(report_name, report_parameters, admin_privilege)
SELECT 'statistics_dashboard_bar_charts',
       jsonb_build_object('sql',
                          $SQL$

   WITH LAST24 AS (
        SELECT rng AS rng24,
            COALESCE(users,0) AS users24,
            COALESCE(searches,0) AS searches24
        FROM
            (
            SELECT DATE_PART('hour', GENERATE_SERIES(now() - INTERVAL '24 hours', now(), Interval '1 hour')) AS rng) RN
        LEFT JOIN (
                SELECT DATE_PART('hour', log_timestamp) AS hour,
                COUNT(DISTINCT usr)              AS   users,
                COUNT(*)                         AS searches
                FROM locaria_core.statistics_view
                WHERE log_type IN ('search', 'address_search')
                AND log_timestamp BETWEEN COALESCE(($1->>'date')::DATE, NOW()::DATE) - INTERVAL '24 HOURS' AND COALESCE(($1->>'date')::DATE, NOW()::DATE)
                GROUP BY 1
            ) LG
        ON rng = hour
   ) SELECT jsonb_build_object('users24',
               jsonb_agg(jsonb_build_object('x', rng24, 'y', users24)) ,
                'searches24',
               jsonb_agg(jsonb_build_object('x', rng24, 'y', searches24))
           )
     FROM LAST24

$SQL$),
       TRUE;
