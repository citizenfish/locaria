DO
$$
BEGIN

    RAISE NOTICE 'Creating locaria categories table';

    CREATE TABLE IF NOT EXISTS locaria_core.categories  (
        id BIGSERIAL,
        category TEXT UNIQUE NOT NULL,
        attributes JSONB,
        CONSTRAINT category_table_pk PRIMARY KEY(id)
    );


EXCEPTION WHEN OTHERS THEN

     RAISE NOTICE 'locaria category table could not be installed due to an SQL error [%]', SQLERRM;
END;
$$ LANGUAGE PLPGSQL;