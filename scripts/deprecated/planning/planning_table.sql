CREATE TABLE IF NOT EXISTS locus_core.planning_applications(nid BIGSERIAL PRIMARY KEY)
INHERITS (locaria_data.base_table);
TRUNCATE locus_core.planning_applications;