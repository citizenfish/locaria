--This script checks for required postgres extensions and creates the required schemas

DO
$$
DECLARE
postgres_version TEXT;
BEGIN

    RAISE NOTICE 'INSTALLING locaria schema and components sever version reported as %', current_setting('server_version');

    --Check postgres server version

    IF (regexp_matches(current_setting('server_version'), '^[0-9]+\.[0-9]+'))[1]::NUMERIC < 9.6 THEN
        RAISE EXCEPTION 'locaria requires postgres 9.6 or higher, please upgrade your database server';
END IF;

    --Create required extensions if not installed already

    CREATE EXTENSION IF NOT EXISTS plv8;
    CREATE EXTENSION IF NOT EXISTS postgis;
    CREATE EXTENSION IF NOT EXISTS pg_trgm;
    CREATE EXTENSION IF NOT EXISTS aws_commons;
    CREATE EXTENSION IF NOT EXISTS aws_s3;
    CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
    CREATE EXTENSION IF NOT EXISTS aws_lambda;
    DROP EXTENSION IF EXISTS pg_partman;
    DROP SCHEMA IF EXISTS partition_management CASCADE;
    CREATE SCHEMA partition_management;
    CREATE EXTENSION pg_partman WITH SCHEMA partition_management;

    --Create schema for search functions, data, uploads and views.
    RAISE NOTICE 'CREATING CORE SCHEMA';
    DROP SCHEMA IF EXISTS locaria_core CASCADE;
    DROP SCHEMA IF EXISTS locaria_data CASCADE;
    DROP SCHEMA IF EXISTS locaria_uploads CASCADE;
    CREATE SCHEMA locaria_core;
    CREATE SCHEMA locaria_data;
    CREATE SCHEMA locaria_uploads;


EXCEPTION WHEN OTHERS THEN

    RAISE NOTICE 'Problem creating locaria_core schema %s', SQLERRM;
END;
$$ LANGUAGE PLPGSQL;