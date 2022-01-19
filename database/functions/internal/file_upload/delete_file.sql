CREATE OR REPLACE FUNCTION locaria_core.delete_file(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    delete_count INTEGER;

BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';

    UPDATE files
    SET status='DELETED'
    WHERE id = (parameters->>'id')::BIGINT;

    GET DIAGNOSTICS delete_count = ROW_COUNT;
    IF delete_count != 1 THEN
        RETURN jsonb_build_object('error', 'No rows deleted,','id', parameters->>'id');
    END IF;

    RETURN jsonb_build_object('id', parameters->>'id', 'message', 'file marked as deleted');
END;
$$ LANGUAGE PLPGSQL;
