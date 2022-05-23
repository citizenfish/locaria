CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS dblink;
GRANT EXECUTE ON FUNCTION dblink_connect_u(text) TO locaria;
GRANT EXECUTE ON FUNCTION dblink_connect_u(text, text) TO locaria;





