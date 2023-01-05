INSERT_SCHEMA = 'locaria_data'


LOG_TABLE = f"CREATE TABLE IF NOT EXISTS {INSERT_SCHEMA}.openActiveLogs(id SERIAL PRIMARY KEY, session TEXT, type TEXT, log JSONB, ts TIMESTAMP DEFAULT now())"

TABLE_CREATES = [LOG_TABLE]

INSERT_QUERY = f"INSERT INTO {INSERT_SCHEMA}.**TABLE**(oa_org,oa_id, modified, attributes) VALUES %s ON CONFLICT(oa_org, oa_id) DO UPDATE SET attributes=EXCLUDED.attributes"
URLS_QUERY = f"SELECT jsonb_object_agg(log) FROM {INSERT_SCHEMA}.openactivelogs WHERE type = 'urls' and session = %s"
DELETE_QUERY = f"DELETE FROM {INSERT_SCHEMA}.**TABLE** WHERE attributes->>'state' =  'deleted'"
COUNT_QUERY = f"SELECT count(*) FROM {INSERT_SCHEMA}.**TABLE**"
LOG_QUERY = f"INSERT INTO {INSERT_SCHEMA}.openActiveLogs(session, type, log) VALUES(%s,%s,%s)"

PROCESS_QUERY = "SELECT locaria_core.openActivePostLoadProcess()"




