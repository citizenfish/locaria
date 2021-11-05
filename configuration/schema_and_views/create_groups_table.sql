DROP TABLE IF EXISTS locus_core.groups;
CREATE TABLE locus_core.groups (
        group_name TEXT PRIMARY KEY NOT NULL,
        created TIMESTAMP DEFAULT now(),
        attributes JSONB,
        last_updated TIMESTAMP DEFAULT now()
);

