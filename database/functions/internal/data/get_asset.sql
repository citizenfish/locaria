CREATE OR REPLACE FUNCTION locaria_core.get_asset(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';

    SELECT jsonb_agg(jsonb_build_object('uuid', uuid) || attributes) AS attributes
    INTO ret_var
    FROM assets
    WHERE uuid = COALESCE(parameters->>'uuid','') OR attributes @> COALESCE(parameters->'filter', jsonb_build_object('_FAIL','true'));

    RETURN jsonb_build_object('assets', COALESCE(ret_var, jsonb_build_array()));
END;
$$ LANGUAGE PLPGSQL;