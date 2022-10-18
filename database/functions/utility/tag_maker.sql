CREATE OR REPLACE FUNCTION locaria_core.tag_maker(payload_param JSONB, json_key TEXT) RETURNS JSONB AS
$$
BEGIN

    if jsonb_typeof(payload_param) != 'array' THEN
        RETURN jsonb_build_array();
    END IF;

    RETURN (
        SELECT locaria_core.unique_array_elements(jsonb_agg(value))
        FROM (
                 SELECT (JSONB_EACH(JSONB_ARRAY_ELEMENTS(payload_param))).*

             )V
        WHERE key = json_key
    );
END;
$$ LANGUAGE PLPGSQL;