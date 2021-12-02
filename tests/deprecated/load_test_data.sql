DO
$$
DECLARE
    ret_var JSONB;
BEGIN

    DROP TABLE IF EXISTS locus_core.test_general;

    --Add data to base tables
    CREATE TABLE locus_core.test_general(nid BIGINT PRIMARY KEY)
    INHERITS(locaria_data.base_table);

    INSERT INTO locus_core.test_general(nid,attributes, wkb_geometry, category)
    VALUES(1, jsonb_build_object('title', 'find me one',   'description', jsonb_build_object('type','test', 'text','general description 1')), ST_GEOMFROMEWKT('SRID=4326;Point (-3.51714069502677917 50.3977689822299908)'),  ARRAY['General']::locus_core.search_category[]),
          (2, jsonb_build_object('title', 'find me two',   'description', jsonb_build_object('type','test', 'text','general description 2')), ST_GEOMFROMEWKT('SRID=4326;Point (-3.51667887966498194 50.37675638326822991)'), ARRAY['General']::locus_core.search_category[]),
          (3, jsonb_build_object('title', 'find me three', 'description', jsonb_build_object('type','test', 'text','general description 3')), ST_GEOMFROMEWKT('SRID=4326;Point (-3.53722966326494737 50.37490912182104097)'), ARRAY['General']::locus_core.search_category[]),
          (4, jsonb_build_object('title', 'find me four',  'description', jsonb_build_object('type','test', 'text','general description 4')), ST_GEOMFROMEWKT('SRID=4326;Point (-3.53861510935033818 50.39799988991089208)'), ARRAY['General']::locus_core.search_category[]);


    DROP TABLE IF EXISTS locus_core.test_events;

    CREATE TABLE locus_core.test_events(nid BIGINT PRIMARY KEY)
    INHERITS(locaria_data.base_table);

    INSERT INTO locus_core.test_events(nid,attributes, wkb_geometry, category)
    VALUES(1, jsonb_build_object('title', 'event one',   'description', jsonb_build_object('type','test', 'text','event description 1')), ST_GEOMFROMEWKT('SRID=4326;Point (-3.52714069502677917 50.4977689822299908)'),   ARRAY['Events']::locus_core.search_category[]),
          (2, jsonb_build_object('title', 'event two',   'description', jsonb_build_object('type','test', 'text','event description 2')), ST_GEOMFROMEWKT('SRID=4326;Point (-3.52667887966498194 50.47675638326822991)'),  ARRAY['Events']::locus_core.search_category[]),
          (3, jsonb_build_object('title', 'event three', 'description', jsonb_build_object('type','test', 'text','event description 3')), ST_GEOMFROMEWKT('SRID=4326;Point (-3.52722966326494737 50.47490912182104097)'),  ARRAY['Events']::locus_core.search_category[]),
          (4, jsonb_build_object('title', 'event four',  'description', jsonb_build_object('type','test', 'text','event description 4')), ST_GEOMFROMEWKT('SRID=4326;Point (-3.52861510935033818 50.49799988991089208)'),  ARRAY['Events']::locus_core.search_category[]);

    DROP TABLE IF EXISTS locus_core.test_planning;

    CREATE TABLE locus_core.test_planning(nid BIGINT PRIMARY KEY)
    INHERITS(locaria_data.base_table);

    INSERT INTO locus_core.test_planning(nid,attributes, wkb_geometry, category)
    VALUES(1, jsonb_build_object('title', 'planning one',   'description', jsonb_build_object('type','test', 'text','plan description 1')), ST_GEOMFROMEWKT('SRID=4326;Point (-3.54714069502677917 50.5977689822299908)'),  ARRAY['Planning']::locus_core.search_category[]),
          (2, jsonb_build_object('title', 'planning two',   'description',  jsonb_build_object('type','test', 'text','plan description 2')), ST_GEOMFROMEWKT('SRID=4326;Point (-3.54667887966498194 50.57675638326822991)'), ARRAY['Planning']::locus_core.search_category[]),
          (3, jsonb_build_object('title', 'planning three', 'description',  jsonb_build_object('type','test', 'text','plan description 3')), ST_GEOMFROMEWKT('SRID=4326;Point (-3.54722966326494737 50.57490912182104097)'), ARRAY['Planning']::locus_core.search_category[]),
          (4, jsonb_build_object('title', 'planning four',  'description',  jsonb_build_object('type','test', 'text','plan description 4')), ST_GEOMFROMEWKT('SRID=4326;Point (-3.54861510935033818 50.59799988991089208)'), ARRAY['Planning']::locus_core.search_category[]);

    --Create some views

    DROP TABLE IF EXISTS locus_core.test_democracy CASCADE;

    CREATE TABLE locus_core.test_democracy(nid BIGINT PRIMARY KEY, attributes JSONB, wkb_geometry GEOMETRY, category locus_core.search_category[]);

    INSERT INTO locus_core.test_democracy(nid,attributes, wkb_geometry, category)
    VALUES(1, jsonb_build_object('title', 'democracy one',   'description',  jsonb_build_object('type','test', 'text','democracy description 1')), ST_GEOMFROMEWKT('SRID=4326;Point (-3.59714069502677917 50.2977689822299908)'),  ARRAY['Democracy']::locus_core.search_category[]),
          (2, jsonb_build_object('title', 'democracy two',   'description',  jsonb_build_object('type','test', 'text','democracy description 1')), ST_GEOMFROMEWKT('SRID=4326;Point (-3.59667887966498194 50.27675638326822991)'), ARRAY['Democracy']::locus_core.search_category[]),
          (3, jsonb_build_object('title', 'democracy three', 'description',  jsonb_build_object('type','test', 'text','democracy description 1')), ST_GEOMFROMEWKT('SRID=4326;Point (-3.59722966326494737 50.27490912182104097)'),  ARRAY['Democracy']::locus_core.search_category[]),
          (4, jsonb_build_object('title', 'democracy four',  'description',  jsonb_build_object('type','test', 'text','democracy description 1')), ST_GEOMFROMEWKT('SRID=4326;Point (-3.59861510935033818 50.29799988991089208)'), ARRAY['Democracy']::locus_core.search_category[]);


    CREATE VIEW locus_core.test_democracy_view AS
    SELECT
            nid AS id,
            wkb_geometry,
            now() AS date_added,
            category,
            attributes || jsonb_build_object('table', tableoid::regclass::text) AS attributes
    FROM locus_core.test_democracy;

    DROP TABLE IF EXISTS locus_core.test_education CASCADE;

    CREATE TABLE locus_core.test_education(nid BIGINT PRIMARY KEY, attributes JSONB, wkb_geometry GEOMETRY, category locus_core.search_category[]);

    INSERT INTO locus_core.test_education(nid,attributes, wkb_geometry, category)
    VALUES(1, jsonb_build_object('title', 'education one',   'description', jsonb_build_object('type','test', 'text','education description 1')), ST_GEOMFROMEWKT('SRID=4326;Point (-3.59714069502677917 50.2977689822299908)'),   ARRAY['Education']::locus_core.search_category[]),
          (2, jsonb_build_object('title', 'education two',   'description', jsonb_build_object('type','test', 'text','education description 1')), ST_GEOMFROMEWKT('SRID=4326;Point (-3.59667887966498194 50.27675638326822991)'),  ARRAY['Education']::locus_core.search_category[]),
          (3, jsonb_build_object('title', 'education three', 'description', jsonb_build_object('type','test', 'text','education description 1')), ST_GEOMFROMEWKT('SRID=4326;Point (-3.59722966326494737 50.27490912182104097)'),  ARRAY['Education']::locus_core.search_category[]),
          (4, jsonb_build_object('title', 'education four',  'description', jsonb_build_object('type','test', 'text','education description 1')), ST_GEOMFROMEWKT('SRID=4326;Point (-3.59861510935033818 50.29799988991089208)'),  ARRAY['Education']::locus_core.search_category[]);


    CREATE VIEW locus_core.test_education_view AS
    SELECT
            nid AS id,
            wkb_geometry,
            now() AS date_added,
            category,
            attributes || jsonb_build_object('table', tableoid::regclass::text) AS attributes
    FROM locus_core.test_education;

    --Address search
    DROP TABLE IF EXISTS locus_core.test_address CASCADE;
    CREATE TABLE locus_core.test_address(id BIGSERIAL PRIMARY KEY, attributes JSONB, wkb_geometry GEOMETRY);
    INSERT INTO locus_core.test_address(attributes, wkb_geometry)
    VALUES(jsonb_build_object('address', '1 TEST AVENUE, TEST PLACE, TEST TOWN, PP1 1PP'), ST_GEOMFROMEWKT('SRID=4326;Point (-3.59 50.27)'));

    DROP MATERIALIZED VIEW IF EXISTS locus_core.address_search_view;
    CREATE MATERIALIZED VIEW locus_core.address_search_view
    AS SELECT * FROM locus_core.test_address;

    CREATE INDEX llpg_jsonb_ts_vector
    ON locus_core.address_search_view
    USING GIN (jsonb_to_tsvector('Simple'::regconfig, attributes, '["string", "numeric"]'::jsonb));

    CREATE INDEX llpg_geometry_gist
    ON locus_core.address_search_view
    USING GIST(wkb_geometry);

    --Now refresh the core views

    SELECT locus_core.create_materialised_view() INTO ret_var;

    RAISE NOTICE '%', ret_var;

END;
$$ LANGUAGE PLPGSQL