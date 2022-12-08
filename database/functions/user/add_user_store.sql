CREATE OR REPLACE FUNCTION locaria_core.add_user_store(parameters JSONB, acl JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
BEGIN


    SET SEARCH_PATH = 'locaria_core', 'public';

    IF (acl->>'_userID') IS NULL THEN
        RETURN jsonb_build_object('error', 'Missing _userID in acl', 'response_code', 502);
    END IF;

    INSERT INTO user_store(userid,attributes)
    SELECT acl->>'_userID',
           parameters->'user_store'
    ON CONFLICT(userid) DO UPDATE SET last_updated=NOW(),attributes = user_store.attributes || EXCLUDED.attributes
    RETURNING jsonb_build_object('userid',userid,
                                 'insert', CASE WHEN xmax = 0 THEN 1 ELSE 0 END,
                                 'update', CASE WHEN xmax::text::int > 0 THEN 1 ELSE 0 END
        ) INTO ret_var;

    RETURN ret_var;

END;
$$
LANGUAGE PLPGSQL;