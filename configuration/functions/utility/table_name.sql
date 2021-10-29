CREATE OR REPLACE FUNCTION locus_core.table_name(oid) RETURNS text AS
$$

    SELECT concat_ws('.',relnamespace::regnamespace,relname)
    FROM   pg_catalog.pg_class
    WHERE  oid = $1;

$$ LANGUAGE sql IMMUTABLE;