CREATE OR REPLACE FUNCTION locaria_core.get_user_store(parameters JSONB, acl JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
    path_var TEXT [] DEFAULT NULL;
BEGIN


    SET SEARCH_PATH = 'locaria_core', 'public';

    IF (acl->>'_userID') IS NULL THEN
        RETURN jsonb_build_object('error', 'Missing _userID in acl', 'response_code', 503);
    END IF;

    IF parameters->>'path' ~ '^[a-zA-Z0-9,_]+$' THEN
        path_var = string_to_array(parameters->>'path',',');
    END IF;

    SELECT
        CASE WHEN path_var IS NULL THEN
            attributes
        ELSE
            jsonb_extract_path(attributes, VARIADIC path_var)
        END
    INTO ret_var
    FROM user_store WHERE userID = acl->>'_userID';

    RETURN ret_var;

END;
$$
    LANGUAGE PLPGSQL;