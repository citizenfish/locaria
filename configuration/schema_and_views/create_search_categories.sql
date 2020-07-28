DO
$$
BEGIN

    RAISE NOTICE 'Creating locus categories';

    DROP TYPE IF EXISTS locus_core.search_category CASCADE;
    CREATE TYPE locus_core.search_category AS ENUM('General','Events','Community','Planning', 'Democracy', 'Education', 'Health', 'Highways','Waste and Recycling', 'Environment', 'Crime', 'Council Tax', 'Row', 'Reported', 'ea_flood');


EXCEPTION WHEN OTHERS THEN

     RAISE NOTICE 'locus categories could not be installed due to an SQL error [%]', SQLERRM;
END;
$$ LANGUAGE PLPGSQL;