CREATE OR REPLACE FUNCTION locus_core.add_to_moderation_queue(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
BEGIN

    SET SEARCH_PATH = 'locus_core', 'public';

    INSERT INTO locus_core.moderation_queue(fid, parameters)
    SELECT parameters->>'fid',
           parameters - 'fid'
    RETURNING jsonb_build_object('id', id, 'message', 'Item added to moderation queue')
    INTO ret_var;

    RETURN ret_var;
END;
$$ LANGUAGE PLPGSQL;
