--This function is used to take an alpha numeric ID and turn it into a unique integer. We use this to create integer keys on tables that have character ids

CREATE OR REPLACE FUNCTION locus_core.base36_decode(IN base36 TEXT)
  RETURNS bigint AS $$
        DECLARE
			a char[];
			ret bigint;
			i int;
			val int;
			chars varchar;
		BEGIN
		chars := '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        base36 = regexp_replace(base36, '[^A-Za-z0-9]','','g');

		FOR i IN REVERSE char_length(base36)..1 LOOP
			a := a || substring(upper(base36) FROM i FOR 1)::char;
		END LOOP;
		i := 0;
		ret := 0;
		WHILE i < (array_length(a,1)) LOOP
			val := position(a[i+1] IN chars)-1;
			ret := ret + (val * (36 ^ i));
			i := i + 1;
		END LOOP;

		RETURN ret;

END;
$$ LANGUAGE 'plpgsql' IMMUTABLE;