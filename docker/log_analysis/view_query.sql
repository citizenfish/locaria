

WITH LOGS AS (
    SELECT JSONB_ARRAY_ELEMENTS(log_message) AS log,id
    FROM locaria_core.logs
    WHERE log_type = 'cloudfront'
),LOG_ITEMS AS (
    SELECT * FROM LOGS, jsonb_to_record(LOG) AS x("date" TEXT,
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
                                                  "sc-range-end" TEXT)
)

SELECT * FROM LOG_ITEMS WHERE "cs(User-Agent)" ~ 'bot'
--DELETE FROM  locaria_core.logs where log_type='cloudfront'