SELECT locaria_core.create_materialised_view();

GRANT SELECT ON locaria_data.global_search_view TO locaria_report_user;

--Location search view must be created and then populated later by opennames

CREATE MATERIALIZED VIEW IF NOT EXISTS locaria_data.location_search_view
AS
SELECT
    0 AS id,
    jsonb_build_object('address', '', 'name1', '') AS attributes,
    NULL AS wkb_geometry;