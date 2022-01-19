DROP MATERIALIZED VIEW IF EXISTS locaria_data.location_search_view;

CREATE MATERIALIZED VIEW locaria_data.location_search_view
AS
SELECT
    fid AS id,
    row_to_json(N.*)::JSONB || jsonb_build_object('address', name1) -'wkb_geometry' AS attributes,
    wkb_geometry
FROM locaria_data.opennames N
WHERE  local_type IN ('City','Town','Other Settlement','Village','Hamlet','Suburban Area','Named Road','Postcode');


CREATE INDEX opennames_search_view_jsonb_ts_vector
    ON locaria_data.location_search_view
        USING GIN (jsonb_to_tsvector('Simple'::regconfig, attributes, '["string", "numeric"]'::jsonb));

CREATE INDEX opennames_search_view_geometry_gist
    ON locaria_data.location_search_view
        USING GIST(wkb_geometry);

CREATE INDEX opennames_search_view_jsonb_ops
    ON locaria_data.location_search_view
        USING gin(attributes jsonb_path_ops);

--DROP MATERIALIZED VIEW IF EXISTS locus_core.address_search_view;
--CREATE VIEW locus_core.address_search_view
--AS SELECT * FROM locus_core.opennames_search_view;
