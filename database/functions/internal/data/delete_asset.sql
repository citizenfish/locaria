CREATE OR REPLACE FUNCTION locaria_core.delete_asset(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    delete_count INTEGER;
    asset_details JSONB;
BEGIN
    --TODO ACL Check
    SET SEARCH_PATH = 'locaria_core', 'public';

    --needed to tidy up S3 delete
    asset_details = get_asset(parameters)->'assets'->0;

    DELETE FROM assets WHERE uuid = COALESCE(parameters->>'uuid','THIS WILL FAIL')
    AND (acl_check(parameters->'acl', attributes->'acl')->>'delete')::BOOLEAN;

    GET DIAGNOSTICS delete_count = ROW_COUNT;

    IF delete_count = 1 THEN
        RETURN jsonb_build_object('uuid', parameters->>'uuid', 'delete', 'success', 'details', asset_details);
    ELSE
        RETURN jsonb_build_object('uuid', parameters->>'uuid', 'delete', 'failure', 'delete_count', delete_count);
    END IF;
END;
$$ LANGUAGE PLPGSQL;