DO
$$
DECLARE
    ret_var GEOMETRY;
BEGIN

    ret_var = locus_core.opennames_postcode_geocoder('some blah blah tet TQ5 8HW and some other rubbish AND SN15 4QG');

    RAISE NOTICE 'RETURN VALUE  %', ST_ASTEXT(ret_var);
END;
$$ LANGUAGE PLPGSQL;
