DO
$$
DECLARE
    ret_var JSONB;
    parameters JSONB DEFAULT jsonb_build_object('filter', jsonb_build_object('cron', 'daily'));
BEGIN
    SET SEARCH_PATH = 'locaria_core', 'locaria_data', 'public';

    DELETE FROM files WHERE status IN('FILE_CRON_TEST', 'FILE_CRON_DONE');

    INSERT INTO files(status, attributes)
    SELECT 'FILE_CRON_TEST',
           parameters->'filter'
    RETURNING jsonb_build_object('id', id) INTO ret_var;

    parameters = parameters || jsonb_Build_object('new_status', 'FILE_CRON_DONE');
    SELECT file_cron(parameters) INTO ret_var;

    RAISE NOTICE '%', ret_var;

END;
$$