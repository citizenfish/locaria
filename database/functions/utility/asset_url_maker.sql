DROP FUNCTION IF EXISTS asset_url_maker(array_param jsonb, asset_param jsonb, mask text);

CREATE OR REPLACE FUNCTION locaria_core.asset_url_maker(array_param JSONB,  mask TEXT) RETURNS JSONB AS
$$

    if(array_param === null) {
        return []
    }

    return array_param.map((item) => {
        let query = plv8.execute("SELECT attributes->>'ext' AS ext FROM locaria_core.assets WHERE uuid = $1", [item])
        let ext = query[0]['ext'];
        return mask.replace(/_UUID_/g, item).replace('_EXT_', ext)
    })

$$ LANGUAGE PLV8;