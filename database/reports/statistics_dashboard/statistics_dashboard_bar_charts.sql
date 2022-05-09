DELETE FROM locaria_core.reports WHERE report_name ='statistics_dashboard_last_24_hours';
DELETE FROM locaria_core.reports WHERE report_name ='statistics_dashboard_bar_charts';
INSERT INTO locaria_core.reports(report_name, report_parameters, admin_privilege)
SELECT 'statistics_dashboard_bar_charts',
       jsonb_build_object('sql',
                          $SQL$

   WITH LAST24 AS (

        SELECT jsonb_agg(jsonb_build_object('x', rng, 'y', users)) AS users24,
               jsonb_agg(jsonb_build_object('x', rng, 'y', searches)) AS searches24
        FROM (
            SELECT distinct rng,
                COALESCE(users,0) AS users,
                COALESCE(searches,0) AS searches
            FROM
                (
                SELECT DATE_PART('hour', GENERATE_SERIES(now() - INTERVAL '24 hours', now(), Interval '1 hour')) AS rng) RN
                LEFT JOIN (
                    SELECT DATE_PART('hour', log_timestamp) AS hour,
                    COUNT(DISTINCT usr) AS   users,
                    COUNT(*) AS searches
                    FROM locaria_core.statistics_view
                    WHERE log_type IN ('search', 'address_search')
                    AND log_timestamp BETWEEN COALESCE(($1->>'date')::DATE, NOW()::DATE) - INTERVAL '24 HOURS' AND COALESCE(($1->>'date')::DATE, NOW()::DATE)
                    GROUP BY 1
                ) LG
            ON rng = hour
            ORDER BY 1  ASC
        ) L24

   ), LAST10 AS (

       SELECT jsonb_agg(jsonb_build_object('x', rng, 'y', users)) AS users10,
               jsonb_agg(jsonb_build_object('x', rng, 'y', searches)) AS searches10
        FROM (
           SELECT distinct rng ,
                COALESCE(users,0) AS users,
                COALESCE(searches,0) AS searches
            FROM
                (
                SELECT DATE_PART('day', GENERATE_SERIES(now() - INTERVAL '10 days', now(), Interval '1 day')) AS rng) RN
                LEFT JOIN (
                    SELECT DATE_PART('hour', log_timestamp) AS hour,
                    COUNT(DISTINCT usr) AS   users,
                    COUNT(*) AS searches
                    FROM locaria_core.statistics_view
                    WHERE log_type IN ('search', 'address_search')
                    AND log_timestamp BETWEEN COALESCE(($1->>'date')::DATE, NOW()::DATE) - INTERVAL '10 days' AND COALESCE(($1->>'date')::DATE, NOW()::DATE)
                    GROUP BY 1
                ) LG
            ON rng = hour
        ORDER BY 1 DESC
       ) L10

       )

       SELECT jsonb_build_object(
                'users24',      users24,
                'searches24',   searches24,
                'users10',      users10,
                'searches10',   searches10
           )
      FROM LAST24,LAST10

$SQL$),
       TRUE;
