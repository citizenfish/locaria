CREATE OR REPLACE FUNCTION locaria_core.add_asset(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';

    INSERT INTO assets(uuid, attributes, acl)
    SELECT parameters->>'uuid',
           COALESCE(parameters->'attributes', jsonb_build_object()),
           --TODO confirm 
           --|| jsonb_build_object('internal', COALESCE(parameters->>'internal','false')),
           parameters->'acl'
    ON CONFLICT (uuid) DO UPDATE SET attributes = EXCLUDED.attributes, acl = EXCLUDED.acl
    RETURNING jsonb_build_object('uuid', uuid)
    INTO ret_var;

    RETURN ret_var || jsonb_build_object('history', add_history(parameters));
END;
$$ LANGUAGE PLPGSQL;