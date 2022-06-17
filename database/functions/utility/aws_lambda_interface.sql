CREATE OR REPLACE FUNCTION locaria_core.aws_lambda_interface(lambda_parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    lambda_config JSONB;
    mode_var TEXT DEFAULT 'Event'; -- Event =  asynchronous call, ReqquestResponse = synchronous call
    log_var TEXT DEFAULT 'None';
    status_code_var INT;
    payload_var JSONB;
    executed_version_var TEXT;
    log_result_var TEXT;
    v_detail  TEXT;
BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';

    SELECT parameter
    INTO lambda_config
    FROM parameters
    WHERE parameter_name = CASE WHEN COALESCE(lambda_parameters->>'fargate', '') != '' THEN 'fargate_config'
                           ELSE COALESCE(lambda_parameters->>'config','lambda_config') END;

    RAISE NOTICE 'DEBUG %', lambda_parameters->'parameters';
    RAISE NOTICE 'DEBUG1 %', lambda_config;
    RAISE NOTICE 'DEBUG2 %', jsonb_extract_path_text(lambda_config, lambda_parameters->>'function', 'arn');
    RAISE NOTICE 'DEBUG 3[%]', lambda_parameters->>'function';

    SELECT status_code,
           payload,
           executed_version,
           log_result
    INTO   status_code_var,
           payload_var,
           executed_version_var,
           log_result_var
    FROM aws_lambda.invoke(aws_commons.create_lambda_function_arn(
                           jsonb_extract_path_text(lambda_config::JSONB, lambda_parameters->>'function', 'arn'),
                           jsonb_extract_path_text(lambda_config::JSONB, lambda_parameters->>'function', 'region')),
                           COALESCE(lambda_parameters->'parameters', jsonb_extract_path(lambda_config, lambda_parameters->>'function'), jsonb_build_object()),
                           COALESCE(lambda_parameters->>'mode', jsonb_extract_path_text(lambda_config::JSONB, lambda_parameters->>'function', 'mode'), mode_var),
                           COALESCE(lambda_parameters->>'log_type', jsonb_extract_path_text(lambda_config::JSONB, lambda_parameters->>'function', 'log'), log_var));

    RETURN jsonb_build_object('status_code',      status_code_var,
                             'payload',           payload_var::JSONB,
                             'executed_version',  executed_version_var,
                             'log_result',        log_result_var);

EXCEPTION WHEN OTHERS THEN

    get stacked diagnostics
        v_detail  = pg_exception_detail;

    --We do not log as causes transaction clash, this is only ever called from other functions
    RETURN jsonb_build_object('error',           'aws_lambda_interface error',
                             'debug',           lambda_parameters,
                             'debug1',          jsonb_extract_path_text(lambda_config, lambda_parameters->>'function', 'arn'),
                             'sql_error',       concat_ws(':',SQLERRM, SQLSTATE, v_detail));

END;
$$ LANGUAGE PLPGSQL;