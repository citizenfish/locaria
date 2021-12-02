DROP TABLE IF  EXISTS locaria_core.sessions;
CREATE TABLE locaria_core.sessions(
	id TEXT NOT NULL PRIMARY KEY,
	json_data JSONB,
	session_timestamp timestamp DEFAULT now()
);