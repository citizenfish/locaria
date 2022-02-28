DROP TABLE IF EXISTS locaria_core.reports;
CREATE  TABLE locaria_core.reports(

    id                  BIGSERIAL PRIMARY KEY,
    report_name         TEXT,
    report_parameters   JSONB,
    admin_privilege     BOOLEAN DEFAULT FALSE,
    last_updated        TIMESTAMP DEFAULT NOW()

);

--priv limited role for running reports
DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles  -- SELECT list can be empty for this
      WHERE  rolname = 'locaria_report_user') THEN

      CREATE ROLE locaria_report_user;
   END IF;
END
$$;

GRANT USAGE ON SCHEMA locaria_core TO locaria_report_user;
GRANT USAGE ON SCHEMA locaria_data TO locaria_report_user;
GRANT SELECT ON ALL TABLES IN SCHEMA locaria_data TO locaria_report_user;
GRANT USAGE ON SCHEMA public TO locaria_report_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO locaria_report_user;
