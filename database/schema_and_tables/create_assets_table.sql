DO
$$
    BEGIN

        RAISE NOTICE 'Creating locaria assets table';

        CREATE TABLE IF NOT EXISTS locaria_core.assets  (
                                                                uuid TEXT NOT NULL,
                                                                attributes JSONB,
                                                                acl JSONB,
                                                                CONSTRAINT assets_table_pk PRIMARY KEY(uuid)
        );


    EXCEPTION WHEN OTHERS THEN

        RAISE NOTICE 'locaria assets table could not be installed due to an SQL error [%]', SQLERRM;
    END;
$$ LANGUAGE PLPGSQL;