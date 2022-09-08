DELETE FROM locaria_core.parameters WHERE parameter_name = 'lambda_config';

--Send broadcast messages to ws clients from database
INSERT INTO locaria_core.parameters(parameter_name, parameter, acl)
SELECT 'lambda_config',
       jsonb_build_object('ws_broadcast', jsonb_build_object('arn', '{{themeOutputs.EventWSLambdaFunctionQualifiedArn}}', 'region','{{config.region}}')),
       jsonb_build_object('view', jsonb_build_array('Admins'), 'update', jsonb_build_array('Admins'), 'delete', jsonb_build_array('Admins'));