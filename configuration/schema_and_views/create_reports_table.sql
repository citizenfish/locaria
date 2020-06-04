DROP TABLE IF EXISTS locus_core.reports;
CREATE  TABLE locus_core.reports(

    id                  BIGSERIAL,
    report_name         TEXT,
    report_parameters   JSONB,
    last_updated        TIMESTAMP DEFAULT NOW()

);