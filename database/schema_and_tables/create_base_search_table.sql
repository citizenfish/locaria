DO
$$
BEGIN

    RAISE NOTICE 'Creating locaria base_table ';

    CREATE TABLE IF NOT EXISTS locaria_data.base_table  (
        id BIGSERIAL,
        category_id INTEGER,
        wkb_geometry GEOMETRY,
        attributes JSONB,
        search_date TIMESTAMP DEFAULT now(),

        CONSTRAINT base_table_pk PRIMARY KEY (id),
        CONSTRAINT category_id_fk FOREIGN KEY  (category_id) REFERENCES locaria_core.categories(id) ON DELETE CASCADE
    );


EXCEPTION WHEN OTHERS THEN

     RAISE NOTICE 'locaria base_table table could not be installed due to an SQL error [%]', SQLERRM;
END;
$$ LANGUAGE PLPGSQL;