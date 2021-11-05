CREATE OR REPLACE FUNCTION locus_core.get_group(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
BEGIN

    SET SEARCH_PATH = 'locus_core', 'public';

    SELECT attributes || jsonb_build_object('created', created, 'last_updated', last_updated)
    FROM groups
    WHERE group_name = COALESCE(parameters->>'group_name','')
    INTO ret_var;

    RETURN ret_var;
END;
$$ LANGUAGE plpgsql