# Overview

Last update: 1st August 2022

Locaria offers a wealth of functions using PLPGSQL stored within the database. This API is exposed via one of the following pathways:-

- publicly available 
- available to authenticated users
- called via a batch process (AWS Fargate)
- called directly

The database API is designed to keep functionality consistent even if the database schema should change. External components requiring database functionality or data do not need to be aware of the underlying schema. 

The API abstracts data into a JSON structure. Database API calls are made using JSON and return the results in JSON. This makes it easy to publish REST based APIs from Locaria

# Public Gateway

The public gateway provides unauthenticated access to Locaria and is designed primarily for search and retrieval operations. All public calls are routed via the PLPGSQL call [locaria_core.locaria_gateway(parameters, acl)](../database/functions/locaria_gateway.sql)

For example:-

```sql
SELECT locaria_core.locaria_gateway('{"method": "search", "search_text" :"foo"}'::JSONB, '{}'::JSONB)
```
Parameters and methods are described within [public_gateway.md](./public_gateway/public_gateway.md)
