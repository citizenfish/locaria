CREATE OR REPLACE FUNCTION locus_core.update_group(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
BEGIN

    SET SEARCH_PATH = 'locus_core', 'public';

END;
$$ LANGUAGE plpgsql