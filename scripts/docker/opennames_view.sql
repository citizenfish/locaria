ALTER TABLE locus_data.namedplace ADD column tsv tsvector;
ALTER TABLE locus_data.namedplace RENAME COLUMN geom TO wkb_geometry;

UPDATE locus_data.named_place
SET tsv = setweight(to_tsvector(COALESCE(name1,'')), 'A') ||
   setweight(to_tsvector(COALESCE(name2,'')), 'B') ||
   setweight(to_tsvector(COALESCE(populated_place,'')), 'C') ||
   setweight(to_tsvector(COALESCE(district_borough,'')), 'D');

CREATE INDEX opennames_wkb_geometry_idx ON locus_data.named_place USING GIST(wkb_geometry);
CREATE INDEX os_opennames_weighted_tsv  ON locus_data.named_place USING GIN(tsv);