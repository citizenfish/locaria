--Note well casts on category
--CAR PARKS

CREATE OR REPLACE VIEW locus_core.car_parks AS 
SELECT DISTINCT ON (id_0) id_0 AS id,
	st_transform(geom, 4326) AS wkb_geometry,
	now() AS date_added,
	ARRAY['Highways and Transport'::locus_core.search_category] AS category,
	jsonb_build_object(
	'title', name,
	'description', jsonb_build_object(
		'name', name,
		'type', 'Car Park',
		'additional_information', name),
	'table', 'id_0'||':'||shbc_carparks_locus.tableoid::regclass::text) AS attributes
FROM locus.shbc_carparks_locus;

--WARD BOUNDARIES

CREATE OR REPLACE VIEW locus_core.ward_boundaries AS
SELECT distinct on (id)  id AS id,
        --NOTE WELL geojson DOES NOT SUPPORT multisurface or polysurface geometries types
        ST_TRANSFORM( geom, 4326) AS wkb_geometry,
        last_updated::TIMESTAMP AS date_added,
        ARRAY['Democracy']::locus_core.search_category[] AS category,
        jsonb_build_object(
	'title', name,
	'description', jsonb_build_object(
		'name', ward_name,
		'type', 'Ward'), 
	'table', 'id'||':'||shbc_ward_boundaries.tableoid::regclass::text) AS attributes
FROM locus.shbc_ward_boundaries;

--PARISH BOUNDARIES

CREATE OR REPLACE VIEW locus_core.parish_boundaries AS
SELECT distinct on (id_1)  id_1 AS id,
        ST_TRANSFORM(geom, 4326) AS wkb_geometry,
        last_updated::TIMESTAMP AS date_added,
        ARRAY['Democracy']::locus_core.search_category[] AS category,
        jsonb_build_object(
	'title', name,
	'description', jsonb_build_object(
		'name', name,
		'type', 'Parish',  
		'additional_information', ''), 
	'table', 'id_1'||':'||shbc_parish_boundaries_locus.tableoid::regclass::text) AS attributes
FROM locus.shbc_parish_boundaries_locus;

--POLLING STATIONS

CREATE OR REPLACE VIEW locus_core.polling_stations AS
SELECT distinct on (id_1)  id_1 AS id,
        ST_TRANSFORM(geom, 4326) AS wkb_geometry,
        last_updated::TIMESTAMP AS date_added,
        ARRAY['Democracy']::locus_core.search_category[] AS category,
        jsonb_build_object(
	'ref', poll_uprn,
	'title', split_part(address,',',1),
	'description', jsonb_build_object(
		'type', 'Polling Station',
		'name', split_part(address, ',', 1),
		'address', address,
		'url_description', 'Google Streetview',
		'url', streetview),
	'table', 'id_1'||':'||polling_stations_2019_locus.tableoid::regclass::text) AS attributes
FROM locus.polling_stations_2019_locus;

--POLLING DISTRICTS

CREATE OR REPLACE VIEW locus_core.polling_districts
AS SELECT DISTINCT ON (id) id,
st_transform(geom, 4326) AS wkb_geometry,
now() AS date_added,
ARRAY['Democracy'::locus_core.search_category] AS category,
jsonb_build_object('title', address,
                   'description', jsonb_build_object('name', address,
                                                     'type', 'Polling Districts'),
                   'table', ('id'::text || ':'::text) || polling_district_2019_polygons.tableoid::regclass::text) AS attributes
FROM locus.polling_district_2019_polygons;


--LISTED BUILDINGS

CREATE OR REPLACE VIEW locus_core.listed_buildings AS
SELECT distinct on (id_0) id_0 AS id,
ST_TRANSFORM(geom, 4326) AS wkb_geometry,
last_updated::TIMESTAMP AS date_added,
ARRAY['Planning']::locus_core.search_category[] AS category,
jsonb_build_object(
'title', name || ' ' ||location,
'description', jsonb_build_object(
'name', name,
'ref', 'Grade: ' || listed_buildings_locus.grade::text,
'type', 'Listed Building',
'address', location,
'url', 'https://historicengland.org.uk/listing/the-list/list-entry/' || listed_buildings_locus.list_entry::text,
'url_description', 'Building Image',
'additional_information', 'Notes on this building - ' || listed_buildings_locus.surveydate::text),
'table', 'id_0'||':'||listed_buildings_locus.tableoid::regclass::text) AS attributes
FROM locus.listed_buildings_locus
WHERE listed_buildings_locus.list_type = 'statutory';

--CONSERVATION AREAS

CREATE OR REPLACE VIEW locus_core.conservation_areas AS
SELECT distinct on (id)  id AS id,
        st_transform(geom, 4326) AS wkb_geometry,
	last_updated::TIMESTAMP AS date_added,
        ARRAY['Planning']::locus_core.search_category[] AS category,
        jsonb_build_object(
		'title', ca_name,
		'description', jsonb_build_object(
			'name', ca_name,
			'ref', policy_number,
			'type', 'Conservation Area'
			),
	'table', 'id'||':'||conservation_areas.tableoid::regclass::text) AS attributes
FROM locus.conservation_areas;

--BOUNDARY

CREATE OR REPLACE VIEW locus_core.boundary AS
SELECT distinct on (id_1)  id_1 AS id,
        ST_TRANSFORM(geom, 4326) AS wkb_geometry,
        last_updated::TIMESTAMP AS date_added,
        ARRAY['Democracy']::locus_core.search_category[] AS category,
        jsonb_build_object(
	'title', 'Surrey Heath Borough Boundary',
	'description', jsonb_build_object(
		'name', 'Surrey Heath Borough Council',  
		'ref', 'E07000214', 
		'type', 'Borough Boundary',  
		'url', 'https://www.surreyheath.gov.uk', 
		'additional_information', ''), 
	'table', 'id_1'||':'||shbc_boundary_locus.tableoid::regclass::text) AS attributes
FROM locus.shbc_boundary_locus;

--LIBRARIES

CREATE OR REPLACE VIEW locus_core.libraries AS
SELECT distinct on (id_1) id_1 AS id,
ST_TRANSFORM(geom, 4326) AS wkb_geometry,
last_updated::TIMESTAMP AS date_added,
ARRAY['Community']::locus_core.search_category[] AS category,
                jsonb_build_object(
                'title', name,
                'description', jsonb_build_object(
                'name', name,
                'type', 'Library',
                'ur', url
                ),
                'table', 'id_1'||':'||libraries_locus.tableoid::regclass::text) AS attributes
FROM locus.libraries_locus;

--COMMUNITY HALLS

CREATE OR REPLACE VIEW locus_core.community_halls AS
SELECT distinct on (id_1)  id_1 AS id,
        ST_TRANSFORM(geom, 4326) AS wkb_geometry,
        last_updated::TIMESTAMP AS date_added,
        ARRAY['Community']::locus_core.search_category[] AS category,
        jsonb_build_object(
	'title', venue,
	'description', jsonb_build_object(
		'name', venue,
		'type', 'Community Hall',  
		'url', google_url,
		'url_description', 'Google Streetview',
		'address', address,
		'phone', phone),
	'table', 'id_1'||':'||community_halls_locus.tableoid::regclass::text) AS attributes
FROM locus.community_halls_locus;

--TOILETS

CREATE OR REPLACE VIEW locus_core.toilets
AS
SELECT DISTINCT ON (toilets_locus.id_1) toilets_locus.id_1 AS id,
st_transform(toilets_locus.geom, 4326) AS wkb_geometry,
toilets_locus.last_updated::timestamp without time zone AS date_added,
ARRAY['Community'::locus_core.search_category] AS category,
jsonb_build_object(
'title', toilets_locus.location,
'description',
jsonb_build_object(
'type', 'Toilet',
'name', toilets_locus.location,
'additional_information', (

 'Disabled Access: '::text ||
 	CASE
		WHEN toilets_locus.disabled_a::text = 'Y'::text THEN 'Yes'::text
        ELSE 'No'::text
    end || ' <br> Female Toilets: '::text ||
         	CASE
		WHEN toilets_locus.female_wc::text = 'N'::text THEN 'No'::text
        ELSE 'Yes'::text
    end || ' <br> Male Toilets: '::text ||
         	CASE
		WHEN toilets_locus.male_wc::text = 'N'::text THEN 'No'::text
        ELSE 'Yes'::text
    end || ' <br> Baby Changing: '::text ||
         	CASE
		WHEN toilets_locus.parent_bab::text = 'N'::text THEN 'No'::text
        ELSE 'Yes'::text
    end

  )
),
    'table', ('id_1'::text || ':'::text) || toilets_locus.tableoid::regclass::text) AS attributes
FROM locus.toilets_locus;


--PLAY AREAS

CREATE OR REPLACE VIEW locus_core.play_areas
AS
SELECT DISTINCT ON (play_areas_locus.id_1) play_areas_locus.id_1 AS id,
st_transform(play_areas_locus.geom, 4326) AS wkb_geometry,
play_areas_locus.last_updated::timestamp without time zone AS date_added,
ARRAY['Community'::locus_core.search_category] AS category,
jsonb_build_object(
'title', play_areas_locus.name,
'description',
jsonb_build_object(

'name', play_areas_locus.name,
'type', 'Play Area',
'additional_information', (
'Managed by '::text || play_areas_locus.managed_by::text || '. Opening Time - '::text || play_areas_locus.opening_times::text || '. Closing Time - '::text || play_areas_locus.closing_times::text)
),
'table', ('id_1'::text || ':'::text) || play_areas_locus.tableoid::regclass::text) AS attributes

--RECYCLING CENTRES

CREATE OR REPLACE VIEW locus_core.recycling_centres AS
SELECT distinct on (id_0)  id_0 AS id,
        ST_TRANSFORM(geom, 4326) AS wkb_geometry,
        last_updated::TIMESTAMP AS date_added,
        ARRAY['Waste and Recycling']::locus_core.search_category[] AS category,
        jsonb_build_object(
	'title', split_part(address,',',1),
	'description', jsonb_build_object(
	    'name', address,
		'type', 'Recycling Centre',
		'additional_information', 'Managed by' || collects::text),
	'table', 'id_0'||':'||recycling_centres_shbc_locus.tableoid::regclass::text) AS attributes
FROM locus.recycling_centres_shbc_locus;

--SCHOOLS

CREATE OR REPLACE VIEW locus_core.schools AS
SELECT distinct on (id_0)  id_0 AS id,
        ST_TRANSFORM(geom, 4326) AS wkb_geometry,
        now() AS date_added,
        ARRAY['Education']::locus_core.search_category[] AS category,
        jsonb_build_object(
	'title', "EstablishmentName",
	'description', jsonb_build_object(
		'ref', "URN",
		'type', 'School',
		'name', "EstablishmentName",
		'additional_information',"PhaseOfEducation (name)"),
	'table', 'id_0'||':'||shbc_all_open_schools_locus.tableoid::regclass::text) AS attributes
FROM locus.shbc_all_open_schools_locus;

--COUNCIL TAX BANDS

CREATE OR REPLACE VIEW locus_core.council_tax_bands AS
SELECT distinct on(id) id,
       ST_TRANSFORM(ST_GEOMFROMEWKT('SRID=27700;POINT('||map_x||' '||map_y||')'),4326) AS wkb_geometry,
       now() AS date_added,
       ARRAY['Council Tax']::locus_core.search_category[] AS category,
       jsonb_build_object(
         ------ ***************************** NOTE WELL THE 0 append on UPRN to conform to LLPG may not be right **********************
	      'ref', '0'::text || ctax_uprn::text,
	      'title', split_part(address,',',1),
	      'description', jsonb_build_object(
		        'name', address,
		        'ref', 'Council Tax Band '::text || ctax_adjusted_band::text,
		        'type', 'Council Tax Band'
        ),
	      'table', 'id'||':'||ctax_bands_current_locus.tableoid::regclass::text) AS attributes
 FROM locus.ctax_bands_current_locus;

--PLANNING APPLICATIONS

CREATE OR REPLACE VIEW locus_core.planning_applications AS
SELECT id::INTEGER ,
       ST_TRANSFORM(ST_GEOMFROMEWKT('SRID=27700;POINT('||map_x||' '||map_y||')'),4326) AS wkb_geometry,
       dateapval AS date_added,
       ARRAY['Planning']::locus_core.search_category[] AS category,
       jsonb_build_object(
	'ref', uprn,
	'title', refval::text,
	'description', jsonb_build_object(
		'name', address,
		'ref',  refval::text,
		'keyval', keyval,
		'type', 'Application',
		'address', address,
		'url_description', 'Application details',
		'url', 'https://publicaccess.surreyheath.gov.uk/online-applications/applicationDetails.do?keyVal='||keyval||'&activeTab=summary',
		'completed', CASE WHEN dateapval > now() - INTERVAL '7 days' THEN false ELSE true END,
		'additional_information', proposal::text),
	'table', 'id'||':'||locus.dc_apps_readonly.tableoid::regclass::text) AS attributes
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
			   'name', title,
			   'party', party,
			   'ward', ward,
			   'url', linkuri,
			   'url_description', 'Additional details',
			   'type', 'Councillor')
			   ) AS attributes
FROM locus.councillor_details_view COUN
INNER JOIN locus.shbc_ward_boundaries WARD
ON trim(ward) = ward_name;

-- PROW

CREATE OR REPLACE VIEW locus_core.prow AS
  SELECT DISTINCT ON (id) id,
    st_transform(geom, 4326) AS wkb_geometry,
    now() AS date_added,
    ARRAY['Rights of Way'::locus_core.search_category] AS category,
    jsonb_build_object(
    	'title', prowno,
    	'description', jsonb_build_object(
    		'name', prow_loc,
    		'type', 'Public Right Of Way',
    		'stat_text', stat_text,
    		'additional_information', prowstat),
    		'table', 'id'||':'||rights_of_way_readonly_locus.tableoid::regclass::text) AS attributes
   FROM locus.rights_of_way_readonly_locus;			   

--TPOs

CREATE OR REPLACE VIEW locus_core.tree_preservation_orders
AS
SELECT DISTINCT ON (tpo_polygons_locus.ogc_fid) tpo_polygons_locus.ogc_fid AS id,
st_transform(
CASE
    WHEN st_area(st_transform(tpo_polygons_locus.wkb_geometry, 4326)::geography) < 500::double precision THEN st_centroid(tpo_polygons_locus.wkb_geometry)
    ELSE tpo_polygons_locus.wkb_geometry
    END, 4326) AS wkb_geometry,
now() AS date_added,
ARRAY['Planning'::locus_core.search_category] AS category,
jsonb_build_object('title', tpo_polygons_locus.refval, 'description', jsonb_build_object('name', tpo_polygons_locus.address, 'ref', tpo_polygons_locus.refval, 'type', 'Tree Preservation Order', 'address', tpo_polygons_locus.address, 'additional_information', 'Order Type: '::text ||
CASE
    WHEN tpo_polygons_locus.tptreecat::text = 'G'::text THEN 'A Group TPO'::text
    WHEN tpo_polygons_locus.tptreecat::text = 'A'::text THEN 'An Area TPO'::text
    WHEN tpo_polygons_locus.tptreecat::text = 'W'::text THEN 'A Woodland TPO'::text
    WHEN tpo_polygons_locus.tptreecat::text = 'T'::text THEN 'An individual Tree ('||tpo_polygons_locus.treetype::text ||')'::text
    ELSE 'Unclassified'::text
    END
    ), 'table', ('ogc_fid'::text || ':'::text) || tpo_polygons_locus.tableoid::regclass::text) AS attributes
FROM locus.tpo_polygons_locus
WHERE tpo_polygons_locus.tptreecat IS NOT NULL AND tpo_polygons_locus.tptreecat::text <> ' '::text;

--CRIME

CREATE OR REPLACE VIEW locus_core.crime
AS
SELECT DISTINCT ON (id) id,
wkb_geometry,
date_added,
ARRAY['Crime'::locus_core.search_category] AS category,
jsonb_build_object('title', 'Crime', 'description', jsonb_build_object('type', 'Crime'), 'table', attributes) AS attributes
FROM locus_core.all_crime;

--REPORT IT

CREATE OR REPLACE VIEW locus_core.report_it AS
 SELECT DISTINCT ON (id) id,
    st_transform(geom, 4326) AS wkb_geometry,
    date::timestamp without time zone AS date_added,
    ARRAY['Reported'::locus_core.search_category] AS category,
    jsonb_build_object('title', type, 'description', jsonb_build_object('type', type, 'details', 'The Council has been made aware of something happening here', 'location', location), 'table', ('id'::text || ':'::text) || report_it.tableoid::regclass::text) AS attributes
   FROM locus.report_it;

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
USING GIN (jsonb_to_tsvector('Simple'::regconfig, attributes, '["string", "numeric"]'::jsonb));

CREATE INDEX llpg_geometry_gist
ON locus_core.address_search_view
USING GIST(wkb_geometry);


SELECT locus_core.views_union();
REFRESH MATERIALIZED VIEW CONCURRENTLY locus_core.global_search_view;
