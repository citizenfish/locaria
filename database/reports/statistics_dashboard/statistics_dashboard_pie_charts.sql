DELETE FROM locaria_core.reports WHERE report_name ='statistics_dashboard_pie_charts';

INSERT INTO locaria_core.reports(report_name, report_parameters, admin_privilege)
SELECT 'statistics_dashboard_pie_charts',
       jsonb_build_object('sql',
                          $SQL$

    WITH CATEGORIES AS (

        SELECT jsonb_agg(G.json) as categories
        FROM (
           SELECT jsonb_build_object('angle', count, 'label', category) AS json
           FROM (
                    SELECT jsonb_array_elements(cat) AS category,
                           count(*) AS count
                    FROM locaria_core.statistics_view
                    WHERE log_type IN ('search')
                      AND log_timestamp:: DATE = COALESCE(($1->>'date')::DATE, NOW()::DATE)
                    GROUP BY 1
                    ORDER BY count
                ) F
        )G

    ), TAGS AS (

            SELECT jsonb_agg(G.json) as tags
        FROM (
           SELECT jsonb_build_object('angle', count, 'label', tag) AS json
           FROM (
                    SELECT jsonb_array_elements(tags) AS tag,
                           count(*) AS count
                    FROM locaria_core.statistics_view
                    WHERE log_type IN ('search')
                      AND log_timestamp:: DATE = COALESCE(($1->>'date')::DATE, NOW()::DATE)
                    GROUP BY 1
                    ORDER BY count
                ) F
        )G
    )

        SELECT jsonb_build_object('categories', categories, 'tags', tags)
      FROM CATEGORIES,TAGS

$SQL$),
       TRUE;
