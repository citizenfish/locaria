ALTER TABLE locus_data.namedplace ADD column IF NOT EXISTS tsv tsvector;

UPDATE locus_data.namedplace
SET tsv = setweight(to_tsvector(COALESCE(name1,'')), 'A') ||
   setweight(to_tsvector(COALESCE(name2,'')), 'B') ||
   setweight(to_tsvector(COALESCE(populated_place,'')), 'C') ||
   setweight(to_tsvector(COALESCE(district_borough,'')), 'D');

CREATE INDEX IF NOT EXISTS opennames_wkb_geometry_idx ON locus_data.namedplace USING GIST(wkb_geometry);
CREATE INDEX IF NOT EXISTS os_opennames_weighted_tsv  ON locus_data.namedplace USING GIN(tsv);