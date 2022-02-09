CREATE OR REPLACE FUNCTION locaria_core.preview_file_data(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
BEGIN

    SET SEARCH_PATH = 'locaria_uploads','locaria_core','public';

    SELECT json_agg(R.attributes)
    INTO ret_var
    FROM (
        SELECT  jsonb_build_object('id', ogc_fid,
                                   'title', attributes#>>'{description,title}',
                                   'text',  attributes#>>'{description,text}',
                                   'url',   attributes#>>'{description,url}',
                                   'data', attributes->'data',
                                   'geometry', ST_ASGEOJSON(wkb_geometry)::JSONB) AS attributes
        FROM get_preview_file_data(parameters)
    ) R;
    RETURN jsonb_build_object('items', ret_var,
                              'data_keys', (ARRAY(SELECT * FROM JSONB_OBJECT_KEYS(ret_var -> 0 -> 'data'))));

END;
$$ LANGUAGE PLPGSQL;