--Retrieve an item's detail from the search view
CREATE OR REPLACE FUNCTION locaria_core.get_item(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
    moderations_var JSONB;

BEGIN
    SET SEARCH_PATH = 'locaria_core',  'locaria_data','public';

        --If we are in live mode append any moderations resident in the moderations queue
        IF COALESCE(parameters->>'live','false')::BOOLEAN
            --this acl_check makes sure that the user is in a group that has moderator status
            AND (acl_check(parameters->'acl',NULL)->>'moderate')::BOOLEAN
            THEN
            SELECT jsonb_agg(J)
            INTO moderations_var
            FROM(
                    SELECT row_to_json(MQ.*) AS J FROM locaria_core.moderation_queue MQ
                    --note get_item prefix to prevent ambiguity
                    WHERE fid = get_item.parameters->>'fid'
                    AND status = COALESCE(get_item.parameters->>'moderation_status', 'RECEIVED')
                    ORDER BY id ASC
                ) S;

        END IF;

       EXECUTE format(
       $SQL$
           SELECT  jsonb_build_object(
                                    'type', 'FeatureCollection',
                                    'features', json_build_array(
                                        json_build_object(
                                                'type', 'Feature',
                                                'properties', attributes ||
                                                              jsonb_build_object('category',     attributes->'category'->0,
                                                                                 'fid',          $1,
                                                                                 '_live',        $2,
                                                                                 '_moderations', $3
                                                                                 ),
                                                'geometry',   ST_ASGEOJSON(ST_TRANSFORM(wkb_geometry,4326))::JSON
                                        )
                                    )
            )
              FROM %1$s
              WHERE (($1 != '' AND fid = $1) OR ($1 = '' AND attributes @> jsonb_build_object('data', jsonb_build_object('_identifier', $5))))
              AND (acl_check($4, attributes->'acl')->>'view')::BOOLEAN
        $SQL$,
        CASE WHEN COALESCE(parameters->>'live','false')::BOOLEAN THEN 'global_search_view_live' ELSE 'global_search_view' END
        )
        INTO ret_var
        USING COALESCE(parameters->>'fid', ''),
              COALESCE(parameters->>'live','false')::BOOLEAN,
              COALESCE(moderations_var, jsonb_build_array()),
              parameters->'acl',
              parameters->>'_identifier';


       RETURN COALESCE(ret_var, jsonb_build_object('features', jsonb_build_array()));


END;
$$ LANGUAGE PLPGSQL;