DROP TABLE IF EXISTS locaria_core.logs;
CREATE  TABLE locaria_core.logs(

    id                  BIGSERIAL,
    log_type            TEXT DEFAULT 'search',
    log_message         JSONB,
    log_timestamp       TIMESTAMP DEFAULT NOW(),
    CONSTRAINT logs_pk PRIMARY KEY (id,log_timestamp)
) PARTITION BY RANGE(log_timestamp);

-- Partition management
-- https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL_Partitions.html
DO
$$
BEGIN
    SELECT partition_management.create_parent(
        p_parent_table => 'locaria_core.logs',
        p_control => 'log_timestamp',
        p_type => 'native',
        p_interval => 'monthly',
        p_premake => 12
        );
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'WARNING %', SQLERRM;
END;
$$ LANGUAGE PLPGSQL;

UPDATE partition_management.part_config
SET infinite_time_partitions = true,
    retention = '10 years',
    retention_keep_table = true
WHERE parent_table='locaria_core.logs';

--TODO into postgres schema
--GRANT USAGE ON SCHEMA cron TO locaria;
--SELECT cron.schedule('@hourly', $$CALL partition_management.run_maintenance_proc()$$);