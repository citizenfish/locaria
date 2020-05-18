DO
$$
BEGIN

    RAISE NOTICE 'Creating locus search table';

    CREATE TABLE IF NOT EXISTS locus_core.base_table  (
        id BIGSERIAL,
        wkb_geometry GEOMETRY (Point,4326),
        attributes JSONB,
        date_added TIMESTAMP DEFAULT now(),
        category locus_core.search_category[],
        CONSTRAINT sample_table_pk PRIMARY KEY(id)
    );



EXCEPTION WHEN OTHERS THEN

     RAISE NOTICE 'locus search table could not be installed due to an SQL error [%]', SQLERRM;
END;
$$ LANGUAGE PLPGSQL;