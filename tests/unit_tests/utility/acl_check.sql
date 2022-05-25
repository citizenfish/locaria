DO
$$
DECLARE
    mask JSONB DEFAULT jsonb_build_object(
        'owner', 'Mr Foo',
        'update', jsonb_build_array('administrator', 'moderator', 'updateGroup1'),
        'delete', jsonb_build_array('deleteGroup1', 'deleteGroup2'),
        'moderate', jsonb_build_array('moderator')
        );

    mask_default JSONB DEFAULT jsonb_build_object();

    acl JSONB DEFAULT jsonb_build_object();
    ret_var JSONB;
BEGIN

    --TEST 1 empty compare
    SELECT locaria_core.acl_check(acl,mask_default) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 1 owner', ret_var , '{owner}', 'false');
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 1 view', ret_var , '{view}', 'true');
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 1 delete', ret_var , '{delete}', 'false');
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 1 update', ret_var , '{update}', 'false');
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 1 moderate', ret_var , '{moderate}', 'false');

    --TEST 2 add owner
    acl = acl || jsonb_build_object('_userID', 'Mr Foo');
    SELECT locaria_core.acl_check(acl,mask) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 2 owner', ret_var , '{owner}', 'true');
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 2 view', ret_var , '{view}', 'true');
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 2 delete', ret_var , '{delete}', 'true');
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 2 update', ret_var , '{update}', 'true');
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 2 moderate', ret_var , '{moderate}', 'false');

    --Test 3 remove owner add viewgroup

    acl =acl - '_userID' || jsonb_build_object('_groups', jsonb_build_array('viewGroup1'));
    SELECT locaria_core.acl_check(acl,mask) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 3 owner', ret_var , '{owner}', 'false');
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 3 view', ret_var , '{view}', 'true');
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 3 delete', ret_var , '{delete}', 'false');
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 3 update', ret_var , '{update}', 'false');
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 3 moderate', ret_var , '{moderate}', 'false');

    --Test 4 add update
    acl = acl || jsonb_build_object('_groups', jsonb_build_array('viewGroup1', 'updateGroup1'));
    SELECT locaria_core.acl_check(acl,mask) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 4 owner', ret_var , '{owner}', 'false');
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 4 view', ret_var , '{view}', 'true');
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 4 delete', ret_var , '{delete}', 'false');
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 4 update', ret_var , '{update}', 'true');
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 4 moderate', ret_var , '{moderate}', 'false');

    --Test 5 add delete
    acl = acl || jsonb_build_object('_groups', jsonb_build_array('viewGroup1', 'updateGroup1', 'deleteGroup2'));
    SELECT locaria_core.acl_check(acl,mask) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 5 owner', ret_var , '{owner}', 'false');
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 5 view', ret_var , '{view}', 'true');
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 5 delete', ret_var , '{delete}', 'true');
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 5 update', ret_var , '{update}', 'true');
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 5 moderate', ret_var , '{moderate}', 'false');

    --Test 6 add moderate
    acl = acl || jsonb_build_object('_groups', jsonb_build_array('moderator'));
    SELECT locaria_core.acl_check(acl,mask) INTO ret_var;
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 6 owner', ret_var , '{owner}', 'false');
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 6 view', ret_var , '{view}', 'true');
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 6 delete', ret_var , '{delete}', 'false');
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 6 update', ret_var , '{update}', 'true');
    RAISE NOTICE '%', locaria_tests.test_result_processor('acl_check TEST 6 moderate', ret_var , '{moderate}', 'true');

END;
$$