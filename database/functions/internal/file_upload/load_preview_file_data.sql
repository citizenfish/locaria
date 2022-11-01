CREATE OR REPLACE FUNCTION locaria_core.load_preview_file_data(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    status_var TEXT DEFAULT 'IMPORTING';
    max_sync_var INTEGER DEFAULT 5000;
    count_var INTEGER;
    processed_var INTEGER;
    inserts_var INTEGER;
    category_id_var INTEGER;
BEGIN

    SET SEARCH_PATH = 'locaria_uploads','locaria_core','public';

    SELECT status,
           COALESCE(attributes->>'record_count','0')::INTEGER,
           COALESCE(attributes->>'processed','0')::INTEGER,
           --on future passes we read parameters from the file record
           COALESCE(attributes->'load_parameters', parameters)
    INTO  status_var,
          count_var,
          processed_var,
          parameters
    FROM files
    WHERE id = (parameters->>'id')::BIGINT;

    SELECT id
    INTO category_id_var
    FROM categories WHERE category = parameters->>'category';

    IF status_var != 'IMPORTED' THEN

        parameters = parameters || jsonb_build_object('limit', max_sync_var, 'offset', processed_var);

        INSERT INTO locaria_data.imports(category_id, wkb_geometry, attributes)
        SELECT category_id_var,
               wkb_geometry,
               attributes
        FROM get_preview_file_data(parameters);

        GET DIAGNOSTICS inserts_var = ROW_COUNT;

        processed_var = processed_var + inserts_var;

        IF processed_var >= count_var THEN
            status_var = 'IMPORTED';
        ELSE
            IF inserts_var > 0 THEN
                status_var = 'IMPORTING';
            ELSE
                status_var = 'ERROR';
            END IF;
        END IF;

        UPDATE files
        SET status = status_var,
            attributes = attributes || jsonb_build_object('processed', processed_var, 'load_parameters', parameters)
        WHERE id = COALESCE(parameters->>'id', '-1')::INTEGER;
    END IF;

    RETURN jsonb_build_object('status', status_var, 'processed', processed_var, 'record_count', count_var, 'category_id', category_id_var);

END;
$$ LANGUAGE PLPGSQL;