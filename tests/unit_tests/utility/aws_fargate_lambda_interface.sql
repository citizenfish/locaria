DO

$$
    DECLARE
        params JSONB DEFAULT jsonb_build_object('function', 'file_loader', 'fargate', 'true', 'mode', 'Event');
        ret_var JSONB;
    BEGIN

        IF (SELECT 1 FROM locaria_core.parameters WHERE parameter_name = 'fargate_config' AND (parameter->>'file_loader') IS NOT NULL) IS NOT NULL THEN
            SELECT locaria_core.aws_lambda_interface(params) INTO ret_var;
        ELSE
            RAISE EXCEPTION 'fargate_config not set in parameters table';
        END IF;

        RAISE NOTICE ' SYNC %', ret_var;

    END;
$$