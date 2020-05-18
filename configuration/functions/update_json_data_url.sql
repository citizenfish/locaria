CREATE OR REPLACE FUNCTION locus_core.update_json_data_urls(table_name TEXT, json_url_data JSON) RETURNS JSON AS
$$
DECLARE
    ret_var JSON;
BEGIN
        json_url_data = (json_url_data::JSONB || jsonb_build_object('last_run', current_timestamp))::JSON;

        UPDATE locus_core.parameters
        SET parameter = parameter - table_name || jsonb_build_object(table_name, json_url_data::JSONB)
        WHERE parameter_name = 'json_sources';

        RETURN json_build_object('message', 'json_sources_updated');

END;
$$
LANGUAGE PLPGSQL;