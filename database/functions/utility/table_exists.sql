CREATE OR REPLACE FUNCTION locaria_core.table_exists(schema_param TEXT, table_param TEXT) RETURNS BOOLEAN AS
$$

    SELECT EXISTS (
               SELECT FROM
                   pg_tables
               WHERE
                       schemaname = schema_param AND
                       tablename  = table_param
           );

$$ LANGUAGE sql IMMUTABLE;