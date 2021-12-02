CREATE OR REPLACE FUNCTION locaria_core.polygon_divider(input_geometry GEOMETRY, segments INTEGER DEFAULT 4) RETURNS TABLE (wkb_geometry GEOMETRY) AS
$$
DECLARE
    fill_points INTEGER DEFAULT 2500;
BEGIN
    --divide a polygon into equal area segments
    RETURN QUERY
    WITH POINTS AS (
        --fill the polygon full of points
        SELECT  (ST_DUMP(ST_GeneratePoints(input_geometry, fill_points))).geom AS geom
    ), CLUSTERS AS (
        --create equal area segments by clustering these points
        SELECT geom,
               ST_CLusterKmeans(geom, segments) OVER () as cluster
        FROM POINTS

    ), CENTROIDS AS (
        --compute centroid of each cluster
        SELECT cluster,
            ST_Centroid(ST_Collect(geom)) AS geom
        FROM CLUSTERS
        GROUP BY cluster
    ), VORONI AS (
        --use voroni to divide up the centroids, we could have used boundary of clusters but this is quicker
        SELECT (ST_Dump(ST_VoronoiPolygons(ST_collect(geom)))).geom AS geom
        FROM CENTROIDS

    ) SELECT
            --cookie cut original polygon to get areas
            ST_Intersection(input_geometry, geom) AS wkb_geometry
            FROM VORONI;

END;
$$
LANGUAGE PLPGSQL;