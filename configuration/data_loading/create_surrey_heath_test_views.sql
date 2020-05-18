--Note well casts on category
--CAR PARKS

CREATE OR REPLACE VIEW locus_core.car_parks AS 
SELECT DISTINCT ON (shbc_carparks_locus.id_0) shbc_carparks_locus.id_0 AS id,
	st_transform(shbc_carparks_locus.geom, 4326) AS wkb_geometry,
	now() AS date_added,
	ARRAY['Highways and Transport'::locus_core.search_category] AS category,
	jsonb_build_object(
	'title', shbc_carparks_locus.name, 
	'description', jsonb_build_object(
		'name', shbc_carparks_locus.name,  
		'type', 'Car Park'), 
	'table', shbc_carparks_locus.tableoid::regclass::text) AS attributes    
FROM locus.shbc_carparks_locus;

--WARD BOUNDARIES

CREATE OR REPLACE VIEW locus_core.ward_boundaries AS
SELECT distinct on (id)  id AS id,
        --NOTE WELL geojson DOES NOT SUPPORT multisurface or polysurface geometries types
        ST_TRANSFORM( geom, 4326) AS wkb_geometry,
        last_updated::TIMESTAMP AS date_added,
        ARRAY['Democracy']::locus_core.search_category[] AS category,
        jsonb_build_object(
	'title', shbc_ward_boundaries.name, 
	'description', jsonb_build_object(
		'name', shbc_ward_boundaries.ward_name, 
		'type', 'Ward'), 
	'table', shbc_ward_boundaries.tableoid::regclass::text) AS attributes
FROM locus.shbc_ward_boundaries;

--PARISH BOUNDARIES

CREATE OR REPLACE VIEW locus_core.parish_boundaries AS
SELECT distinct on (id_1)  id_1 AS id,
        ST_TRANSFORM(geom, 4326) AS wkb_geometry,
        last_updated::TIMESTAMP AS date_added,
        ARRAY['Democracy']::locus_core.search_category[] AS category,
        jsonb_build_object(
	'title', shbc_parish_boundaries_locus.name, 
	'description', jsonb_build_object(
		'name', shbc_parish_boundaries_locus.name,  
		'type', 'Parish',  
		'additional_information', ''), 
	'table', shbc_parish_boundaries_locus.tableoid::regclass::text) AS attributes
FROM locus.shbc_parish_boundaries_locus;

--POLLING STATIONS

CREATE OR REPLACE VIEW locus_core.polling_stations AS
SELECT distinct on (id_1)  id_1 AS id,
        ST_TRANSFORM(geom, 4326) AS wkb_geometry,
        last_updated::TIMESTAMP AS date_added,
        ARRAY['Democracy']::locus_core.search_category[] AS category,
        jsonb_build_object(
	'ref', polling_stations_2019_locus.poll_uprn,
	'title', polling_stations_2019_locus.address, 
	'description', jsonb_build_object(
		'type', 'Polling Station'), 
	'table', polling_stations_2019_locus.tableoid::regclass::text) AS attributes   
FROM locus.polling_stations_2019_locus;

--LISTED BUILDINGS

CREATE OR REPLACE VIEW locus_core.listed_buildings AS
SELECT distinct on (id_0)  id_0 AS id,
        ST_TRANSFORM(geom, 4326) AS wkb_geometry,
        last_updated::TIMESTAMP AS date_added,
        ARRAY['Planning']::locus_core.search_category[] AS category,
        jsonb_build_object(
	'title', listed_buildings_locus.name, 
	'description', jsonb_build_object(
		'name', listed_buildings_locus.name,  
		'ref',  listed_buildings_locus.grade, 
		'type', 'Listed Building',  
		'additional_information', listed_buildings_locus.location), 
	'table', listed_buildings_locus.tableoid::regclass::text) AS attributes    
FROM locus.listed_buildings_locus;

--CONSERVATION AREAS

CREATE OR REPLACE VIEW locus_core.conservation_areas AS
SELECT distinct on (id)  id AS id,
        st_transform(conservation_areas.geom, 4326) AS wkb_geometry,
	last_updated::TIMESTAMP AS date_added,
        ARRAY['Planning']::locus_core.search_category[] AS category,
        jsonb_build_object(
		'title', conservation_areas.ca_name, 
		'description', jsonb_build_object(
			'name', conservation_areas.ca_name,
			'ref', conservation_areas.policy_number,
			'type', 'Conservation Area'
			),
	'table', conservation_areas.tableoid::regclass::text) AS attributes   
FROM locus.conservation_areas;

--BOUNDARY

CREATE OR REPLACE VIEW locus_core.boundary AS
SELECT distinct on (id_1)  id_1 AS id,
        ST_TRANSFORM(geom, 4326) AS wkb_geometry,
        last_updated::TIMESTAMP AS date_added,
        ARRAY['Democracy']::locus_core.search_category[] AS category,
        jsonb_build_object(
	'title', '', 
	'description', jsonb_build_object(
		'name', 'Surrey Heath Borough Council',  
		'ref', 'E07000214', 
		'type', 'Borough Boundary',  
		'url', 'https://www.surreyheath.gov.uk', 
		'additional_information', ''), 
	'table', shbc_boundary_locus.tableoid::regclass::text) AS attributes
FROM locus.shbc_boundary_locus;

--LIBRARIES

CREATE OR REPLACE VIEW locus_core.libraries AS
SELECT distinct on (id_1)  id_1 AS id,
        ST_TRANSFORM(geom, 4326) AS wkb_geometry,
        last_updated::TIMESTAMP AS date_added,
        ARRAY['Community']::locus_core.search_category[] AS category,
        jsonb_build_object(
	'title', libraries_locus.name, 
	'description', jsonb_build_object(
		'name', libraries_locus.name,  
		'type', 'library'
		), 
	'table', libraries_locus.tableoid::regclass::text) AS attributes
FROM locus.libraries_locus;

--COMMUNITY HALLS

CREATE OR REPLACE VIEW locus_core.community_halls AS
SELECT distinct on (id_1)  id_1 AS id,
        ST_TRANSFORM(geom, 4326) AS wkb_geometry,
        last_updated::TIMESTAMP AS date_added,
        ARRAY['Community']::locus_core.search_category[] AS category,
        jsonb_build_object(
	'title', community_halls_locus.venue, 
	'description', jsonb_build_object(
		'name', community_halls_locus.venue,  
		'type', 'Community Hall',  
		'url', community_halls_locus.url, 
		'additional_information', community_halls_locus.address), 
	'table', community_halls_locus.tableoid::regclass::text) AS attributes  			
FROM locus.community_halls_locus;

--TOILETS

CREATE OR REPLACE VIEW locus_core.toilets AS
SELECT distinct on (id_1)  id_1 AS id,
        ST_TRANSFORM(geom, 4326) AS wkb_geometry,
        last_updated::TIMESTAMP AS date_added,
        ARRAY['Community']::locus_core.search_category[] AS category,
        jsonb_build_object(
	'title', toilets_locus.location, 
	'description', jsonb_build_object(
		'type', 'Toilet',
		'additional_information',toilets_locus.disabled_a), 
	'table', toilets_locus.tableoid::regclass::text) AS attributes 	
FROM locus.toilets_locus;


--PLAY AREAS

CREATE OR REPLACE VIEW locus_core.play_areas AS
SELECT distinct on (id_1) id_1 AS id,
        ST_TRANSFORM(geom, 4326) AS wkb_geometry,
        last_updated::TIMESTAMP AS date_added,
        ARRAY['Community']::locus_core.search_category[] AS category,
        jsonb_build_object(
	'title', play_areas_locus.name, 
	'description', jsonb_build_object(
		'name', play_areas_locus.name,  
		'type', 'Play Area',  
		'additional_information', 'Managed by' || play_areas_locus.managed_by::text), 
	'table', play_areas_locus.tableoid::regclass::text) AS attributes
FROM locus.play_areas_locus;

--RECYCLING CENTRES

CREATE OR REPLACE VIEW locus_core.recycling_centres AS
SELECT distinct on (id_0)  id_0 AS id,
        ST_TRANSFORM(geom, 4326) AS wkb_geometry,
        last_updated::TIMESTAMP AS date_added,
        ARRAY['Waste and Recycling']::locus_core.search_category[] AS category,
        jsonb_build_object(
	'title', recycling_centres_shbc_locus.address, 
	'description', jsonb_build_object(
		'type', 'Recycling Centre',
		'additional_information', 'Managed by' || recycling_centres_shbc_locus.collects::text), 
	'table', recycling_centres_shbc_locus.tableoid::regclass::text) AS attributes    
FROM locus.recycling_centres_shbc_locus;

--SCHOOLS

CREATE OR REPLACE VIEW locus_core.schools AS
SELECT distinct on (id_0)  id_0 AS id,
        ST_TRANSFORM(geom, 4326) AS wkb_geometry,
        now() AS date_added,
        ARRAY['Education']::locus_core.search_category[] AS category,
        jsonb_build_object(
	'title', shbc_all_open_schools_locus."EstablishmentName", 
	'description', jsonb_build_object(
		'ref', shbc_all_open_schools_locus."URN",
		'type', 'School',
		'additional_information',shbc_all_open_schools_locus."PhaseOfEducation (name)"), 
	'table', shbc_all_open_schools_locus.tableoid::regclass::text) AS attributes 			
FROM locus.shbc_all_open_schools_locus;

--COUNCIL TAX BANDS

CREATE OR REPLACE VIEW locus_core.council_tax_bands AS
SELECT distinct on(id) id,
       ST_TRANSFORM(ST_GEOMFROMEWKT('SRID=27700;POINT('||map_x||' '||map_y||')'),4326) AS wkb_geometry,
       now() AS date_added,
       ARRAY['Council Tax']::locus_core.search_category[] AS category,
       jsonb_build_object(
         ------ ***************************** NOTE WELL THE 0 append on UPRN to conform to LLPG may not be right **********************
	      'ref', '0'::text || ctax_bands_current_locus.ctax_uprn::text,
	      'title', ctax_bands_current_locus.address,
	      'description', jsonb_build_object(
		        'name', ctax_bands_current_locus.address,  
		        'ref', 'Council Tax Band '::text || ctax_bands_current_locus.ctax_adjusted_band::text, 
		        'type', 'Council Tax Band'
        ), 
	      'table', ctax_bands_current_locus.tableoid::regclass::text) AS attributes   	             
 FROM locus.ctax_bands_current_locus;

--PLANNING APPLICATIONS

CREATE OR REPLACE VIEW locus_core.planning_applications AS
SELECT id::INTEGER ,
       ST_TRANSFORM(ST_GEOMFROMEWKT('SRID=27700;POINT('||map_x||' '||map_y||')'),4326) AS wkb_geometry,
       dateaprecv AS date_added,
       ARRAY['Planning']::locus_core.search_category[] AS category,
       jsonb_build_object(
	'ref', uprn,
	'title', refval::text,
	'description', jsonb_build_object(
		'name', address,
		'ref',  refval::text,
		'keyval', keyval,
		'type', 'Application',
		'url', 'https://publicaccess.surreyheath.gov.uk/online-applications/applicationDetails.do?keyVal='||keyval||'&activeTab=summary',
		'additional_information', proposal::text),
	'table', locus.dc_apps_readonly.tableoid::regclass::text) AS attributes
FROM locus.dc_apps_readonly;

--Councillors

CREATE OR REPLACE VIEW locus_core.councillor_details AS
SELECT COUN.id,
	   ST_TRANSFORM(geom::GEOMETRY, 4326) AS wkb_geometry,
	   now() as date_added,
	   ARRAY['Democracy']::locus_core.search_category[] AS category,
	   jsonb_build_object(
		   'title', title, 
		   'description', jsonb_build_object(
			   'title', title, 
			   'party', party, 
			   'ward', ward,
			   'url', linkuri, 
			   'type', 'councillor')) AS attributes
FROM locus.councillor_details_view COUN
INNER JOIN locus.shbc_ward_boundaries WARD
ON trim(ward) = ward_name;

-- PROW
			   
CREATE OR REPLACE VIEW locus_core.prow AS 
  SELECT DISTINCT ON (rights_of_way_readonly_locus.id) rights_of_way_readonly_locus.id,
    st_transform(rights_of_way_readonly_locus.geom, 4326) AS wkb_geometry,
    now() AS date_added,
    ARRAY['Rights of Way'::locus_core.search_category] AS category,
    jsonb_build_object(
    	'title', rights_of_way_readonly_locus.prowno, 
    	'description', jsonb_build_object(
    		'name', rights_of_way_readonly_locus.prow_loc, 
    		'type', 'PROW',
    		'stat_text', stat_text,
    		'additional_information', rights_of_way_readonly_locus.prowstat), 
    		'table', rights_of_way_readonly_locus.tableoid::regclass::text) AS attributes
   FROM locus.rights_of_way_readonly_locus;			   

--TPOs

CREATE OR REPLACE VIEW locus_core.tree_preservation_orders AS
    SELECT DISTINCT ON (ogc_fid) ogc_fid AS id,
    st_transform(wkb_geometry, 4326) AS wkb_geometry,
    now() AS date_added,
    ARRAY['Planning'::locus_core.search_category] AS category,
    jsonb_build_object(
        'title', refval,
        'description', jsonb_build_object(
            'name', address,
            'ref', refval,
            'type', 'TPO',
            'additional_information', tptreecat
        ),
    'table', tpo_polygons_locus.tableoid::regclass::text) AS attributes
    FROM locus.tpo_polygons_locus where tptreecat is not null and tptreecat != ' ' ;
			   
--LLPG SEARCH
			   
			   
DROP MATERIALIZED VIEW locus_core.address_search_view;
CREATE MATERIALIZED VIEW locus_core.address_search_view
AS
SELECT llpg.uprn::bigint AS id,
st_transform(llpg.geom, 4326) AS wkb_geometry,
jsonb_build_object(
'ofid', uprn,
'address', llpg.address,
'organisation', llpg.organisation,
'title', concat_ws(' '::text, llpg.sao_start_number, llpg.sao_start_suffix, llpg.sao_end_number, llpg.sao_end_suffix, llpg.sao_text, llpg.pao_start_number, llpg.pao_start_suffix, llpg.pao_end_number, llpg.pao_end_suffix, llpg.pao_text, llpg.street_description),
'usrn', llpg.usrn,
'uprn', llpg.uprn_c,
'locality', llpg.locality,
'sao_text', llpg.sao_text,
'sao_start_number', llpg.sao_start_number,
'sao_start_suffix', llpg.sao_start_suffix,
'sao_end_number', llpg.sao_end_number,
'sao_end_suffix', llpg.sao_end_suffix,
'pao_start_number', llpg.pao_start_number,
'pao_start_suffix', llpg.pao_start_suffix,
'pao_end_number', llpg.pao_end_number,
'pao_end_suffix', llpg.pao_end_suffix,
'pao_text', llpg.pao_text,
'street_description', llpg.street_description,
'postal_town', llpg.post_town,
'postcode', llpg.postcode,
'x_coord', ROUND(llpg.e),
'y_coord', ROUND(llpg.n),
'lat', llpg.lat,
'lon', llpg.lon,
'la_code', llpg.la_code,
'ward_code', llpg.ward_code,
'parish_code', llpg.parish_code) AS attributes
FROM locus.llpg
WHERE llpg.lpi_status::text = 'Approved Preferred'::text AND llpg.postal_address::text = 'Postal Address'::text;

CREATE INDEX llpg_jsonb_ts_vector
ON locus_core.address_search_view
USING GIN (jsonb_to_tsvector('English'::regconfig, attributes, '["string", "numeric"]'::jsonb));

CREATE INDEX llpg_geometry_gist
ON locus_core.address_search_view
USING GIST(wkb_geometry);


SELECT locus_core.views_union();
REFRESH MATERIALIZED VIEW CONCURRENTLY locus_core.global_search_view;
