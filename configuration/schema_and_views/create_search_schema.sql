--This script checks for required postgres extensions and creates the required schemas

DO
$$
DECLARE
    postgres_version TEXT;
BEGIN

    RAISE NOTICE 'INSTALLING locus schema and components sever version reported as %', current_setting('server_version');

    --Check postgres server version

    IF (regexp_matches(current_setting('server_version'), '^[0-9]+\.[0-9]+'))[1]::NUMERIC < 9.6 THEN
        RAISE EXCEPTION 'locus requires postgres 9.6 or higher, please upgrade your database server';
    END IF;

    --Create required extensions if not installed already

    CREATE EXTENSION IF NOT EXISTS plv8;
    CREATE EXTENSION IF NOT EXISTS postgis;
    CREATE EXTENSION IF NOT EXISTS pg_trgm;
    CREATE EXTENSION aws_s3 CASCADE;

    --Create schema for search functions, data and views.
    CREATE SCHEMA IF NOT EXISTS locus_core;


EXCEPTION WHEN OTHERS THEN

    RAISE NOTICE 'Problem creating locus_core schema %s', SQLERRM;
END;
$$ LANGUAGE PLPGSQL;