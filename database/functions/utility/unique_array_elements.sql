CREATE OR REPLACE FUNCTION locaria_core.unique_array_elements(arr_var JSONB) RETURNS JSONB AS
$$
    return(Object.keys(arr_var.reduce((l, r) => l[r] = l, {})).sort())
$$ LANGUAGE PLV8;