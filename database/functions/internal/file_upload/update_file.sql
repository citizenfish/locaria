CREATE OR REPLACE FUNCTION locaria_core.update_file(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';

    parameters = parameters || jsonb_build_object('timestamp', to_char(current_timestamp, 'DD/MM/YYYY HH24:MI:SS'));

    UPDATE locaria_core.files
    SET attributes = attributes  ||  jsonb_build_object('log_messages', COALESCE(attributes->'log_messages', jsonb_build_array()) || jsonb_build_array(parameters - 'status' - 'id' -'method')),
        status = COALESCE(parameters->>'status',status),
        last_update = current_timestamp
    WHERE id = (parameters->>'id')::BIGINT
    RETURNING attributes || jsonb_build_object('id', id,'status', status, 'log_messages', attributes->'log_messages')
    INTO ret_var;

    RETURN ret_var;
END;
$$ LANGUAGE PLPGSQL;