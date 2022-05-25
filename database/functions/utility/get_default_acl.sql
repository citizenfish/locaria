CREATE OR REPLACE FUNCTION locaria_core.get_default_acl(acl_param JSONB DEFAULT jsonb_build_object()) RETURNS JSONB AS
$$
DECLARE
    returned_acl JSONB;
BEGIN

    SET SEARCH_PATH = 'locaria_data','locaria_core', 'public';

    --A new acl was provided
    IF NULLIF(acl_param->'_newACL', jsonb_build_object()) IS NOT NULL THEN
        RETURN acl_param->'_newACL';
    END IF;

    --Try from category table
    SELECT attributes->>'default_acl'
    INTO returned_acl
    FROM categories
    WHERE (acl_param->>'category') IS NOT NULL
    AND category = acl_param->>'category';

    IF returned_acl IS NOT NULL THEN
       RETURN returned_acl;
    END IF;

    --Try from groups table
    SELECT attributes->>'default_acl'
    INTO returned_acl
    FROM groups
    --We take the FIRST group in the list passed to us
    WHERE (acl_param->'_groups'->>0) IS NOT NULL
    AND group_name = acl_param->'_groups'->>0;

    IF returned_acl IS NOT NULL THEN
        RETURN returned_acl;
    END IF;

    --Try from parameters table if system default has been set
    SELECT parameter
    INTO returned_acl
    FROM parameters
    WHERE returned_acl IS NULL
    AND parameter_name = 'default_acl';


    RETURN COALESCE(returned_acl, jsonb_build_object());
END;
$$ LANGUAGE PLPGSQL;