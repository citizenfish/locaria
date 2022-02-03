CREATE OR REPLACE FUNCTION locaria_core.get_moderation_items(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';

    SELECT jsonb_agg(J)
    INTO ret_var
    FROM(
            SELECT row_to_json(MQ.*) AS J FROM locaria_core.moderation_queue MQ
            WHERE status = COALESCE(parameters->>'status', 'RECEIVED')
            ORDER BY id ASC
        ) S;

    RETURN jsonb_build_object('moderation_items', ret_var);
END;
$$ LANGUAGE PLPGSQL;
