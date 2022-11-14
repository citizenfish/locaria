--Retrieve an item's detail from the search view
CREATE OR REPLACE FUNCTION locaria_core.get_item(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
    moderations_var JSONB;

BEGIN
    SET SEARCH_PATH = 'locaria_core',  'locaria_data','public';

       --Returns moderations in geojson format
       EXECUTE format(
       $SQL$
           SELECT  distinct on (F.fid) jsonb_build_object(
                                    'type', 'FeatureCollection',
                                    'features', json_build_array(
                                        json_build_object(
                                                'type', 'Feature',
                                                'properties', F.attributes ||
                                                              jsonb_build_object('category',     F.attributes->'category'->0,
                                                                                 'fid',          $1,
                                                                                 '_live',        $2,
                                                                                 '_moderations', COALESCE(CASE WHEN (acl_check($3,NULL)->>'moderate')::BOOLEAN OR (acl_check($3, F.attributes->'acl')->>'owner')::BOOLEAN THEN jsonb_agg(
                                                                                           jsonb_build_object('geometry',   ST_ASGEOJSON(ST_GEOMFROMEWKT(MQ.attributes#>>'{parameters,geometry}'))::JSONB,
                                                                                                              'properties', MQ.attributes#>'{parameters,attributes}' || jsonb_build_object('mq_id', MQ.id, 'mq_status', MQ.status, 'mq_type', MQ.attributes->>'type'))
                                                                                                  ) FILTER (WHERE MQ.id IS NOT NULL)  OVER() END, jsonb_build_array())
                                                                                 ),
                                                'geometry',   ST_ASGEOJSON(ST_TRANSFORM(wkb_geometry,4326))::JSON
                                        )
                                    )
            )
              FROM %1$s F
              LEFT JOIN locaria_core.moderation_queue MQ ON MQ.status IN('RECEIVED','REJECTED') AND F.fid = MQ.fid
              WHERE (($1 != '' AND F.fid = $1) OR ($1 = '' AND F.attributes @> jsonb_build_object('data', jsonb_build_object('_identifier', $4))))
              AND (acl_check($3, F.attributes->'acl')->>'view')::BOOLEAN
              ORDER BY F.fid,MQ.id DESC
        $SQL$,
        CASE WHEN COALESCE(parameters->>'live','false')::BOOLEAN THEN 'global_search_view_live' ELSE 'global_search_view' END
        )
        INTO ret_var
        USING COALESCE(parameters->>'fid', ''),
              COALESCE(parameters->>'live','false')::BOOLEAN,
              parameters->'acl',
              parameters->>'_identifier';

       RETURN COALESCE(ret_var, jsonb_build_object('features', jsonb_build_array()));


END;
$$ LANGUAGE PLPGSQL;