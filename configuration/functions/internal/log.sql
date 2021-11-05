CREATE OR REPLACE FUNCTION locus_core.log(parameters JSONB, message TEXT DEFAULT '') RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
BEGIN

    SET SEARCH_PATH = 'locus_core', 'public';

    INSERT INTO locus_core.logs(log_type, log_message)
    SELECT COALESCE(parameters ->> 'method', 'internal'),
           parameters || jsonb_build_object('_message', message)
    RETURNING jsonb_build_object('logid',id) INTO ret_var;

    RETURN ret_var;
END;
$$ LANGUAGE plpgsql