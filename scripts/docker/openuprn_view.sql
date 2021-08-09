DROP MATERIALIZED VIEW IF EXISTS locus_core.uprn_view;

--get rid of the header line
DELETE FROM locus_data.openuprn_import WHERE uprn ~ 'UPRN';

CREATE MATERIALIZED VIEW locus_core.uprn_view AS
SELECT uprn,
       ST_TRANSFORM(ST_GEOMFROMEWKT('SRID=27700;POINT('||x_coordinate||' '||y_coordinate||')'), 4326) AS wkb_geometry
FROM   locus_core.openuprn_import;