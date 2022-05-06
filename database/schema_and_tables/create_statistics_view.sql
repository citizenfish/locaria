DROP VIEW IF EXISTS locaria_core.statistics_view;
CREATE VIEW locaria_core.statistics_view AS
SELECT id,
       log_type,
       log_timestamp,
       to_char(log_timestamp, 'DD/MM/YYYY HH24:MI:SS') AS dt,
       date_part('hour', log_timestamp) AS hr,
       date_part('day', log_timestamp) AS dy,
       date_part('month', log_timestamp) AS mn,
       date_part('year', log_timestamp) AS yr,
       COALESCE(log_message#>>'{parameters,search_text}', log_message#>>'{parameters,address}', '') AS srch,
       COALESCE(log_message#>'{parameters,category}', '[]') as cat,
       COALESCE(log_message#>'{parameters,tags}', '[]') as tags,
       COALESCE(log_message#>>'{parameters,_connectionIdWS}', 'anon') as usr,
       COALESCE(log_message#>>'{search_stats,count}', '0')::INTEGER AS t_cnt,
       COALESCE(log_message#>>'{search_stats,feature_count}', '0')::INTEGER AS f_cnt,
       CASE WHEN log_type IN('get_item','report') THEN log_message#>>'{parameters,fid}' ELSE '' END AS fid,
       log_message#>>'{parameters,limit}' AS lim,
       log_message#>>'{parameters,limit}' AS ofs,
       COALESCE(log_message#>>'{parameters,typeahead}', 'false') AS typah,
       COALESCE(log_message#>>'{parameters,cluster}', 'false') AS clus,
       COALESCE(log_message#>>'{parameters,location_distance}', '0') AS dist,
       log_message#>>'{parameters,location}' AS lctn,
       COALESCE(log_message#>>'{response_code}','200') AS rc
FROM locaria_core.logs
WHERE log_message @> jsonb_build_object('logpath','external')
  AND log_type IN ('search', 'location_search', 'address_search','get_item','report')
ORDER BY 1 DESC