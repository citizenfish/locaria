CREATE OR REPLACE FUNCTION locaria_core.files_trigger() RETURNS TRIGGER AS
$$
    DECLARE
        ret_var JSONB;
        params JSONB DEFAULT jsonb_build_object('function', 'file_loader', 'fargate', 'true', 'mode', 'Event');
        ws_params JSONB DEFAULT jsonb_build_object('function', 'ws_broadcast',
                                                   'parameters', jsonb_build_object('group', 'Admins',
                                                                                    'packet', jsonb_build_object('queue', 'fileStatus',
                                                                                                                 'packet', jsonb_build_object('message', 'statusChange'))));
    BEGIN

        IF NEW.status = 'REGISTERED' AND OLD.status != 'REGISTERED' OR OLD.status IS NULL THEN
            IF (SELECT 1 FROM locaria_core.parameters WHERE parameter_name = 'fargate_config' AND (parameter->>'file_loader') IS NOT NULL) IS NOT NULL THEN
                SELECT locaria_core.aws_lambda_interface(params) INTO ret_var;
                PERFORM locaria_core.log(ret_var || jsonb_build_object('type', 'file_trigger_fargate'), 'fargate_triggered');
            END IF;
        END IF;


        IF NEW.status = 'DOWNLOAD_REQUESTED' AND OLD.status != 'DOWNLOAD_REQUESTED' OR OLD.status IS NULL THEN
             IF (SELECT 1 FROM locaria_core.parameters WHERE parameter_name = 'fargate_config' AND (parameter->>'file_download') IS NOT NULL) IS NOT NULL THEN
                params = params || jsonb_build_object('function', 'file_download');
                SELECT locaria_core.aws_lambda_interface(params) INTO ret_var;
                PERFORM locaria_core.log(ret_var || jsonb_build_object('type', 'file_download_trigger_fargate'), 'fargate_triggered');
            END IF;
        END IF;

        --When a new file is added or status of an existing changes then inform all Admin clients
        IF (NEW.status != OLD.status) OR OLD.status IS NULL THEN
                IF (SELECT 1 FROM locaria_core.parameters WHERE parameter_name = 'lambda_config' ) IS NOT NULL THEN
                    ws_params = jsonb_set(ws_params,'{parameters,packet,packet}', jsonb_build_object('message', 'statusChange', 'status', NEW.status));
                    PERFORM locaria_core.aws_lambda_interface(ws_params);
                END IF;
        END IF;

    RETURN NEW;

    EXCEPTION WHEN OTHERS THEN
        PERFORM locaria_core.log(params,SQLERRM);
    END;
$$ LANGUAGE PLPGSQL;

DROP TRIGGER IF EXISTS files_trigger ON locaria_core.files;
CREATE TRIGGER files_trigger
    AFTER INSERT OR UPDATE ON locaria_core.files
    FOR EACH ROW  WHEN ((pg_trigger_depth() = 0)) EXECUTE PROCEDURE locaria_core.files_trigger();