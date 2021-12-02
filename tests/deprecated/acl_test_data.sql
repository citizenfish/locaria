DO
$$
DECLARE
    category_var INTEGER;
BEGIN

    DELETE FROM locus_core.categories WHERE category = 'acl_test';
    INSERT INTO locus_core.categories(category) SELECT 'acl_test' RETURNING category_id INTO category_var;

    DROP TABLE IF EXISTS locus_core.test_acl;

    --Add data to base tables
    CREATE TABLE locus_core.test_acl(nid BIGSERIAL PRIMARY KEY)
    INHERITS(locaria_data.base_table);

    INSERT INTO locus_core.test_acl(attributes, wkb_geometry, category_id)
    VALUES(jsonb_build_object('title', 'acl one',   'description', jsonb_build_object('type','test', 'text','acl 1'), 'acl', jsonb_build_object('view', jsonb_build_array('1'))), ST_GEOMFROMEWKT('SRID=4326;Point (-3.51714069502677917 50.3977689822299908)'),  category_var),
          (jsonb_build_object('title', 'acl two',   'description', jsonb_build_object('type','test', 'text','acl 2'), 'acl', jsonb_build_object('view', jsonb_build_array('2'))), ST_GEOMFROMEWKT('SRID=4326;Point (-3.51667887966498194 50.37675638326822991)'), category_var),
          (jsonb_build_object('title', 'acl three', 'description', jsonb_build_object('type','test', 'text','acl 3'), 'acl', jsonb_build_object('view', jsonb_build_array('3'))), ST_GEOMFROMEWKT('SRID=4326;Point (-3.53722966326494737 50.37490912182104097)'), category_var),
          (jsonb_build_object('title', 'acl four',  'description', jsonb_build_object('type','test', 'text','acl 4'), 'acl', jsonb_build_object('view', jsonb_build_array('4'))), ST_GEOMFROMEWKT('SRID=4326;Point (-3.53861510935033818 50.39799988991089208)'), category_var),
          (jsonb_build_object('title', 'acl none',  'description', jsonb_build_object('type','test', 'text','acl none')),  ST_GEOMFROMEWKT('SRID=4326;Point (-3.53861510935033818 50.39799988991089208)'), category_var);

    REFRESH MATERIALIZED  VIEW CONCURRENTLY locus_core.global_Search_view;

    RAISE NOTICE 'ACL DATA ADDED';

END;
$$ LANGUAGE PLPGSQL;