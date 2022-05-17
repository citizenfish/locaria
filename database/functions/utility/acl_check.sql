CREATE OR REPLACE FUNCTION locaria_core.acl_check(acl JSONB, mask JSONB) RETURNS JSONB AS
$$
BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';

    acl = COALESCE(acl, jsonb_build_object());
    mask = COALESCE(mask, get_default_acl());

    --acl is the users current acl passed in via api
    --mask is what we are comparing it against

    RETURN jsonb_build_object(
        'owner',    CASE WHEN acl->>'_userID' = mask->>'owner' THEN TRUE ELSE FALSE END,
        'view',     CASE WHEN mask->'view' IS NULL THEN TRUE
                         WHEN mask->'view' ?| json2text(acl->'_groups') THEN TRUE
                         WHEN acl->>'_userID' = mask->>'owner' THEN TRUE
                         --moderators need to see
                         WHEN mask->'moderate' ?| json2text(acl->'_groups') THEN TRUE
                         ELSE FALSE END,
        'update',   CASE WHEN mask->'update' ?| json2text(acl->'_groups') THEN TRUE
                         WHEN acl->>'_userID' = mask->>'owner' THEN TRUE
                         ELSE FALSE END,
        'delete',   CASE WHEN mask->'delete' ?| json2text(acl->'_groups') THEN TRUE
                         WHEN acl->>'_userID' = mask->>'owner' THEN TRUE
                         ELSE FALSE END,
        --Cannot moderate your own posts unless you are a moderator
        'moderate', CASE WHEN mask->'moderate' ?| json2text(acl->'_groups') THEN TRUE
                         ELSE FALSE END
        );
END;
$$ LANGUAGE PLPGSQL;