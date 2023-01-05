DO
$$
DECLARE
    ret_var JSONB;
BEGIN

    SELECT locaria_core.strip_array_blanks(jsonb_build_array(null,1,2,3)) into ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor_array('strip_array_blanks', ret_var , '{}', '1', 3);

END;
$$ LANGUAGE PLPGSQL;