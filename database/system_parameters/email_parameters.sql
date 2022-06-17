DELETE FROM locaria_core.parameters WHERE parameter_name = 'email_config';

INSERT INTO locaria_core.parameters(parameter_name, parameter, acl)
SELECT 'email_config',

jsonb_build_object('contact_us',
    jsonb_build_object('Source', 'dave@locaria.org',
                       'mode', 'RequestResponse',
                       'Template', 'GENERIC_EMAIL',
                       'arn','{{themeOutputs.TriggerEmailLambdaFunctionQualifiedArn}}',
                       'region','{{config.region}}')
),
jsonb_build_object( 'view', jsonb_build_array('Admins'),
                    'update', jsonb_build_array('Admins'),
                    'delete', jsonb_build_array('Admins'));