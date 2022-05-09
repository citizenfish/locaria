DELETE FROM locaria_core.reports WHERE report_name ='statistics_dashboard_overview';

INSERT INTO locaria_core.reports(report_name, report_parameters, admin_privilege)
SELECT 'statistics_dashboard_overview',
       jsonb_build_object('sql',
$SQL$

    WITH TODAY AS (

        SELECT row_to_json(R.*) AS today FROM (
            SELECT count(DISTINCT usr) sessions,
            count(*)  AS searches
            FROM locaria_core.statistics_view
            WHERE log_type IN('search')
            AND log_timestamp::DATE = COALESCE(($1->>'date')::DATE, NOW()::DATE)) R

    ), WEEK AS (

          SELECT row_to_json(R.*) AS week FROM (
            SELECT count(DISTINCT usr) sessions,
                   count(*)  AS searches
            FROM locaria_core.statistics_view
            WHERE log_type IN('search')
            AND DATE_PART('year', log_timestamp) = DATE_PART('year', COALESCE(($1->>'date')::DATE, NOW()::DATE))
            AND DATE_PART('week', log_timestamp) = DATE_PART('week', COALESCE(($1->>'date')::DATE, NOW()::DATE))) R

    ), MONTH AS (

          SELECT row_to_json(R.*) AS month FROM (
            SELECT count(DISTINCT usr) sessions,
                   count(*)  AS searches
            FROM locaria_core.statistics_view
            WHERE log_type IN('search')
            AND DATE_PART('year', log_timestamp) = DATE_PART('year', COALESCE(($1->>'date')::DATE, NOW()::DATE))
            AND DATE_PART('month', log_timestamp) = DATE_PART('month', COALESCE(($1->>'date')::DATE, NOW()::DATE))) R

    ), YEAR AS (

          SELECT row_to_json(R.*) AS year FROM (
            SELECT count(DISTINCT usr) sessions,
                   count(*)  AS searches
            FROM locaria_core.statistics_view
            WHERE log_type IN('search')
            AND DATE_PART('year', log_timestamp) = DATE_PART('year', COALESCE(($1->>'date')::DATE, NOW()::DATE))) R

    ) SELECT jsonb_build_object('today', today,
                                'week',  week,
                                'month', month,
                                'year', year)
      FROM today,week,month,year

$SQL$),
       TRUE;
