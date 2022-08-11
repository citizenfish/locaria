DROP VIEW IF EXISTS locaria_core.webstats_view;
CREATE VIEW locaria_core.webstats_view AS
WITH LOGS AS (

    SELECT JSONB_ARRAY_ELEMENTS(log_message) AS log,
           id
    FROM locaria_core.logs
    WHERE log_type = 'cloudfront'

),LOG_ITEMS AS (
    SELECT * FROM LOGS, jsonb_to_record(LOG) AS
        x(  "date" TEXT,
            "time" TEXT,
            "x-edge-location" TEXT,
            "sc-bytes" TEXT,
            "c-ip" TEXT,
            "cs-method" TEXT,
            "cs(Host)" TEXT,
            "cs-uri-stem" TEXT,
            "sc-status" TEXT,
            "cs(Referer)" TEXT,
            "cs(User-Agent)" TEXT,
            "cs-uri-query" TEXT,
            "cs(Cookie)" TEXT,
            "x-edge-result-type" TEXT,
            "x-edge-request-id" TEXT,
            "x-host-header" TEXT,
            "cs-protocol" TEXT,
            "cs-bytes" TEXT,
            "time-taken" TEXT,
            "x-forwarded-for" TEXT,
            "ssl-protocol" TEXT,
            "ssl-cipher" TEXT,
            "x-edge-response-result-type" TEXT,
            "cs-protocol-version" TEXT,
            "fle-status" TEXT,
            "fle-encrypted-fields" TEXT,
            "c-port" TEXT,
            "time-to-first-byte" TEXT,
            "x-edge-detailed-result-type" TEXT,
            "sc-content-type" TEXT,
            "sc-content-len" TEXT,
            "sc-range-start" TEXT,
            "sc-range-end" TEXT
            )
)

SELECT id,
       "date"::DATE  AS date,
       "time"::TIME AS time,
       concat_ws(' ',"date","time")::TIMESTAMP AS log_timestamp,
       "x-edge-location" AS x_edge_location,
       "sc-bytes" AS sc_bytes,
       "c-ip" AS ip_address,
       "cs-method" AS method,
       "cs-uri-stem" AS uri_stem,
       "sc-status" AS status,
       "cs(Referer)" AS referer,
       "cs(User-Agent)" AS user_agent,
       "cs-uri-query" AS uri_query,
       "cs(Cookie)" AS cookie,
       "x-edge-result-type" AS edge_result_type,
       "x-host-header" AS host_header,
       "cs-bytes" AS bytes,
       "time-taken" AS time_taken,
       "time-to-first-byte" AS time_to_first_byte,
       "x-edge-detailed-result-type" AS edge_detailed_result_type,
       "sc-content-type" AS content_type,
       "sc-content-len" AS content_len

FROM LOG_ITEMS
