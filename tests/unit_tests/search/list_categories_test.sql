DO
$$
    DECLARE
        ret_var JSONB;
        parameters JSONB DEFAULT jsonb_build_object('method',  'list_categories');
    BEGIN

        SET SEARCH_PATH = 'locaria_core', 'public';

        SELECT locaria_gateway(parameters) INTO ret_var;

        --TODO better array tests
        RAISE NOTICE '%', ret_var->'categories';

        parameters = parameters || jsonb_build_object('attributes', 'true');
        SELECT locaria_gateway(parameters) INTO ret_var;
        RAISE NOTICE '%', ret_var->'categories';

        parameters = parameters || jsonb_build_object('category', ret_var->'categories'->0->>'key');
        SELECT locaria_gateway(parameters) INTO ret_var;
        RAISE NOTICE '%', ret_var->'categories';

    END;
$$ LANGUAGE PLPGSQL;