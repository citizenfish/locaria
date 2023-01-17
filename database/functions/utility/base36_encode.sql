CREATE OR REPLACE FUNCTION locaria_core.base36_encode(IN base10 bigint)
    RETURNS  varchar
    LANGUAGE plpgsql
AS $BODY$
DECLARE
    base36 varchar := '';
    intval bigint  := abs(base10);
    char0z char[]  := regexp_split_to_array('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', '');
BEGIN
    WHILE intval != 0 LOOP
            base36 := char0z[(intval % 36)+1] || base36;
            intval := intval / 36;
        END LOOP;

    IF base10 = 0 THEN base36 := '0'; END IF;
    RETURN base36;
END;
$BODY$;