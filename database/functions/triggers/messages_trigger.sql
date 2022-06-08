CREATE OR REPLACE FUNCTION locaria_core.messages_trigger() RETURNS TRIGGER AS
$$
DECLARE
    ret_var JSONB;
    params JSONB DEFAULT jsonb_build_object('function', 'send_email',  'mode', 'Event');
BEGIN

      IF NEW.attributes @> jsonb_build_object('send_email', true) THEN

           SELECT parameter
           INTO params
           FROM locaria_core.parameters
           WHERE parameter_name = 'email_config';

           SELECT locaria_core.aws_lambda_interface(params) INTO ret_var;
           PERFORM locaria_core.log(ret_var || jsonb_build_object('type', 'messages_trigger_send_email'), 'messages_triggered');
      END IF;

      RETURN NEW;

EXCEPTION WHEN OTHERS THEN
    PERFORM locaria_core.log(params,SQLERRM);
END;
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER messages_trigger
    AFTER INSERT OR UPDATE ON locaria_core.messages
    FOR EACH ROW  WHEN ((pg_trigger_depth() = 0)) EXECUTE PROCEDURE locaria_core.messages_trigger();