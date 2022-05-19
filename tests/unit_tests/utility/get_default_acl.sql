DO
$$
DECLARE
    ret_var JSONB;
    newacl_var JSONB DEFAULT jsonb_build_object(
        'owner', 'Mr Foo',
        'view' ,  jsonb_build_array('viewGroup1', 'viewGroup2'),
        'update', jsonb_build_array('updateGroup1', 'updateGroup2'),
        'delete', jsonb_build_array('deleteGroup1', 'deleteGroup2')
        );
    category_name TEXT DEFAULT '__TEST_ACL__';
    group_name_var TEXT DEFAULT '__TEST_GROUP__';
    default_parameter_var JSONB;
BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';
    DELETE FROM categories WHERE category = category_name;
    DELETE FROM groups WHERE group_name = group_name_var;

    --Copy default parameter then delete, we reset at end of test or exception
    SELECT parameter
    INTO default_parameter_var
    FROM locaria_core.parameters
    WHERE parameter_name ='default_acl';

    IF default_parameter_var IS NOT NULL THEN
        DELETE FROM locaria_core.parameters WHERE parameter_name ='default_acl';
    END IF;

    --TEST 1 return a _newACL that has been sent
    SELECT locaria_core.get_default_acl(jsonb_build_object('_newACL',newacl_var)) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('get_default_acl TEST 1', ret_var , '{owner}', 'Mr Foo');

    --TEST 2 return default if no _newACL sent
    SELECT locaria_core.get_default_acl(jsonb_build_object()) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('get_default_acl TEST 2', ret_var , '{}', 'EMPTY');

    --TEST 3 add a category default and send
    INSERT INTO categories(category,attributes)
    SELECT category_name, jsonb_build_object('default_acl', newacl_var);
    SELECT locaria_core.get_default_acl(jsonb_build_object('category',category_name)) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('get_default_acl TEST 3', ret_var , '{owner}', 'Mr Foo');

    --TEST 4 add a group with default and send
    DELETE FROM categories WHERE category = category_name;
    INSERT INTO groups(group_name,attributes)
    SELECT group_name_var, jsonb_build_object('default_acl', newacl_var);
    SELECT locaria_core.get_default_acl(jsonb_build_object('_groups',jsonb_build_array(group_name_var))) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('get_default_acl TEST 4', ret_var , '{owner}', 'Mr Foo');

    --TEST 5 add a system default and send
    DELETE FROM groups WHERE group_name = group_name_var;
    INSERT INTO parameters(parameter_name,parameter)
    SELECT 'default_acl', newacl_var;
    SELECT locaria_core.get_default_acl(jsonb_build_object()) INTO ret_var;
    SELECT locaria_core.get_default_acl(jsonb_build_object('_groups',jsonb_build_array(group_name_var))) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('get_default_acl TEST 5', ret_var , '{owner}', 'Mr Foo');

    DELETE FROM locaria_core.parameters WHERE parameter_name ='default_acl';

    IF default_parameter_var IS NOT NULL THEN
        RAISE NOTICE 'RESET DEFAULT PARAMETER';
        INSERT INTO locaria_core.parameters(parameter_name,parameter)
        SELECT 'default_acl', default_parameter_var;
    END IF;

EXCEPTION WHEN OTHERS THEN

    IF default_parameter_var IS NOT NULL THEN
        RAISE NOTICE 'RESET DEFAULT PARAMETER';
        INSERT INTO locaria_core.parameters(parameter_name,parameter)
        SELECT 'default_acl', default_parameter_var;
    END IF;

    RAISE EXCEPTION '%', SQLERRM;
END;
$$ LANGUAGE PLPGSQL;