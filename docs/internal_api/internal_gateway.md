# Overview

The internal api provides functions for authorised users to modify and manage data within the system.

The endpoint can only be accessed by authenticated users or internal system processes. The calling function is **locus_core.locus_internal_gateway**

```psql
SELECT locus_core.locus_internal_gateway('{"method" : "<METHOD>"}'::JSONB)
```

The internal gateway provides the following methods:-

## refresh_search_view

This method refreshes the search view. It should be called after adding/deleting or updating data to make it visible to search

```psql
SELECT locus_core.locus_internal_gateway('{"method" : "refresh_search_view"}'::JSONB)
```

## get_tables

The **get_tables** method returns a list of tables that may be updated by an authorised user. Currently LOCUS only supports updating data that has been loaded into a table inheriting from the **locus_core.base_table** structure.

get_tables will return a structure listing this table set

```psql
SELECT locus_core.locus_internal_gateway('{"method" : "get_tables"}'::JSONB)
```

Will return

```json
{
  "tables": [
    "all_crime",
    "nmrn_features",
    "planning_applications",
    "test_events"
  ]
}
```

## add_item

The **add_item** method adds an item to the table provided. It requires the following parameters:-

- table - the name of the table to add an item to
- geometry - a geometry in EWKT format
- attributes - a JSON Structure of attributes for the item
- category - the category the item should be added to
- search_date (optional) - a timestamp

add_item will return the id of the item added to the table

```psql
SELECT locus_core.locus_internal_gateway('{
  "method": "add_item",
  "attributes": {
    "foo": "baa"
  },
  "table": "test_events",
  "category": "Events",
  "geometry": "SRID=4326;POINT(-1.1 53.1)"
}'::JSONB)
```

Returns:-

```json
{
  "message": "add success <id added to table>"
}
```
## delete_item

The **delete_item** method will remove an item from a table. It requires the fid from the global_search_view

```psql
SELECT locus_core.locus_internal_gateway('{
  "method": "delete_item",
  "fid": "<FID FROM SEARCH VIEW>"
}'::JSONB)
```

Returns:-

```json
{"message": "delete success: <FID>"}
```

## update_item

The **update_item** method will update an item in a table. 

Items are updated directly if the user has the same group as that stored in the items acl.

If not the updates are added to a moderation queue if the category for the item has the attribute 

```json
{
  "moderated_update" : true
}

```
These updates are returned to an admin in a separate structure when using the get_item call.

It requires the following parameters:-

- fid - the fid from the global_search view
- geometry - (optional) a geometry in EWKT format
- attributes - (optional) a JSON Structure of attributes for the item (they are appended existing attributes will be overwritten)
- category - the category the item should be updated to
- search_date (optional) - a timestamp

```psql
SELECT locus_core.locus_internal_gateway('{
  "method": "update_item",
  "attributes": {
    "foo": "baa"
  },
  "fid": "<FID FROM SEARCH VIEW>",
  "category": "Events",
  "geometry": "SRID=4326;POINT(-1.1 53.1)"
}'::JSONB)
```

Returns:-

```json
{
  "message": "update success <id in table updated>"
}
```
