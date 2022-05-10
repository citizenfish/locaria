DELETE FROM locaria_core.reports WHERE report_name ='statistics_dashboard_line_items';

INSERT INTO locaria_core.reports(report_name, report_parameters, admin_privilege)
SELECT 'statistics_dashboard_line_items',
       jsonb_build_object('sql',
                          $SQL$

    WITH SEARCH_TERMS AS (
        SELECT jsonb_agg(row_to_json(B.*)) AS search_terms
        FROM (
                 SELECT row_number() OVER () AS id, *
                 FROM (
                          SELECT srch,
                                 count(*) as count
                          FROM locaria_core.statistics_view
                          WHERE log_type IN ('search')
                            AND log_timestamp BETWEEN  COALESCE(($1->>'date')::DATE, NOW()::DATE) - INTERVAL '10 days'
                            AND NOW()
                            AND typah ='false'
                          GROUP BY 1
                          ORDER BY count DESC
                          OFFSET COALESCE($1->>'offset', '0')::INTEGER
                          LIMIT  COALESCE($1->>'limit', '10')::INTEGER
                      ) A
             )B

    ), ITEMS AS (
        SELECT jsonb_agg(row_to_json(B.*)) AS items
        FROM (
            SELECT row_number() OVER () AS id, * FROM (
                SELECT SV.fid,
                       attributes#>>'{description,title}' AS title,
                       attributes->'category'->>0 AS category,
                       count
                FROM (
                    SELECT fid,
                    COUNT(*)
                    FROM locaria_core.statistics_view
                    WHERE log_type IN ('get_item')
                    AND log_timestamp BETWEEN COALESCE(($1->>'date')::DATE, NOW()::DATE) - INTERVAL '10 days' AND NOW()
                    GROUP BY 1
                    ORDER BY count DESC
                    ) SV
                    INNER JOIN locaria_data.global_search_view USiNG(FID)
            ORDER BY count DESC,category
            ) A
             )B
    )

    SELECT jsonb_build_object('search_terms', search_terms, 'items', items)
    FROM SEARCH_TERMS,ITEMS

$SQL$),
       TRUE;
