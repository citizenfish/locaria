DO

$$
    DECLARE
        test_params JSONB DEFAULT jsonb_build_object('function', 'file_loader', 'fargate', 'true');
        ret_var JSONB;
    BEGIN

        --SELECT locaria_core.aws_lambda_interface(test_params) INTO ret_var;
        --RAISE NOTICE ' ASYNC %', ret_var;

        test_params = test_params || jsonb_build_object('mode','RequestResponse');
        SELECT locaria_core.aws_lambda_interface(test_params) INTO ret_var;

        RAISE NOTICE ' SYNC %', ret_var;

    END;
$$