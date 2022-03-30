DO
$$
DECLARE
    ret_var BOOLEAN;
BEGIN

    SELECT locaria_core.table_exists('fail', 'fail') INTO ret_var;

    IF ret_var THEN RAISE EXCEPTION 'table_exists TEST 1 FAIL %', ret_var; END IF;
    RAISE NOTICE 'table_exists TEST 1 PASS %',ret_var;

    SELECT locaria_core.table_exists('locaria_data', 'base_table') INTO ret_var;

    IF NOT ret_var THEN RAISE EXCEPTION 'table_exists TEST 2 FAIL %', ret_var; END IF;
    RAISE NOTICE 'table_exists TEST 2 PASS %',ret_var;
END;
$$ LANGUAGE PLPGSQL;