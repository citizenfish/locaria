DROP TABLE IF EXISTS locaria_core.groups;
CREATE TABLE locaria_core.groups (
        group_name TEXT PRIMARY KEY NOT NULL,
        created TIMESTAMP DEFAULT now(),
        attributes JSONB,
        last_updated TIMESTAMP DEFAULT now()
);

