--Create and manage API sessions
CREATE OR REPLACE FUNCTION locaria_core.session_api(method_param TEXT, id_param TEXT, json_param JSONB DEFAULT NULL) RETURNS JSONB AS
$$
DECLARE
	ret_var JSONB;
BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';

	CASE WHEN method_param = 'set' THEN

			INSERT INTO sessions(id,json_data)
			SELECT id_param, json_param::JSONB
			ON CONFLICT(id) DO UPDATE SET json_data = json_param::JSONB;

		WHEN method_param = 'get' THEN

			SELECT json_data  INTO ret_var
			FROM sessions
			WHERE id = id_param;

		WHEN method_param = 'del' THEN

			DELETE FROM sessions
            WHERE id = id_param;

		WHEN method_param = 'search_id' THEN

	        SELECT COALESCE(json_data, jsonb_build_object()) || jsonb_build_object('id', id)
	        INTO ret_var
	        FROM  sessions
	        WHERE id = id_param;

            ret_var = COALESCE(ret_var,jsonb_build_object());


        WHEN method_param = 'search_group' THEN

            SELECT json_agg(id)
            INTO ret_var
            FROM sessions S
            WHERE json_data->'groups' ?& array[id_param];

            ret_var = COALESCE(ret_var,jsonb_build_array());

        ELSE

        	ret_var = json_build_object('error', 'unsupported method');

    END CASE;

    RETURN COALESCE(ret_var, jsonb_build_object(method_param, 'success', 'id', id_param));


END;
$$
LANGUAGE PLPGSQL;