CREATE OR REPLACE FUNCTION locaria_core.messages_trigger() RETURNS TRIGGER AS
$$
DECLARE
    ret_var JSONB;
    params JSONB DEFAULT jsonb_build_object('function', 'send_email',  'mode', 'Event');
BEGIN

      IF NEW.attributes @> jsonb_build_object('send_email', true) THEN
          --TODO the sender and recipient are wrong way round
          --TODO where is message body? Should be in TemplateData
          SELECT jsonb_build_object('Destination',  jsonb_build_object('ToAddresses',jsonb_build_array(concat_ws(' ', NEW.message->>'name', '<'||(NEW.message->>'email')||'>'))),
                                    'Source',       jsonb_extract_path_text(parameter, COALESCE(NEW.attributes->>'email_type', 'contact_us'), 'Source'),
                                    'Template',     jsonb_extract_path_text(parameter, COALESCE(NEW.attributes->>'email_type', 'contact_us'), 'Template'),
                                    'TemplateData', jsonb_build_object('subject', COALESCE(NEW.message->>'subject', params->>'subject', 'Contact from website'))::TEXT)
          INTO params
          FROM locaria_core.parameters
          WHERE parameter_name = 'email_config';

          SELECT locaria_core.aws_lambda_interface(jsonb_build_object('parameters',params) ||
                                                   --TODO potential security risk, could call other lambdas
                                                   jsonb_build_object('function', COALESCE(NEW.attributes->>'email_type', 'contact_us'),
                                                                      'config', 'email_config')) INTO ret_var;

           PERFORM locaria_core.log(ret_var || jsonb_build_object('type', 'messages_trigger_send_email'), 'messages_triggered');
      END IF;

      RETURN NEW;

EXCEPTION WHEN OTHERS THEN
    PERFORM locaria_core.log(params,SQLERRM);
END;
$$ LANGUAGE PLPGSQL;

DROP TRIGGER IF EXISTS messages_trigger ON locaria_core.messages;
CREATE TRIGGER messages_trigger
    AFTER INSERT OR UPDATE ON locaria_core.messages
    FOR EACH ROW  WHEN ((pg_trigger_depth() = 0)) EXECUTE PROCEDURE locaria_core.messages_trigger();