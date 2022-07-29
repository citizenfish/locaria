DO
$$
    BEGIN

        RAISE NOTICE 'Creating locaria tilecache table';

        CREATE TABLE IF NOT EXISTS locaria_core.tilecache  (tile BYTEA,
                                                            tileset TEXT,
                                                            x_val integer,
                                                            y_val INTEGER,
                                                            z_val INTEGER,
                                                            expiry TIMESTAMP DEFAULT now() + INTERVAl '1 year',
                                                            CONSTRAINT tilecache_table_pk PRIMARY KEY (tileset,x_val,y_val,z_val)
        );


    EXCEPTION WHEN OTHERS THEN

        RAISE NOTICE 'locaria tilecache table could not be installed due to an SQL error [%]', SQLERRM;
    END;
$$ LANGUAGE PLPGSQL;