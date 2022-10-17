INSERT_SCHEMA = 'locaria_uploads'

# TODO if table structures remain the same then refactor into single query
LOG_TABLE = f"CREATE TABLE IF NOT EXISTS {INSERT_SCHEMA}.openActiveLogs(id SERIAL PRIMARY KEY, session TEXT, type TEXT, log JSONB)"

TABLE_CREATES = [
f"CREATE TABLE IF NOT EXISTS {INSERT_SCHEMA}.session(org TEXT, id TEXT,attributes JSONB, modified TEXT, CONSTRAINT Session_pk PRIMARY KEY (org,id,modified))",
f"CREATE TABLE IF NOT EXISTS {INSERT_SCHEMA}.sessionseries(org TEXT,id TEXT, attributes JSONB, modified TEXT, CONSTRAINT SessionSeries_pk PRIMARY KEY (org,id,modified))",
f"CREATE TABLE IF NOT EXISTS {INSERT_SCHEMA}.facilityuse(org TEXT,id TEXT, attributes JSONB, modified TEXT, CONSTRAINT FacilityUse_pk PRIMARY KEY (org,id,modified))",
f"CREATE TABLE IF NOT EXISTS {INSERT_SCHEMA}.individualfacilityUse(org TEXT,id TEXT, attributes JSONB, modified TEXT, CONSTRAINT IndividualFacilityUse_pk PRIMARY KEY (org,id,modified))",
f"CREATE TABLE IF NOT EXISTS {INSERT_SCHEMA}.event(org TEXT,id TEXT, attributes JSONB, modified TEXT, CONSTRAINT Event_pk PRIMARY KEY (org,id,modified))",
f"CREATE TABLE IF NOT EXISTS {INSERT_SCHEMA}.offer(org TEXT,id TEXT, attributes JSONB, modified TEXT, CONSTRAINT Offer_pk PRIMARY KEY (org,id,modified))",
f"CREATE TABLE IF NOT EXISTS {INSERT_SCHEMA}.courseinstance(org TEXT,id TEXT, attributes JSONB, modified TEXT, CONSTRAINT CourseInstance_pk PRIMARY KEY (org,id,modified))",
f"CREATE TABLE IF NOT EXISTS {INSERT_SCHEMA}.scheduledsession(org TEXT,id TEXT, attributes JSONB, modified TEXT, CONSTRAINT ScheduledSession_pk PRIMARY KEY (org, id,modified))",
f"CREATE TABLE IF NOT EXISTS {INSERT_SCHEMA}.ondemandevent(org TEXT, id TEXT, attributes JSONB, modified TEXT, CONSTRAINT ondemandevent_pk PRIMARY KEY (org, id,modified))",
LOG_TABLE
]

INSERT_QUERY = f"INSERT INTO {INSERT_SCHEMA}.**TABLE**(org,id, modified, attributes) VALUES %s ON CONFLICT(org, id,modified) DO UPDATE SET attributes=EXCLUDED.attributes"

URLS_QUERY = f"SELECT jsonb_object_agg(log) FROM {INSERT_SCHEMA}.openactivelogs WHERE type = 'urls' and session = %s"




