DROP TABLE IF  EXISTS locus_core.lex_sessions;
CREATE TABLE locus_core.lex_sessions(
	id TEXT NOT NULL PRIMARY KEY,
	json_data JSONB,
	session_timestamp timestamp DEFAULT now()
);