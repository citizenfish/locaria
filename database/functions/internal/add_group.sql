CREATE OR REPLACE FUNCTION locaria_core.add_group(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';

    INSERT INTO groups(group_name, attributes)
    SELECT parameters->>'group_name',
           parameters->'attributes'
    RETURNING jsonb_build_object('added', group_name)
    INTO ret_var;

    RETURN ret_var;
EXCEPTION WHEN OTHERS THEN
    IF  SQLERRM ~ 'duplicate' THEN
        RETURN json_build_object('error', concat_ws(' ','duplicate group name',parameters->>'group_name'), 'response_code', 650);
    END IF;
END;
$$ LANGUAGE plpgsql