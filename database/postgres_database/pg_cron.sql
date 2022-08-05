CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS dblink;
GRANT EXECUTE ON FUNCTION dblink_connect_u(text) TO locaria;
GRANT EXECUTE ON FUNCTION dblink_connect_u(text, text) TO locaria;

--Setup log partitioning
GRANT EXECUTE ON FUNCTION cron.schedule_in_database(text, text, text, text, text, boolean)  TO locaria;

--Remove any dormant jobs
DELETE FROM cron.job WHERE database = 'locaria{{theme}}{{environment}}';
SELECT cron.schedule_in_database('Logs table partition', '@hourly', $$CALL partition_management.run_maintenance_proc()$$, 'locaria{{theme}}{{environment}}');

--Setup the hourly file processor
SELECT cron.schedule_in_database('Hourly files processor',
                                 '@hourly',
                                 $$
                                     SELECT locaria_core.file_cron(jsonb_build_object('filter', jsonb_build_object('cron', 'hourly')))
                                 $$, 'locaria{{theme}}{{environment}}');

--Setup the daily file processor
SELECT cron.schedule_in_database('Daily files processor',
                                 '0 0 * * *',
                                 $$
                                     SELECT locaria_core.file_cron(jsonb_build_object('filter', jsonb_build_object('cron', 'daily')))
                                 $$, 'locaria{{theme}}{{environment}}');

--Setup the weekly file processor
SELECT cron.schedule_in_database('Weekly files processor',
                                 '0 0 * * 1',
                                 $$
                                     SELECT locaria_core.file_cron(jsonb_build_object('filter', jsonb_build_object('cron', 'weekly')))
                                 $$, 'locaria{{theme}}{{environment}}');

--Setup the monthly file processor
SELECT cron.schedule_in_database('Monthly files processor',
                                 '0 0 1 * *',
                                 $$
                                     SELECT locaria_core.file_cron(jsonb_build_object('filter', jsonb_build_object('cron', 'monthly')))
                                 $$, 'locaria{{theme}}{{environment}}');






