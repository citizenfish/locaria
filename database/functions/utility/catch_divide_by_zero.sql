CREATE OR REPLACE FUNCTION locaria_core.catch_divide_by_zero(a NUMERIC, b NUMERIC) RETURNS numeric AS
$$
BEGIN

    RETURN (CASE WHEN b = 0 THEN b ELSE a/b END);
END;
$$ LANGUAGE PLPGSQL IMMUTABLE;

DO
$$
    BEGIN
        CREATE OPERATOR  /-/ (
            LEFTARG  = NUMERIC,
            RIGHTARG = NUMERIC,
            PROCEDURE = locaria_core.catch_divide_by_zero
            );
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Already done';
    END;
$$ LANGUAGE PLPGSQL;