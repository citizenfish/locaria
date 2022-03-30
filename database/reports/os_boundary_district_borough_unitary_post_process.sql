DELETE FROM locaria_core.reports WHERE report_name ='os_boundary_district_borough_unitary_post_process';

INSERT INTO locaria_core.reports(report_name, report_parameters, admin_privilege)
SELECT 'os_boundary_district_borough_unitary_post_process',
       jsonb_build_object('sql',
$SQL$
        DROP MATERIALIZED VIEW IF  EXISTS locaria_data.local_authority_boundary;
        CREATE MATERIALIZED VIEW locaria_data.local_authority_boundary AS

        SELECT ogc_fid AS id,
               ST_TRANSFORM(ST_SIMPLIFYPRESERVETOPOLOGY(ST_TRANSFORM(wkb_geometry,27700),5),4326) as wkb_geometry,
               row_to_json(DBU.*)::JSONB - 'ogc_fid' - 'wkb_geometry' AS attributes
        FROM   locaria_uploads.district_borough_unitary DBU;

        CREATE INDEX local_authority_boundary_gits_idx ON locaria_data.local_authority_boundary USING GIST(wkb_geometry);

        SELECT jsonb_build_object('os_boundary_district_borough_unitary_post_process', ($1::JSONB)->>'version');
$SQL$),
       TRUE;
