DO

$$
    DECLARE
        arn TEXT DEFAULT 'arn:aws:lambda:eu-west-1:617273772516:function:locaria-aurora-events-main-multi-eventWS';
        test_params JSONB DEFAULT jsonb_build_object('function', 'ws_broadcast', 'parameters', jsonb_build_object('id', 'PbkFxdd3DoECJYw='));
        ret_var JSONB;
    BEGIN

        SET SEARCH_PATH = 'locaria_core', 'public';
        DELETE FROM parameters where parameter_name = 'lambda_config';

        INSERT INTO parameters(parameter_name, parameter, acl)
        SELECT 'lambda_config',
               jsonb_build_object('ws_broadcast', jsonb_build_object('arn',arn, 'region','eu-west-1')),
               'internal';

        SELECT locaria_core.aws_lambda_interface(test_params) INTO ret_var;

        RAISE NOTICE ' ASYNC %', ret_var;

        test_params = test_params || jsonb_build_object('mode','RequireResponse');
        SELECT locaria_core.aws_lambda_interface(test_params) INTO ret_var;

        RAISE NOTICE ' ASYNC %', ret_var;

    END;
$$