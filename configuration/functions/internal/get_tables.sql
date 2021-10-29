CREATE OR REPLACE FUNCTION locus_core.get_tables(parameters JSONB DEFAULT jsonb_build_object()) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
BEGIN
    --Can only edit items that are stored in tables that inherit from base_table as we know the structure
    SET SEARCH_PATH = 'locus_core', 'public';

    SELECT jsonb_build_object('tables',json_agg(relname))
    INTO ret_var
    FROM (
        SELECT
            distinct ON(c.relname) c.relname,
            attributes->'category'->>0 as category
        FROM pg_inherits
            INNER JOIN pg_class AS c ON (inhrelid=c.oid)
            INNER JOIN pg_class as p ON (inhparent=p.oid)
            INNER JOIN locus_core.global_search_view ON attributes @> jsonb_build_object('table', locus_core.table_name(C.oid))
            WHERE p.relname = 'base_table') C
    WHERE NULLIF(parameters->>'category','') IS NULL OR category = parameters->>'category';

    RETURN ret_var;

END;
$$ LANGUAGE PLPGSQL;

