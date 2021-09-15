CREATE OR REPLACE FUNCTION locus_core.json2text(jsonb) RETURNS text[] AS
$$

    SELECT array_agg(x) || ARRAY[]::text[] FROM jsonb_array_elements_text($1) t(x);

$$ LANGUAGE sql IMMUTABLE;