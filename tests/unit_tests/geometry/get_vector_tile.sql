DO
$$
DECLARE
    ret_var JSONB;
    acl JSONB DEFAULT jsonb_build_object(
            '_userID', 'acl 3',
            '_groups' ,  jsonb_build_array('Admins')
        );
BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';
    DELETE FROM parameters WHERE parameter_name = 'census_area_vector_tiles';

    INSERT INTO parameters(parameter_name, parameter, usage, acl)
    SELECT 'census_area_vector_tiles',
           jsonb_build_object('table', 'locaria_tests.census_data_output_areas'),
           'VECTOR_TILES',
           '{
              "view": [
                "Admins"
              ],
              "delete": [
                "Admins"
              ],
              "update": [
                "Admins"
              ]
            }'::JSONB;

    SELECT locaria_core.locaria_gateway(jsonb_build_object('method',   'get_vector_tile',
                                                            'tileset',  'census_area_vector_tiles',
                                                            'x',        16062,
                                                            'y',        11056,
                                                            'z',        15),acl) INTO ret_var;

    RAISE NOTICE 'BYTEA %', ret_var;
    RAISE NOTICE 'DEBUG %', jsonb_build_object('vt',ret_var);

END;
$$ LANGUAGE PLPGSQL;