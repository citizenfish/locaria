CREATE OR REPLACE FUNCTION locaria_core.describe_table(parameters JSONB) RETURNS JSONB AS
$$
    DECLARE
        table_var JSONB DEFAULT jsonb_build_object();
        data_var JSONB DEFAULT jsonb_build_object();
        query_var TEXT DEFAULT $SQL$
            SELECT jsonb_agg(row_to_json(T.*)) FROM (

                SELECT
                        'col' || row_number() OVER () AS field,
                        column_name as "headerName",
                        $3::INTEGER as width
                FROM information_schema.columns
                WHERE table_name = $2
                AND table_schema = $1

            ) T
            $SQL$;
    BEGIN



    EXECUTE query_var INTO table_var USING COALESCE(parameters->>'schema', 'locaria_uploads'), parameters->>'table', COALESCE(parameters->>'width', '10');

    query_var = $SQL$
            SELECT jsonb_agg(row_to_json(T.*) FROM (
                SELECT * FROM %s.%s
                OFFSET $1
                LIMIT $2
            ) T
        $SQL$;

    --TODO get this into col1/col2 etc... format
    EXECUTE format(query_var, COALESCE(parameters->>'schema', 'locaria_uploads'), parameters->>'table')
    INTO data_var
    USING COALESCE(parameters->>'limit', '100')::INTEGER,
          COALESCE(parameters->>'offset', '0')::INTEGER

    RETURN jsonb_build_object('table', table_var, 'data', 'data_var');

    END;
$$ LANGUAGE PLPGSQL;