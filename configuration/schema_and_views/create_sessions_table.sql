DROP TABLE IF  EXISTS locus_core.locus_sessions;
CREATE TABLE locus_core.locus_sessions(
	id TEXT NOT NULL PRIMARY KEY,
	json_data JSONB,
	session_timestamp timestamp DEFAULT now()
);