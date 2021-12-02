DROP TABLE IF EXISTS locaria_core.moderation_queue;
CREATE  TABLE locaria_core.moderation_queue(

id              BIGSERIAL PRIMARY KEY,
fid             TEXT NOT NULL,
attributes      JSONB,
status          TEXT DEFAULT 'RECEIVED'

);

CREATE INDEX moderation_queue_idx ON locaria_core.moderation_queue USING BTREE(status,fid);