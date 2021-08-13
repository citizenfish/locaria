DROP MATERIALIZED VIEW IF EXISTS locus_core.location_search_view;
CREATE MATERIALIZED VIEW locus_core.location_search_view AS
SELECT id,
   ST_TRANSFORM(ST_GEOMFROMEWKT('SRID=27700;POINT('||geometry_x||' '||geometry_y||')'), 4326) AS wkb_geometry,
   name1 AS location,
   local_type AS location_type,
   setweight(to_tsvector(COALESCE(name1,'')), 'A') ||
   setweight(to_tsvector(COALESCE(name2,'')), 'B') ||
   setweight(to_tsvector(COALESCE(populated_place,'')), 'C') ||
  setweight(to_tsvector(COALESCE(district_borough,'')), 'D') AS tsv
FROM   locus_core.opennames_import
WHERE  local_type IN ('City','Town','Other Settlement','Village','Hamlet','Suburban Area','Named Road','Postcode');

CREATE INDEX opennames_wkb_geometry_idx ON locus_core.location_search_view USING GIST(wkb_geometry);
CREATE INDEX os_opennames_weighted_tsv  ON locus_core.location_search_view USING GIN(tsv);