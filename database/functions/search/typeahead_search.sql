
CREATE OR REPLACE FUNCTION locaria_core.typeahead_search(search_parameters JSONB) RETURNS JSONB AS $$
DECLARE

    results_var JSONB;
    category_limit INTEGER DEFAULT 30;
BEGIN


    IF length(search_parameters->>'search_text') < 3 THEN
        RETURN jsonb_build_object('results', jsonb_build_array());
    END IF;

    category_limit = COALESCE(search_parameters->>'limit', category_limit::TEXT)::INTEGER;

    SELECT jsonb_build_object('results',COALESCE(jsonb_agg(R.* ORDER BY COALESCE(array_position(array['Location'], category),2) ASC), jsonb_build_array()) )
    INTO results_var
    FROM (
           SELECT distinct ON (category) category,
                                         count(*) OVER(PARTITION BY category),
                                         jsonb_agg(jsonb_build_object('fid', fid,
                                                                      'text', concat_ws(' - ',search_text,region),
                                                                      'type', feature_type,
                                                                      'location', location

                                             )) OVER(PARTITION BY category)
           FROM (
                    SELECT row_number() OVER (PARTITION BY category) AS rn,
                           * FROM locaria_data.typeahead_search_view
                    WHERE LOWER(search_text) LIKE LOWER(search_parameters->>'search_text'||'%')
                ) F
           WHERE rn < category_limit
       ) R;


    RETURN results_var;
END;
$$
    LANGUAGE PLPGSQL;