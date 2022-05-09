CREATE OR REPLACE FUNCTION locaria_core.add_asset(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';

    INSERT INTO assets(uuid, attributes, acl)
    SELECT parameters->>'uuid', parameters->'attributes', parameters->'acl'
    ON CONFLICT (uuid) DO UPDATE SET attributes = EXCLUDED.attributes, acl=EXCLUDED.acl
    RETURNING jsonb_build_object('uuid', uuid)
        INTO ret_var;

    RETURN ret_var;
END;
$$ LANGUAGE PLPGSQL;