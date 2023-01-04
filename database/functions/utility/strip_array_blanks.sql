--DROP FUNCTION IF EXISTS locaria_core.strip_array_blanks(JSONB);
CREATE OR REPLACE FUNCTION locaria_core.strip_array_blanks(JSONB) RETURNS JSONB AS
$$
BEGIN

    RETURN(
        SELECT jsonb_agg(item) FROM (SELECT NULLIF(jsonb_array_elements_text($1),'') AS item) F
        WHERE item IS NOT NULL
    );
EXCEPTION WHEN OTHERS THEN
    RETURN $1;
END;
$$ LANGUAGE PLPGSQL;