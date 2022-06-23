DO
$$
BEGIN
    --Used for testing configure scripts when we do not want to affect the database in any way
    RAISE NOTICE '***************** NO OPERATION *****************';
END;
$$ LANGUAGE PLPGSQL;