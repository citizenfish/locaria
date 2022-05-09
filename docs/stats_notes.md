# React vis

https://uber.github.io/react-vis/

# Overview

https://github.com/nautoguide/locaria_private/issues/95

Stats view created from log tables with

database/schema_and_tables/create_statistics_view.sql

Log tables are partitioned and updated by pg_cron so we do not prune or delete from them

At present we are reporting on the following:-

'search', 'location_search', 'address_search','get_item', 'report'

## Dashboard queries

```sql

SET SEARCH_PATH = 'locaria_core', 'locaria_data', 'public';


--TODAY
SELECT count(DISTINCT usr) users,
count(*) AS searches
FROM locaria_core.statistics_view
WHERE log_type IN('search', 'address_search')
AND log_timestamp::DATE = NOW()::DATE

--THIS WEEK
SELECT count(DISTINCT usr) users,
count(*) AS searches
FROM locaria_core.statistics_view
WHERE log_type IN('search', 'address_search')
AND DATE_PART('year', log_timestamp) = DATE_PART('year', now())
AND DATE_PART('week', log_timestamp) = DATE_PART('week', now())

--THIS MONTH
SELECT count(DISTINCT usr) users,
count(*) AS searches
FROM locaria_core.statistics_view
WHERE log_type IN('search', 'address_search')
AND DATE_PART('year', log_timestamp) = DATE_PART('year', now())
AND DATE_PART('month', log_timestamp) = DATE_PART('month', now())

--THIS YEAR
SELECT count(DISTINCT usr) users,
count(*) AS searches
FROM locaria_core.statistics_view
WHERE log_type IN('search', 'address_search')
AND DATE_PART('year', log_timestamp) = DATE_PART('year', now())

--LAST 24 hours
SELECT rng,
COALESCE(users,0) AS users,
COALESCE(searches,0) AS searches
FROM
(SELECT DATE_PART('hour', GENERATE_SERIES(now() - INTERVAL '24 hours', now(), Interval '1 hour')) AS rng) RN
LEFT JOIN (
SELECT DATE_PART('hour', log_timestamp) AS hour,
COUNT(DISTINCT usr)              AS   users,
COUNT(*)                         AS searches
FROM locaria_core.statistics_view
WHERE log_type IN ('search', 'address_search')
AND log_timestamp BETWEEN NOW() - INTERVAL '24 HOURS' AND NOW()
GROUP BY 1
) LG
ON rng = hour

--LAST 10 days
SELECT rng,
COALESCE(users,0) AS users,
COALESCE(searches,0) AS searches
FROM
(SELECT DATE_PART('day', GENERATE_SERIES(now() - INTERVAL '10 days', now(), Interval '1 day')) AS rng) RN
LEFT JOIN (
SELECT DATE_PART('day', log_timestamp) AS day,
COUNT(DISTINCT usr)             AS    users,
COUNT(*)                        AS searches
FROM locaria_core.statistics_view
WHERE log_type IN ('search', 'address_search')
AND log_timestamp BETWEEN NOW() - INTERVAL '10 days' AND NOW()
GROUP BY 1
) LG
ON rng = day

--CATEGORIES
SELECT jsonb_array_elements(cat) AS category,
       count(*) AS count
FROM locaria_core.statistics_view
WHERE log_type IN('search')
  AND log_timestamp::DATE = NOW()::DATE
GROUP BY 1
ORDER BY count

--TAGS
SELECT jsonb_array_elements(tags) AS tags,
       count(*) AS count
FROM locaria_core.statistics_view
WHERE log_type IN('search')
  AND log_timestamp::DATE = NOW()::DATE
GROUP BY 1
ORDER BY count

--SEARCH TERMS

SELECT srch,
       count(*) as count
FROM locaria_core.statistics_view
WHERE log_type IN ('search')
  AND log_timestamp BETWEEN NOW() - INTERVAL '10 days' AND NOW()
  AND typah ='false'
GROUP BY 1
ORDER BY count DESC

--get_items

--get_items

SELECT SV.fid,
       attributes#>>'{description,title}' AS title,
       attributes->'category'->>0 AS category,
       count
FROM (
         SELECT fid,
                COUNT(*)
         FROM locaria_core.statistics_view
         WHERE log_type IN ('get_item')
           AND log_timestamp BETWEEN NOW() - INTERVAL '10 days' AND NOW()
         GROUP BY 1
         ORDER BY count DESC
     ) SV
         INNER JOIN locaria_data.global_search_view USiNG(FID)
ORDER BY count DESC,category
         
```











