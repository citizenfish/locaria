CREATE OR REPLACE FUNCTION locaria_core.get_my_items(parameters JSONB DEFAULT jsonb_build_object()) RETURNS JSONB AS
$$
DECLARE
    search_parameters JSONB DEFAULT jsonb_build_object(
        'format', 'datagrid',
        'owned', true,
        'live', true,
        'my_items', true);
BEGIN
    RETURN locaria_core.search(search_parameters || parameters);
END;
$$ LANGUAGE PLPGSQL;