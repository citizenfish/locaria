CREATE OR REPLACE FUNCTION locaria_core.aws_lambda_interface(lambda_parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    lambda_config JSON;
    mode_var TEXT DEFAULT 'Event'; -- Event =  asynchronous call, RequireResponse = synchronous call
    log_var TEXT DEFAULT 'None';
    status_code_var INT;
    payload_var JSON;
    executed_version_var TEXT;
    log_result_var TEXT;

BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';

    SELECT parameter AS lambda_config
    FROM parameters
    WHERE parameter_name = 'lambda_config';

    SELECT status_code,
           payload,
           executed_version,
           log_result
    INTO   status_code_var,
           payload_var,
           executed_version_var,
           log_result_var
    FROM aws_lambda.invoke(aws_commons.create_lambda_function_arn(json_extract_path_text(lambda_config, lambda_parameters->>'function', 'arn'),
                                                                  json_extract_path_text(lambda_config, lambda_parameters->>'function', 'region')),
                           COALESCE(lambda_parameters->'parameters', json_build_object()),
                           COALESCE(lambda_parameters->>'mode', mode_var),
                           COALESCE(lambda_parameters->>'log_type', log_var));

    RETURN jsonb_build_object('status_code',      status_code_var,
                             'payload',           payload_var,
                             'executed_version',  executed_version_var,
                             'log_result',        log_result_var);

EXCEPTION WHEN OTHERS THEN

    --We do not log as causes transaction clash, this is only ever called from other functions
    RETURN jsonb_build_object('error',           'aws_lambda_interface error',
                             'debug',           lambda_parameters,
                             'debug1',          json_extract_path_text(lambda_config, lambda_parameters->>'function', 'arn'),
                             'sql_error',       SQLERRM);

END;
$$ LANGUAGE PLPGSQL;