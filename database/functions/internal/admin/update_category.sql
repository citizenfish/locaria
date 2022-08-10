CREATE OR REPLACE FUNCTION locaria_core.update_category(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';

    INSERT INTO categories(category, attributes)
    SELECT parameters->>'category', parameters->'attributes'
    ON CONFLICT (category) DO UPDATE SET attributes = EXCLUDED.attributes
    RETURNING jsonb_build_object('id', id)
    INTO ret_var;

    IF (parameters->>'rename') IS NOT NULL THEN
        UPDATE categories
        SET category = parameters->>'rename'
        WHERE category = parameters->>'category';
        ret_var = ret_var || jsonb_build_object('rename', 'true');
    END IF;

    RETURN ret_var || jsonb_build_object('history', add_history(parameters));
END;
$$ LANGUAGE PLPGSQL;