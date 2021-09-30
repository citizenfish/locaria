CREATE OR REPLACE FUNCTION locus_core.strip_array_blanks(JSONB) RETURNS JSONB AS
$$

    SELECT jsonb_agg(item) FROM (SELECT NULLIF(jsonb_array_elements_text($1),'') AS item) F
    WHERE item IS NOT NULL

$$ LANGUAGE sql IMMUTABLE;