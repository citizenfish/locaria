CREATE SCHEMA IF NOT EXISTS locaria_tests;

CREATE OR REPLACE FUNCTION locaria_tests.test_result_processor(test_name TEXT, ret_var JSONB, ret_path TEXT [], test_value TEXT) RETURNS TEXT AS
$$
DECLARE
    ret_value TEXT;
BEGIN
    ret_value = jsonb_extract_path_text(ret_var, VARIADIC ret_path);

    IF (ret_var->>'logid') IS NOT NULL THEN
        RAISE EXCEPTION '[%] FAILED - WITH SQL ERROR%',test_name, (SELECT log_message FROM logs WHERE id=(ret_var->>'logid')::BIGINT);
    END IF;

    IF ret_value IS NULL OR (ret_value::TEXT != test_value AND test_value != '*') THEN
        RAISE EXCEPTION '[%] FAILED - EXPECTING % RECEIVED %',test_name, test_value,ret_value;
    END IF;

    --RETURN '[%] PASSED - EXPECTING % RECEIVED %', test_name, test_value, ret_value;
    RETURN format('[%s] PASSED - EXPECTING %s RECEIVED %s',test_name, test_value, ret_value);
END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION locaria_tests.test_result_processor_array(test_name TEXT, ret_var JSONB, ret_path TEXT [], test_value TEXT, array_length INTEGER DEFAULT 0) RETURNS TEXT AS
$$
BEGIN

    IF array_length != -1 AND jsonb_array_length(ret_var) != array_length THEN
        RAISE EXCEPTION '[%] FAILED - EXPECTING ARRAY LENGTH % RECEIVED %',test_name, array_length, jsonb_array_length(ret_var);
    END IF;

    IF array_length = 0 THEN
        RETURN format('[%s] PASSED - EXPECTING ARRAY LENGTH %s RECEIVED %s',test_name, array_length, jsonb_array_length(ret_var));
    END IF;

    RETURN locaria_tests.test_result_processor(test_name, ret_var->0, ret_path, test_value);
END;
$$ LANGUAGE PLPGSQL;