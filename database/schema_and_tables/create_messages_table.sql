
CREATE TABLE IF NOT EXISTS locaria_core.messages
(
    id SERIAL NOT NULL,
    author_id TEXT,
    parent_id BIGINT,
    message JSONB,
    attributes JSONB,
    creation_date TIMESTAMP DEFAULT NOW(),
    last_update TIMESTAMP,
    CONSTRAINT messages_pkey PRIMARY KEY (id),
    CONSTRAINT messages_parent_id_fkey FOREIGN KEY (parent_id)
        REFERENCES locaria_core.messages (id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION
)