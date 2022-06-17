CREATE OR REPLACE FUNCTION locaria_core.asset_url_maker(array_param JSONB, asset_param JSONB, mask TEXT) RETURNS JSONB AS
$$

    if(array_param === null) {
        return []
    }

    if(asset_param === null){
        return array_param
    }

    return array_param.map((item) => {
        return mask.replace(/_UUID_/g, item).replace('_EXT_', asset_param['ext'])
    })

$$ LANGUAGE PLV8;