CREATE OR REPLACE FUNCTION locaria_core.load_preview_file_data_cron(parameters JSONB DEFAULT jsonb_build_object()) RETURNS JSONB AS
$$
DECLARE
    r RECORD;
    ret_var JSONB DEFAULT jsonb_build_object();
BEGIN


    FOR r IN SELECT id,attributes FROM locaria_core.files
             WHERE STATUS = 'IMPORTING'
             AND   (attributes->>'record_count')::INTEGER > (attributes->>'processed')::INTEGER
    LOOP

        SELECT locaria_core.load_preview_file_data(jsonb_build_object('id', r.id, 'category', r.attributes#>>'{load_parameters,category}')) INTO ret_var;

       ret_var = ret_var || jsonb_build_object(r.id, ret_var);

    END LOOP;

    RETURN ret_var;
END;

$$ LANGUAGE PLPGSQL