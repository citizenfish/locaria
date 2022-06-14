CREATE OR REPLACE FUNCTION locaria_core.json_unflatten(data JSONB) RETURNS JSONB AS
$$

    if (Object(data) !== data || Array.isArray(data))
        return data;

    let regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
        resultholder = {};

    let areg = /\[.*\]/;

    for (var p in data) {
        var cur = resultholder,
            prop = "",
            m;
        while (m = regex.exec(p)) {
            cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
            prop = m[2] || m[1];
        }
        //Convert arrays to json
        if(areg.test(data[p])) {
            cur[prop] = JSON.parse(data[p].replace(/'/g, '"'));
        } else {
            cur[prop] = data[p];
        }

    }
    return resultholder[""] || resultholder;

$$ LANGUAGE PLV8;