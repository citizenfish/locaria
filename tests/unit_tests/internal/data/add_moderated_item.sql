DO
$$
DECLARE
    ret_var JSONB;
    params JSONB DEFAULT jsonb_build_object(
            'method', 'add_item',
            'table', 'businesses',
            'category', 'BUSINESS_TEST',
            'geometry', 'SRID=4326;POINT(-1.1 53.1)',
            'attributes', jsonb_build_object('data',        jsonb_build_object('foo', 'baa'),
                                             'description', jsonb_build_object('title','title','text', RANDOM()::TEXT),
                                             '_test',       'true'
                                            ));
    acl JSONB DEFAULT jsonb_build_object('_groups', jsonb_build_array('Registered'), '_userID', '124999');
    new_acl_var JSONB DEFAULT jsonb_build_object('_newACL', jsonb_build_object('owner', 'foo'));

    BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';

    CREATE TABLE IF NOT EXISTS locaria_data.businesses() INHERITS (locaria_data.base_table);

    DELETE FROM categories WHERE category = 'BUSINESS_TEST';
    DELETE FROM locaria_data.businesses WHERE attributes @> jsonb_build_object('_test', 'true');

    INSERT INTO categories(category,attributes)
    SELECT 'BUSINESS_TEST', jsonb_build_object('moderated_update', true);

    SELECT locaria_gateway(params, new_acl_var) INTO ret_var;

    RAISE NOTICE '%',ret_var;




END;
$$ LANGUAGE PLPGSQL;