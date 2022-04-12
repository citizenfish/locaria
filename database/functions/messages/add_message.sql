CREATE OR REPLACE FUNCTION locaria_core.add_message(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';

    INSERT INTO messages(author_id, message, attributes, parent_id)
    SELECT COALESCE(parameters->>'user_id', 'anonymous'),
           parameters->'message',
           jsonb_build_object('type', 'contact') || COALESCE(parameters->'attributes', jsonb_build_object()),
           (parameters->>'parent_id')::BIGINT
    RETURNING jsonb_build_object('id',id)
    INTO ret_var;

    RETURN ret_var;
END;
$$ LANGUAGE plpgsql