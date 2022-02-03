CREATE OR REPLACE FUNCTION locaria_core.update_moderation_status(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';

    UPDATE locaria_core.moderation_queue
    SET status = UPPER(parameters->>'status')
    WHERE id = (parameters->>'id')::BIGINT
    RETURNING jsonb_build_object('id', id, 'message', 'Status Updated')
        INTO ret_var;

    RETURN ret_var;
END;
$$ LANGUAGE PLPGSQL;
