--A legacy process not required any more but for loading the OS openames data set
--Download opennames locally from Ordnance Survey

cat DATA/*.csv > opennames-all.csv

CREATE TABLE locus_core.os_opennames(
id character varying,
names_uri text,
name1 character varying,
name1_lang character varying,
name2 character varying,
name2_lang character varying,
type character varying,
local_type character varying,
geometry_x float,
geometry_y float,
most_detail_view_res integer,
least_detail_view_res integer,
mbr_xmin float,
mbr_ymin float,
mbr_xmax float,
mbr_ymax float,
postcode_district character varying,
postcode_district_uri text,
populated_place character varying,
populated_place_uri text,
populated_place_type text,
district_borough character varying,
district_borough_uri text,
district_borough_type character varying,
county_unitary character varying,
county_unitary_uri text,
county_unitary_type text,
region character varying,
region_uri text,
country character varying,
country_uri text,
related_spatial_object character varying,
same_as_dbpedia character varying,
same_as_geonames character varying,
  CONSTRAINT opennames_pk PRIMARY KEY (id)

);


(psql command line)
\copy locus_core.os_opennames FROM 'opennames-all.csv' WITH CSV

ALTER TABLE  locus_core.os_opennames ADD COLUMN wkb_geometry GEOMETRY(Point,4326);

UPDATE locus_core.os_opennames SET wkb_geometry = ST_TRANSFORM(ST_GEOMFROMEWKT('SRID=27700;POINT('||geometry_x||' '||geometry_y||')'), 4326);

CREATE INDEX opennames_wkb_geometry_idx ON locus_core.os_opennames USING GIST(wkb_geometry);

CREATE INDEX opennames_pc_idx ON locus_core.os_opennames  (name1) WHERE local_type='Postcode'

--Create a view on this data optimised for free text searching

ALTER TABLE locus_core.os_opennames ADD COLUMN tsv tsvector

UPDATE locus_core.os_opennames SET tsv = setweight(to_tsvector(COALESCE(name1,'')), 'A') ||
		setweight(to_tsvector(COALESCE(name2,'')), 'B') ||
		setweight(to_tsvector(COALESCE(populated_place,'')), 'C') ||
		setweight(to_tsvector(COALESCE(district_borough,'')), 'D')

CREATE INDEX os_opennames_weighted_tsv  ON locus_core.os_opennames	USING GIN(tsv) 	WHERE local_type IN ('City','Town','Other Settlement','Village','Hamlet','Suburban Area','Named Road','Postcode')

--Narrowed down to Surrey Heath area
CREATE OR REPLACE view locus_core.location_search_view AS
SELECT id,
	   wkb_geometry,
	   tsv,
	   name1 AS location,
	   local_type as location_type
FROM   locus_core.os_opennames
WHERE  local_type IN ('City','Town','Other Settlement','Village','Hamlet','Suburban Area','Named Road','Postcode')
AND wkb_geometry && 'BOX(-0.8 51.3, -0.5 51.4,)'::BOX2D;


