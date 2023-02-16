CREATE OR REPLACE FUNCTION locaria_core.prepare_ts_query(text_to_prepare TEXT, lang TEXT DEFAULT 'english')
    RETURNS tsquery AS $$
DECLARE
    cleaned_text TEXT;
    keywords TEXT[];
BEGIN
    -- Convert to lowercase
    cleaned_text := lower(text_to_prepare);

    -- Remove non-alphanumeric characters
    cleaned_text := regexp_replace(cleaned_text, '[^a-z0-9 ]', '', 'g');

    -- Split into keywords
    keywords := array(SELECT word FROM regexp_split_to_table(cleaned_text, E'\\s+') AS word WHERE word <> '');

    -- Concatenate keywords
    RETURN to_tsquery(lang::REGCONFIG, array_to_string(keywords, ' | '));
END;
$$ LANGUAGE plpgsql;