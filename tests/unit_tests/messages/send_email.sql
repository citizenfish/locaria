DO
$$
DECLARE
    ret_var JSONB;
    email_parameters JSONB DEFAULT jsonb_build_object('Source', 'dave@locaria.org',
                                                      'Template', 'GENERIC_EMAIL',
                                                      'arn', 'arn:aws:lambda:eu-west-1:617273772516:function:locaria-aurora-triggers-swindonbid-multi-triggerEmail:1',
                                                      'region', 'eu-west-1',
                                                      'mode', 'RequestResponse'
        );
BEGIN

    DELETE FROM locaria_core.parameters WHERE parameter_name = 'email_config';
    INSERT INTO locaria_core.parameters(parameter_name, parameter)
    SELECT 'email_config',
           jsonb_build_object('contact_us', email_parameters);

    DELETE FROM locaria_core.messages WHERE attributes @> jsonb_build_object('test', true);
    INSERT INTO locaria_core.messages (message, attributes)
    SELECT jsonb_build_object('name',       'Foo Person',
                              'email',      'test@nautoguide.com',
                              'message',    'This is a test',
                              'type',       'contact'
                              ),
           jsonb_build_object('test', true,'send_email', true);



END;
$$ LANGUAGE PLPGSQL;