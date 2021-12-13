DO
$$
    DECLARE
        ret_var JSONB;
        parameters JSONB DEFAULT jsonb_build_object('method', 'get_item');
        fid_var TEXT;
    BEGIN

        SET SEARCH_PATH = 'locaria_data','locaria_core', 'public';

        parameters = parameters || jsonb_build_object('fid', (SELECT fid FROM global_search_view WHERE edit AND moderated_update AND attributes#>>'{description,title}' = 'find me two'));

        --Update base data but not the global search view
        UPDATE locaria_data.locaria_test_data
        SET attributes = attributes -'acl' || jsonb_build_object('tags', jsonb_build_array('test'));

        --Simple get_item call
        SELECT locaria_gateway(parameters) INTO ret_var;

        IF (ret_var->'features'->0) IS NULL OR (ret_var->'features'->0->'properties'->'tags'->0) IS NOT NULL THEN
            IF (ret_var->>'logid') IS NOT NULL THEN
                RAISE EXCEPTION '[get_item_test] %', (SELECT log_message FROM logs WHERE id=(ret_var->>'logid')::BIGINT);
            END IF;

            RAISE EXCEPTION '[get_item_test] TEST 1 expecting <NULL> got %',ret_var;
        END IF;

        RAISE NOTICE '[get_item_test] TEST 1 PASSED expecting <NULL> got %',ret_var->'features'->0->'properties'->'tags'->0;

        --Get live view, tags should be present

        parameters = parameters || jsonb_build_object('live', true);

        SELECT locaria_gateway(parameters) INTO ret_var;

        IF (ret_var->'features'->0) IS NULL OR (ret_var->'features'->0->'properties'->'tags'->>0) != 'test' THEN
            IF (ret_var->>'logid') IS NOT NULL THEN
                RAISE EXCEPTION '[get_item_test] %', (SELECT log_message FROM logs WHERE id=(ret_var->>'logid')::BIGINT);
            END IF;

            RAISE EXCEPTION '[get_item_test] TEST 2 expecting test got %',ret_var;
        END IF;

        RAISE NOTICE '[get_item_test] TEST 2 PASSED expecting test got %',ret_var->'features'->0->'properties'->'tags'->0;

        --Add an acl to item and we should now not get it

        UPDATE locaria_data.locaria_test_data
        SET attributes = attributes || jsonb_build_object('acl', jsonb_build_object('view', jsonb_build_array('test')));

        SELECT locaria_gateway(parameters) INTO ret_var;

        IF (ret_var->'features'->0) IS NOT NULL THEN
            IF (ret_var->>'logid') IS NOT NULL THEN
                RAISE EXCEPTION '[get_item_test] %', (SELECT log_message FROM logs WHERE id=(ret_var->>'logid')::BIGINT);
            END IF;

            RAISE EXCEPTION '[get_item_test] TEST 3 expecting <NULL> got %',ret_var->'features'->0;
        END IF;

        RAISE NOTICE '[get_item_test] TEST 3 PASSED expecting <NULL> got %',ret_var->'features'->0;

        --Set _group and we should get it now

        parameters = parameters || jsonb_build_object('_group', jsonb_build_array('test'));

        SELECT locaria_gateway(parameters) INTO ret_var;

        IF (ret_var->'features'->0) IS  NULL THEN
            IF (ret_var->>'logid') IS NOT NULL THEN
                RAISE EXCEPTION '[get_item_test] %', (SELECT log_message FROM logs WHERE id=(ret_var->>'logid')::BIGINT);
            END IF;

            RAISE EXCEPTION '[get_item_test] TEST 4 expecting test got %',ret_var;
        END IF;

        RAISE NOTICE '[get_item_test] TEST 4 PASSED expecting test got %',ret_var->'features'->0->'properties'->'tags'->0;

        --Add a moderation item and check it comes down

        DELETE FROM moderation_queue;

        INSERT INTO moderation_queue(fid, attributes,status)
        SELECT parameters->>'fid',
               jsonb_build_object('moderate', 'test'),
               'RECEIVED';

        SELECT locaria_gateway(parameters) INTO ret_var;

        IF (ret_var->'features'->0->'properties'->'_moderations') IS  NULL THEN
            IF (ret_var->>'logid') IS NOT NULL THEN
                RAISE EXCEPTION '[get_item_test] %', (SELECT log_message FROM logs WHERE id=(ret_var->>'logid')::BIGINT);
            END IF;

            RAISE EXCEPTION '[get_item_test] TEST 5 expecting [_moderations] got %',ret_var;
        END IF;

        RAISE NOTICE '[get_item_test] TEST 5 PASSED expecting [_moderations] got %',ret_var->'features'->0->'properties'->'_moderations';

        --RESET TEST DATA

        UPDATE locaria_data.locaria_test_data
        SET attributes = attributes -'acl' -'tags';
        PERFORM locaria_internal_gateway(jsonb_build_object('method', 'refresh_search_view'));

    END;
$$ LANGUAGE PLPGSQL;