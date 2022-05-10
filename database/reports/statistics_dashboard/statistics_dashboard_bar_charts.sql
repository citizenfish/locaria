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
                    AND log_timestamp BETWEEN COALESCE(($1->>'date')::TIMESTAMP, NOW()) - INTERVAL '24 HOURS' AND COALESCE(($1->>'date')::TIMESTAMP, NOW())
                    GROUP BY 1
                ) LG
            ON rng = hour
            ORDER BY 1  ASC
        ) L24

   ), LAST10 AS (

       SELECT jsonb_agg(jsonb_build_object('x', rng||suffix, 'y', users)) AS users10,
              jsonb_agg(jsonb_build_object('x', rng||suffix, 'y', searches)) AS searches10
        FROM (
           SELECT distinct rng AS rng,
                  rng_row_number,
                  CASE
                    WHEN rng % 100 IN (11,12,13) THEN 'th' --first checks for exception
                    WHEN rng % 10 = 1 THEN 'st'
                    WHEN rng % 10 = 2 THEN 'nd'
                    WHEN rng % 10 = 3 THEN 'rd'
                    ELSE 'th' --works for num % 10 IN (4,5,6,7,8,9,0)
                END AS suffix,
                COALESCE(users,0) AS users,
                COALESCE(searches,0) AS searches
            FROM
                (
                    SELECT row_number() OVER () AS rng_row_number, *
                    FROM (
                        SELECT DATE_PART('day', GENERATE_SERIES(now() - INTERVAL '10 days', now(), Interval '1 day'))::INTEGER AS rng
                    ) J
                ) RN
                LEFT JOIN (
                    SELECT DATE_PART('hour', log_timestamp) AS hour,
                    COUNT(DISTINCT usr) AS   users,
                    COUNT(*) AS searches
                    FROM locaria_core.statistics_view
                    WHERE log_type IN ('search', 'address_search')
                    AND log_timestamp BETWEEN COALESCE(($1->>'date')::TIMESTAMP, NOW()) - INTERVAL '10 days' AND COALESCE(($1->>'date')::TIMESTAMP, NOW())
                    GROUP BY 1
                ) LG
            ON rng = hour
        ORDER BY rng_row_number
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
