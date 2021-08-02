--Update an api data retrieval url
CREATE OR REPLACE FUNCTION locus_core.update_json_data_urls(table_name TEXT, json_url_data JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
BEGIN
        json_url_data = json_url_data|| jsonb_build_object('last_run', current_timestamp);

        UPDATE locus_core.parameters
        SET parameter = parameter - table_name || jsonb_build_object(table_name, json_url_data)
        WHERE parameter_name = 'json_sources';

        RETURN jsonb_build_object('message', 'json_sources_updated');

END;
$$
LANGUAGE PLPGSQL;