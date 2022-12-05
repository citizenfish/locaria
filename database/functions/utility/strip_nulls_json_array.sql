CREATE OR REPLACE FUNCTION locaria_core.strip_nulls_json_array(arr JSONB) RETURNS JSONB AS
$$
    const results = arr.filter(element => {
                return element !== null;
    });
    return(results)
$$
LANGUAGE PLV8;