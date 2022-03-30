CREATE OR REPLACE FUNCTION locaria_core.cluster(search_parameters JSONB)  RETURNS TABLE (
    _fid TEXT,
    _search_rank DOUBLE PRECISION,
    _wkb_geometry GEOMETRY,
    _attributes JSONB

) AS
$$
DECLARE

    cluster_size INTEGER default 2;
    cluster_width FLOAT DEFAULT 1000; --DBSCAN
    cluster_limit INTEGER DEFAULT 100000; --DBSCAN
    kmeans_number_of_clusters INTEGER DEFAULT 30;
    cluster_algorithm TEXT DEFAULT 'KMEANS';
BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';
    cluster_algorithm = upper(COALESCE(search_parameters->>'cluster_algorithm', cluster_algorithm));
    kmeans_number_of_clusters = COALESCE((search_parameters->>'kmeans_number_of_clusters')::BIGINT, kmeans_number_of_clusters);
    cluster_size  = COALESCE((search_parameters->>'cluster_size')::BIGINT, cluster_size);

    IF cluster_algorithm = 'DBSCAN' THEN
        -- in degrees 0.00001 is 1.11 meters so we can receive a width in metres, it will be approximate
        cluster_width = COALESCE((search_parameters->>'cluster_width')::FLOAT, cluster_width) * 0.00001;
        RETURN  QUERY

            SELECT  FINAL._fid,
                    FINAL._search_rank,
                    ST_Centroid(FINAL._wkb_geometry) AS _wkb_geometry,
                    --add in the cluster extent converted from box_2d to a json array
                    --FINAL._attributes || CASE WHEN FINAL._attributes->>'count' != '1' THEN jsonb_build_object('extent', box2json(FINAL._wkb_geometry)) ELSE jsonb_build_object() END  AS _attributes
                    FINAL._attributes || jsonb_build_object('extent', box2json(FINAL._wkb_geometry),'geometry_type', 'cluster')
            FROM (
                     SELECT c_id::TEXT AS _fid,
                            1::DOUBLE PRECISION as _search_rank,
                            ST_Collect(SEARCH_CLUSTER._wkb_geometry) AS _wkb_geometry,
                            jsonb_build_object('category', category,
                                               'count', count(*),
                                               'geometry_type', 'item') || CASE WHEN count(c_id) = 1 THEN jsonb_agg(attrs)->0 ELSE jsonb_build_object('geometry_type', 'cluster') END AS _attributes

                     FROM (
                              SELECT S._attributes->>'category' AS category,
                                     S._attributes as attrs,
                                     S._wkb_geometry,
                                     ST_ClusterDBSCAN(S._wkb_geometry, cluster_width, cluster_size) OVER (partition by S._attributes->>'category') AS c_id
                              FROM search_get_records(search_parameters, cluster_limit) S
                          ) SEARCH_CLUSTER
                     GROUP BY c_id, category
                 ) FINAL;
    END IF;

    --Used when lots of singletons but slow
    IF cluster_algorithm = 'KMEANSDBSCAN' THEN

        RETURN QUERY

            SELECT  FINAL._fid,
                    FINAL._search_rank,
                    ST_Centroid(FINAL._wkb_geometry) AS _wkb_geometry,
                    --add in the cluster extent converted from box_2d to a json array to facilitate zoom in
                    --TODO this extent needs to be buffered if count = 1 as we zoom in too far
                    FINAL._attributes || jsonb_build_object('extent', box2json(FINAL._wkb_geometry)) AS _attributes

            FROM (
                     SELECT c_id::TEXT AS _fid,
                            1::DOUBLE PRECISION as _search_rank,
                            ST_Collect(SEARCH_CLUSTER._wkb_geometry) AS _wkb_geometry,
                            jsonb_build_object('category',      category,
                                               'count',         count(*),
                                               'geometry_type', 'cluster') AS _attributes
                     FROM (
                             SELECT K.category,
                                    K._wkb_geometry,
                                    K.c_id,
                                    ST_ClusterDBSCAN(K._wkb_geometry, cluster_width, cluster_size) OVER (PARTITION BY c_id) AS d_id
                              FROM (
                                       SELECT S._attributes ->> 'category' AS category,
                                              S._wkb_geometry,
                                              --kmeans_number_of_clusters must be > total number of geometries hence requiring the count
                                              ST_ClusterKmeans(S._wkb_geometry, LEAST(kmeans_number_of_clusters, total_c::INTEGER)) OVER () AS c_id
                                       FROM (SELECT *, count(*) OVER() AS total_c FROM search_get_records(search_parameters, cluster_limit)) S
                                   ) K
                          ) SEARCH_CLUSTER
                     GROUP BY c_id, d_id,category
                 ) FINAL;
    END IF;

    IF cluster_algorithm = 'KMEANS' THEN

        RETURN QUERY

            SELECT  FINAL._fid,
                    FINAL._search_rank,
                    ST_Centroid(FINAL._wkb_geometry) AS _wkb_geometry,
                    --add in the cluster extent converted from box_2d to a json array to facilitate zoom in
                    --TODO this extent needs to be buffered if count = 1 as we zoom in too far
                    FINAL._attributes || jsonb_build_object('extent', box2json(FINAL._wkb_geometry)) AS _attributes

            FROM (
                     SELECT c_id::TEXT AS _fid,
                            1::DOUBLE PRECISION as _search_rank,
                            ST_Collect(K._wkb_geometry) AS _wkb_geometry,
                            jsonb_build_object('category',      category,
                                               'count',         count(*),
                                               'geometry_type', 'cluster') AS _attributes
                     FROM (

                           SELECT S._attributes ->> 'category' AS category,
                                  S._wkb_geometry,
                                  --kmeans_number_of_clusters must be > total number of geometries hence requiring the count
                                  ST_ClusterKmeans(S._wkb_geometry, LEAST(kmeans_number_of_clusters, total_c::INTEGER)) OVER () AS c_id
                           FROM (SELECT *, count(*) OVER() AS total_c FROM search_get_records(search_parameters, cluster_limit)) S
                       ) K

                     GROUP BY c_id, category
                 ) FINAL;
    END IF;

END;
$$
LANGUAGE PLPGSQL;