DROP TABLE IF EXISTS locus_core.reports;
CREATE  TABLE locus_core.reports(

    id                  BIGSERIAL,
    report_name         TEXT,
    report_parameters   JSONB,
    last_updated        TIMESTAMP DEFAULT NOW()

);

--priv limited role for running reports
CREATE ROLE locus_report_user;
GRANT USAGE ON SCHEMA locus_core TO locus_report_user;
GRANT USAGE ON SCHEMA public TO locus_report_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO locus_report_user;
GRANT SELECT ON locus_core.global_search_view TO locus_report_user