DO
$$
BEGIN

    RAISE NOTICE 'Creating locaria base_table ** DESTRUCTIVE UPGRADE ***';

    DROP TABLE IF EXISTS locaria_data.base_table CASCADE;
    CREATE TABLE IF NOT EXISTS locaria_data.base_table  (
        id BIGSERIAL,
        category_id INTEGER,
        wkb_geometry GEOMETRY,
        attributes JSONB,
        search_date TIMESTAMP DEFAULT now(),

        CONSTRAINT base_table_pk PRIMARY KEY (id),
        CONSTRAINT category_id_fk FOREIGN KEY  (category_id) REFERENCES locaria_core.categories(id) ON DELETE CASCADE
    );



    --Supporting geometry searches
    CREATE INDEX locaria_data_base_table_geometry_idx ON locaria_data.base_table USING GIST (wkb_geometry); --TODO do we need this?
    CREATE INDEX locaria_data_base_table_geometry_geog_idx ON locaria_data.base_table USING GIST ((wkb_geometry::GEOGRAPHY));

    --Supporting free text searches
    CREATE INDEX base_table_jsonb_ts_vector  ON locaria_data.base_table USING GIN (jsonb_to_tsvector('English'::regconfig, attributes->'description', '["string", "numeric"]'::jsonb));

    --tags
    CREATE INDEX locaria_data_global_base_table_tags_idx ON locaria_data.base_table USING GIN((attributes->'tags'));

    --jsonb_path operations
    CREATE INDEX locaria_data_global_base_table_jsonb_path_ops_idx ON locaria_data.base_table USING GIN(attributes jsonb_path_ops);

    --categories
    CREATE INDEX locaria_data_global_base_table_category_idx on locaria_data.base_table USING GIN((attributes->'category'));

    CREATE TABLE IF NOT EXISTS locaria_data.imports(
        LIKE locaria_data.base_table INCLUDING INDEXES,
        CONSTRAINT imports_category_id_fk FOREIGN KEY  (category_id) REFERENCES locaria_core.categories(id) ON DELETE CASCADE
    ) INHERITS (locaria_data.base_table);

EXCEPTION WHEN OTHERS THEN

     RAISE NOTICE 'locaria base_table table could not be installed due to an SQL error [%]', SQLERRM;
END;
$$ LANGUAGE PLPGSQL;