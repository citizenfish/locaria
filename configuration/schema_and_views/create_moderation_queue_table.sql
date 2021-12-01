DROP TABLE IF EXISTS locus_core.moderation_queue;
CREATE  TABLE locus_core.moderation_queue(

id              BIGSERIAL PRIMARY KEY,
fid             TEXT NOT NULL,
parameters      JSONB,
status          TEXT DEFAULT 'RECEIVED'

);

CREATE INDEX moderation_queue_idx ON locus_core.moderation_queue USING BTREE(status,fid);