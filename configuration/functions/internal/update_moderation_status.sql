CREATE OR REPLACE FUNCTION locus_core.update_moderation_status(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
BEGIN

    SET SEARCH_PATH = 'locus_core', 'public';

    UPDATE locus_core.moderation_queue
    SET status = UPPER(update_moderation_status.parameters->>'status')
    WHERE id = (update_moderation_status.parameters->>'id')::BIGINT
    RETURNING jsonb_build_object('id', id, 'message', 'Status Updated')
        INTO ret_var;

    RETURN ret_var;
END;
$$ LANGUAGE PLPGSQL;
