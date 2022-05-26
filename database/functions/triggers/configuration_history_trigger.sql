CREATE OR REPLACE FUNCTION locaria_core.configuration_history_trigger() RETURNS TRIGGER AS
$$
BEGIN
    PERFORM locaria_core.add_history(row_to_json(OLD.*)::JSONB || jsonb_build_object('_table_name', concat_ws('.', TG_TABLE_SCHEMA, TG_TABLE_NAME), 'type', 'configuration_history'));
    IF NEW IS NULL THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

--categories
DROP TRIGGER IF EXISTS categories_trigger ON locaria_core.categories;
CREATE TRIGGER  categories_trigger
BEFORE DELETE OR UPDATE ON locaria_core.categories
FOR EACH ROW WHEN ((pg_trigger_depth() = 0)) EXECUTE PROCEDURE locaria_core.configuration_history_trigger();

--assets
DROP TRIGGER IF EXISTS assets_trigger ON locaria_core.assets;
CREATE TRIGGER assets_trigger
BEFORE DELETE OR UPDATE ON locaria_core.assets
FOR EACH ROW WHEN ((pg_trigger_depth() = 0)) EXECUTE PROCEDURE locaria_core.configuration_history_trigger();

--parameters
DROP TRIGGER IF EXISTS parameters_trigger ON locaria_core.parameters;
CREATE TRIGGER parameters_trigger
BEFORE DELETE OR UPDATE ON locaria_core.parameters
FOR EACH ROW WHEN ((pg_trigger_depth() = 0)) EXECUTE PROCEDURE locaria_core.configuration_history_trigger();

--reports
DROP TRIGGER IF EXISTS reports_trigger ON locaria_core.reports;
CREATE TRIGGER reports_trigger
BEFORE DELETE OR UPDATE ON locaria_core.reports
FOR EACH ROW WHEN ((pg_trigger_depth() = 0)) EXECUTE PROCEDURE locaria_core.configuration_history_trigger();