DO
$$
BEGIN

    RAISE NOTICE 'Creating locus search table';

    CREATE TABLE IF NOT EXISTS locus_core.base_table  (
        id BIGSERIAL,
        category_id INTEGER,
        wkb_geometry GEOMETRY (Point,4326),
        attributes JSONB,
        search_date TIMESTAMP DEFAULT now(),

        CONSTRAINT base_table_pk PRIMARY KEY (id),
        CONSTRAINT category_id_fk FOREIGN KEY  (category_id) REFERENCES locus_core.categories(category_id) ON DELETE CASCADE
    );


EXCEPTION WHEN OTHERS THEN

     RAISE NOTICE 'locus search table could not be installed due to an SQL error [%]', SQLERRM;
END;
$$ LANGUAGE PLPGSQL;