DO

$$
    DECLARE
        arn TEXT DEFAULT 'arn:aws:lambda:eu-west-1:340051624637:function:locaria-aurora-events-swindonbiddev-sb-eventWS';
        test_params JSONB DEFAULT jsonb_build_object('function', 'ws_broadcast',
                                                     'parameters', jsonb_build_object('group', 'Admins',
                                                                                      'packet', jsonb_build_object('queue', 'testQueue','packet', jsonb_build_object('message', 'hello'))));
        ret_var JSONB;
        acl JSONB DEFAULT jsonb_build_object('view', jsonb_build_array('Admins'), 'update', jsonb_build_array('Admins'), 'delete', jsonb_build_array('Admins'));
    BEGIN

        SET SEARCH_PATH = 'locaria_core', 'public';

        DELETE FROM parameters where parameter_name = 'lambda_config';

        INSERT INTO parameters(parameter_name, parameter, acl)
        SELECT 'lambda_config',
               jsonb_build_object('ws_broadcast', jsonb_build_object('arn', arn, 'region','eu-west-1')),
               acl;

       --SELECT locaria_core.aws_lambda_interface(test_params) INTO ret_var;

        --RAISE NOTICE 'ASYNC %', ret_var;

        test_params = test_params || jsonb_build_object('mode','RequestResponse');
        SELECT locaria_core.aws_lambda_interface(test_params) INTO ret_var;

        RAISE NOTICE 'SYNC %', ret_var;

    END;
$$