DO
$$
BEGIN

    RAISE NOTICE 'Creating locus categories';


    CREATE TYPE locus_core.search_category AS ENUM('General','Events','Community','Planning', 'Democracy', 'Education', 'Health', 'Highways and Transport','Waste and Recycling', 'Environment', 'Crime', 'Council Tax', 'Rights of Way', 'Reported');


EXCEPTION WHEN OTHERS THEN

     RAISE NOTICE 'locus categories could not be installed due to an SQL error [%]', SQLERRM;
END;
$$ LANGUAGE PLPGSQL;