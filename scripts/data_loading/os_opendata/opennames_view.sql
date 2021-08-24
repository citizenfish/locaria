DROP MATERIALIZED VIEW IF EXISTS locus_core.address_search_view;
CREATE MATERIALIZED VIEW locus_core.address_search_view
AS
SELECT
fid AS id,
row_to_json(N.*)::JSONB || jsonb_build_object('address', name1) -'wkb_geometry' AS attributes,
wkb_geometry
FROM locus_data.namedplace N
WHERE  local_type IN ('City','Town','Other Settlement','Village','Hamlet','Suburban Area','Named Road','Postcode');


CREATE INDEX address_view_jsonb_ts_vector
ON locus_core.address_search_view
USING GIN (jsonb_to_tsvector('Simple'::regconfig, attributes, '["string", "numeric"]'::jsonb));

CREATE INDEX address_view_geometry_gist
ON locus_core.address_search_view
USING GIST(wkb_geometry);

