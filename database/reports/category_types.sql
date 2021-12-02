--Return a list of categories from the system
DELETE FROM locaria_core.reports WHERE report_name = 'category_types';
 INSERT INTO locaria_core.reports(report_name, report_parameters)
    SELECT 'category_types', jsonb_build_object('sql',

    $SQL$

    SELECT json_agg(row_to_json(F.*)) FROM (

        SELECT  distinct ON(category[1],attributes#>>'{description,type}')
                category[1] as category,
                (attributes#>>'{description,type}')::TEXT as type
        FROM locaria_core.global_search_view
        WHERE (attributes#>>'{description,type}') IS NOT NULL
        ORDER BY 1,2

    ) F

    $SQL$);