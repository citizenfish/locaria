DROP  FUNCTION locus_core.cluster(search_parameters JSONB);
CREATE OR REPLACE FUNCTION locus_core.cluster(search_parameters JSONB)  RETURNS TABLE (
    _fid TEXT,
    _search_rank DOUBLE PRECISION,
    _wkb_geometry GEOMETRY,
    _attributes JSONB

) AS
$$
DECLARE

    cluster_size INTEGER default 1;
    cluster_width FLOAT DEFAULT 1000;
    cluster_limit INTEGER DEFAULT 100000;
BEGIN

   SET SEARCH_PATH = 'locus_core', 'public';

   cluster_size  = COALESCE((search_parameters->>'cluster_size')::BIGINT, cluster_size);
   -- in degrees 0.00001 is 1.11 meters so we can receive a width in metres, it will be approximate
   cluster_width = COALESCE((search_parameters->>'cluster_width')::FLOAT, cluster_width) * 0.00001;

   RETURN  QUERY

    SELECT  FINAL._fid,
            FINAL._search_rank,
            ST_Centroid(FINAL._wkb_geometry) AS _wkb_geometry,
            --add in the cluster extent converted from box_2d to a json array
            FINAL._attributes || CASE WHEN FINAL._attributes->>'count' != '1' THEN jsonb_build_object('extent', box2json(FINAL._wkb_geometry)) ELSE jsonb_build_object() END  AS _attributes
    FROM (
            SELECT c_id::TEXT AS _fid,
                   1::DOUBLE PRECISION as _search_rank,
                   ST_Collect(SEARCH_CLUSTER._wkb_geometry) AS _wkb_geometry,
                   jsonb_build_object('category', category,
                                      'count', count(c_id),
                                      'geometry_type', 'item') || CASE WHEN count(c_id) = 1 THEN jsonb_agg(attrs)->0 ELSE jsonb_build_object('geometry_type', 'cluster') END AS _attributes

            FROM (
                SELECT S._attributes->>'category' AS category,
                       S._attributes as attrs,
                       S._wkb_geometry,
                       ST_ClusterDBSCAN(S._wkb_geometry, cluster_width, cluster_size) OVER (partition by S._attributes->>'category') as c_id
                FROM search_get_records(search_parameters, cluster_limit) S
            ) SEARCH_CLUSTER
            GROUP BY c_id, category
    ) FINAL;

END;
$$
LANGUAGE PLPGSQL;