CREATE OR REPLACE FUNCTION locaria_core.add_to_moderation_queue(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';

    INSERT INTO moderation_queue(fid, attributes)
    SELECT parameters->>'fid',
           parameters - 'fid'
    RETURNING jsonb_build_object('id', id, 'message', 'Item added to moderation queue')
    INTO ret_var;

    RETURN ret_var;
END;
$$ LANGUAGE PLPGSQL;
