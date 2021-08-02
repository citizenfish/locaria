DROP TABLE IF EXISTS locus_core.reports;
CREATE  TABLE locus_core.reports(

    id                  BIGSERIAL,
    report_name         TEXT,
    report_parameters   JSONB,
    last_updated        TIMESTAMP DEFAULT NOW()

);

--priv limited role for running reports
DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles  -- SELECT list can be empty for this
      WHERE  rolname = 'locus_report_user') THEN

      CREATE ROLE locus_report_user;
   END IF;
END
$$;

GRANT USAGE ON SCHEMA locus_core TO locus_report_user;
GRANT USAGE ON SCHEMA public TO locus_report_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO locus_report_user;
