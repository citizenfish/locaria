--Sample SQL to show how we create views/load data into the system. These are based upon Surrey Heath configurations

CREATE OR REPLACE VIEW locus_core.car_parks
AS SELECT DISTINCT ON (shbc_carparks_locus.id_0) shbc_carparks_locus.id_0 AS id,
st_transform(shbc_carparks_locus.geom, 4326) AS wkb_geometry,
now() AS date_added,
ARRAY['Highways'::locus_core.search_category] AS category,
jsonb_build_object(

'title', shbc_carparks_locus.name,
'description', jsonb_build_object(
'name', shbc_carparks_locus.name,
'type', 'Car Park',
'additional_information', shbc_carparks_locus.name

),
'table', ('id_0'::text || ':'::text) || shbc_carparks_locus.tableoid::regclass::text) AS attributes
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
	'table', 'id'||':'||shbc_ward_boundaries_locus.tableoid::regclass::text) AS attributes
FROM locus.shbc_ward_boundaries_locus;

--PARISH BOUNDARIES

CREATE OR REPLACE VIEW locus_core.parish_boundaries AS
SELECT distinct on (id_0)  id_0 AS id,
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
	'table', 'id_1'||':'||shbc_polling_stations_2019_locus.tableoid::regclass::text) AS attributes
FROM locus.shbc_polling_stations_2019_locus;

--POLLING DISTRICTS

CREATE OR REPLACE VIEW locus_core.polling_districts
AS SELECT DISTINCT ON (id) id,
st_transform(geom, 4326) AS wkb_geometry,
now() AS date_added,
ARRAY['Democracy'::locus_core.search_category] AS category,
jsonb_build_object('title', address,
                   'description', jsonb_build_object('name', address,
                                                     'type', 'Polling Districts'),
                   'table', ('id'::text || ':'::text) || shbc_polling_district_2019_locus.tableoid::regclass::text) AS attributes
FROM locus.shbc_polling_district_2019_locus;


--LISTED BUILDINGS

CREATE OR REPLACE VIEW locus_core.listed_buildings AS
SELECT distinct on (id_0) id_0 AS id,
st_transform(
CASE
    WHEN st_area(st_transform(geom, 4326)::geography) < 500::double precision THEN st_centroid(geom)
    ELSE geom
    END, 4326) AS wkb_geometry,
last_updated::TIMESTAMP AS date_added,
ARRAY['Planning']::locus_core.search_category[] AS category,
jsonb_build_object(
'title', name || ' ' ||location,
'description', jsonb_build_object(
'name', name,
'ref', 'Grade: ' || grade::text,
'type', 'Listed Building',
'address', location,
'url', 'https://historicengland.org.uk/listing/the-list/list-entry/' || list_entry::text,
'url_description', 'Visit Historic England for more information',
'additional_information', 'Notes on this building - ' || surveydate::text),
'table', 'id_0'||':'||shbc_listed_buildings_locus.tableoid::regclass::text) AS attributes
FROM locus.shbc_listed_buildings_locus
WHERE list_type = 'statutory';

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
	'table', 'id'||':'||shbc_conservation_areas_locus.tableoid::regclass::text) AS attributes
FROM locus.shbc_conservation_areas_locus;

--BOUNDARY

CREATE OR REPLACE VIEW locus_core.boundary AS
SELECT distinct on (id_0)  id_0 AS id,
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
	'table', 'id_0'||':'||shbc_boundary_locus.tableoid::regclass::text) AS attributes
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
                'table', 'id_1'||':'||shbc_libraries_locus.tableoid::regclass::text) AS attributes
FROM locus.shbc_libraries_locus;

--COMMUNITY HALLS

CREATE OR REPLACE VIEW locus_core.community_halls AS
SELECT distinct on (id_0)  id_0 AS id,
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
	'table', 'id_0'||':'||shbc_community_halls_locus.tableoid::regclass::text) AS attributes
FROM locus.shbc_community_halls_locus;

--TOILETS

CREATE OR REPLACE VIEW locus_core.toilets
AS
SELECT DISTINCT ON (id_1) id_1 AS id,
st_transform(geom, 4326) AS wkb_geometry,
last_updated::timestamp without time zone AS date_added,
ARRAY['Community'::locus_core.search_category] AS category,
jsonb_build_object(
'title', location,
'description',
jsonb_build_object(
'type', 'Toilet',
'name', location,
'additional_information', (

 'Disabled Access: '::text ||
 	CASE
		WHEN disabled_a::text = 'Y'::text THEN 'Yes'::text
        ELSE 'No'::text
    end || ' <br> Female Toilets: '::text ||
         	CASE
		WHEN female_wc::text = 'N'::text THEN 'No'::text
        ELSE 'Yes'::text
    end || ' <br> Male Toilets: '::text ||
         	CASE
		WHEN male_wc::text = 'N'::text THEN 'No'::text
        ELSE 'Yes'::text
    end || ' <br> Baby Changing: '::text ||
         	CASE
		WHEN parent_bab::text = 'N'::text THEN 'No'::text
        ELSE 'Yes'::text
    end

  )
),
    'table', ('id_1'::text || ':'::text) || shbc_toilets_locus.tableoid::regclass::text) AS attributes
FROM locus.shbc_toilets_locus;


--PLAY AREAS

CREATE OR REPLACE VIEW locus_core.play_areas
AS
SELECT DISTINCT ON (id_1) id_1 AS id,
st_transform(geom, 4326) AS wkb_geometry,
last_updated::timestamp without time zone AS date_added,
ARRAY['Community'::locus_core.search_category] AS category,
jsonb_build_object(
'title', name,
'description',
jsonb_build_object(

'name', name,
'type', 'Play Area',
'additional_information', (
'Managed by '::text || managed_by::text || '. Opening Time - '::text || opening_times::text || '. Closing Time - '::text || closing_times::text)
),
'table', ('id_1'::text || ':'::text) || shbc_play_areas_locus.tableoid::regclass::text) AS attributes
FROM locus.shbc_play_areas_locus

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
	'table', 'id_0'||':'||shbc_recycling_centres_locus.tableoid::regclass::text) AS attributes
FROM locus.shbc_recycling_centres_locus;

--SCHOOLS

CREATE OR REPLACE VIEW locus_core.schools AS
SELECT distinct on (id_0) id_0 AS id,
ST_TRANSFORM(geom, 4326) AS wkb_geometry,
now() AS date_added,
ARRAY['Education']::locus_core.search_category[] AS category,
jsonb_build_object(
'title', establishmentname,
'description', jsonb_build_object(
'ref', urn,
'type', 'School',
'name', establishmentname,
'additional_information',phaseofeducation__name_ || ' ' || typeofestablishment__code_),
'table', 'id_0'||':'||shbc_schools_locus.tableoid::regclass::text) AS attributes
FROM locus.shbc_schools_locus;

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
	      'table', 'id'||':'||shbc_ctax_bands_locus.tableoid::regclass::text) AS attributes
 FROM locus.shbc_ctax_bands_locus;

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
	'table', 'id'||':'||shbc_dc_apps_30days_locus.tableoid::regclass::text) AS attributes
FROM locus.shbc_dc_apps_30days_locus;

--Councillor details -> filled by scraper

CREATE TABLE IF NOT EXISTS locus.councillor_details_view
(
    id bigint,
    title text COLLATE pg_catalog."default",
    party text COLLATE pg_catalog."default",
    ward text COLLATE pg_catalog."default",
    linkuri text COLLATE pg_catalog."default",
    json_data jsonb
);

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
			   'additional_information', COALESCE(profile, ''),
			   'type', 'Councillor')
			   ) AS attributes
FROM locus.councillor_details_view COUN
INNER JOIN locus.shbc_ward_boundaries_locus WARD
ON trim(ward) = ward_name;

-- PROW

CREATE OR REPLACE VIEW locus_core.prow
AS SELECT DISTINCT ON (id) id,
st_transform(geom, 4326) AS wkb_geometry,
now() AS date_added,
ARRAY['Row'::locus_core.search_category] AS category,
jsonb_build_object(

'title', prowno,
'description', jsonb_build_object(
'name', prow_loc,
'type', 'Public Right Of Way',
'stat_text', stat_text,
'additional_information', prowstat

),
'table', ('id'::text || ':'::text) || shbc_rights_of_way_readonly_locus.tableoid::regclass::text) AS attributes
FROM locus.shbc_rights_of_way_readonly_locus;



--TPOs

CREATE OR REPLACE VIEW locus_core.tree_preservation_orders
AS
SELECT DISTINCT ON (ogc_fid) ogc_fid AS id,
st_transform(
CASE
    WHEN st_area(st_transform(wkb_geometry, 4326)::geography) < 500::double precision THEN st_centroid(wkb_geometry)
    ELSE wkb_geometry
    END, 4326) AS wkb_geometry,
now() AS date_added,
ARRAY['Planning'::locus_core.search_category] AS category,
jsonb_build_object('title', refval, 'description', jsonb_build_object('name', address, 'ref', refval, 'type', 'Tree Preservation Order', 'address', address, 'additional_information', 'Order Type: '::text ||
CASE
    WHEN tptreecat::text = 'G'::text THEN 'A Group TPO'::text
    WHEN tptreecat::text = 'A'::text THEN 'An Area TPO'::text
    WHEN tptreecat::text = 'W'::text THEN 'A Woodland TPO'::text
    WHEN tptreecat::text = 'T'::text THEN 'An individual Tree ('||treetype::text ||')'::text
    ELSE 'Unclassified'::text
    END
    ), 'table', ('ogc_fid'::text || ':'::text) || shbc_tpo_locus.tableoid::regclass::text) AS attributes
FROM locus.shbc_tpo_locus
WHERE tptreecat IS NOT NULL AND tptreecat::text <> ' '::text;

--CRIME

CREATE OR REPLACE VIEW locus_core.crime
AS
SELECT DISTINCT ON (id) id,
wkb_geometry,
date_added,
ARRAY['Crime'::locus_core.search_category] AS category,
jsonb_build_object('title', 'Crime', 'description', jsonb_build_object('type', 'Crime'), 'table', ('id'::text || ':'::text) || all_crime.tableoid::regclass::text) AS attributes
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
			   
			   
DROP MATERIALIZED VIEW IF EXISTS locus_core.address_search_view;
CREATE MATERIALIZED VIEW locus_core.address_search_view
AS
SELECT uprn::bigint AS id,
st_transform(geom, 4326) AS wkb_geometry,
jsonb_build_object(
'ofid', uprn,
'address', address,
'organisation', organisation,
'title', concat_ws(' '::text, sao_start_number, sao_start_suffix, sao_end_number, sao_end_suffix, sao_text, pao_start_number, pao_start_suffix, pao_end_number, pao_end_suffix, pao_text, street_description),
'usrn', usrn,
'uprn', uprn_c,
'locality', locality,
'sao_text', sao_text,
'sao_start_number', sao_start_number,
'sao_start_suffix', sao_start_suffix,
'sao_end_number', sao_end_number,
'sao_end_suffix', sao_end_suffix,
'pao_start_number', pao_start_number,
'pao_start_suffix', pao_start_suffix,
'pao_end_number', pao_end_number,
'pao_end_suffix', pao_end_suffix,
'pao_text', pao_text,
'street_description', street_description,
'postal_town', post_town,
'postcode', postcode,
'x_coord', ROUND(e),
'y_coord', ROUND(n),
'lat', lat,
'lon', lon,
'la_code', la_code,
'ward_code', ward_code,
'parish_code', parish_code) AS attributes
FROM locus.shbc_llpg_locus
WHERE lpi_status::text = 'Approved Preferred'::text AND postal_address::text = 'Postal Address'::text;

CREATE INDEX llpg_jsonb_ts_vector
ON locus_core.address_search_view
USING GIN (jsonb_to_tsvector('Simple'::regconfig, attributes, '["string", "numeric"]'::jsonb));

CREATE INDEX llpg_geometry_gist
ON locus_core.address_search_view
USING GIST(wkb_geometry);


SELECT locus_core.views_union();
REFRESH MATERIALIZED VIEW CONCURRENTLY locus_core.global_search_view;
