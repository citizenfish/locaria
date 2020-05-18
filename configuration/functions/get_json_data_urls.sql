CREATE OR REPLACE FUNCTION locus_core.get_json_data_urls(parameters JSON DEFAULT json_build_object(), OUT table_name TEXT, OUT attributes JSON) AS
$$
DECLARE
    json_fetch_var JSONB;

BEGIN

    SELECT  (jsonb_each(parameter)).key,
            (jsonb_each(parameter)).value
    INTO table_name,
         attributes
    FROM locus_core.parameters
    WHERE parameter_name = 'json_sources'
    ORDER BY ((jsonb_each(parameter)).value->>'last_run')::TIMESTAMP ASC
    LIMIT 1;

    --For Crime data we look 2 months in the past
    IF attributes->>'uri' ~ 'CRIME-DATE' THEN
        attributes = (attributes::JSONB - 'uri' || jsonb_build_object('uri', REPLACE(attributes->>'uri', 'CRIME-DATE', to_char(now()-INTERVAL '2 Months', 'YYYY-MM'))))::JSON;
    END IF;
END;
$$
LANGUAGE PLPGSQL;