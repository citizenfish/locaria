CREATE OR REPLACE FUNCTION locaria_core.parse_location_from_text(input_text TEXT)
    RETURNS JSON AS $$
DECLARE
    keywords TEXT[];
    tsquery_input TEXT;
    matched_attributes JSONB DEFAULT '{}';
    remaining_text TEXT := '';
    result JSON;
    rank FLOAT;
    geom GEOMETRY;
BEGIN
    -- Split input text into keywords
    keywords := regexp_split_to_array(input_text, '\s+');
    tsquery_input := array_to_string(keywords, ' | ');

    -- Find the best match using full-text search
    SELECT attributes,
           wkb_geometry,
           ts_rank(to_tsvector('english', attributes->>'name1'), to_tsquery('english', tsquery_input))::FLOAT AS rank
    INTO matched_attributes,geom,rank
    FROM locaria_data.location_search_view
    WHERE  to_tsvector('english', attributes->>'name1') @@ to_tsquery('english', tsquery_input)
    ORDER BY rank DESC
    LIMIT 1;

    -- Construct result JSON
    remaining_text := regexp_replace(input_text, matched_attributes->>'name1', '', 'gi');
    result := json_build_object(
            'match_confidence', rank,
            'matched_attributes', matched_attributes,
            'remaining_text', remaining_text,
            'geometry', ST_GEOMFROMEWKT(geom)
        );

    RETURN result;
END;
$$ LANGUAGE plpgsql;

