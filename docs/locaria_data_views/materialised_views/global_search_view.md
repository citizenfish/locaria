# global_search_view

The global_search_view is a materialized view used by locaria for all search operations. It is derived by materializing the view global_search_view_live. global_search_view_live is a union of:-

- locaria_data.base_table
- locaria_data.search_views_union

The only difference between the two views is that the materialized view has the image urls formatted using asset_url_maker. This is not done in the live view as it is a performance drain.

The view is created by the function [create_materialised_view()](../../../database/functions/view_creation/create_materialised_view.sql) and refreshed using the api call [refresh_view](./docs/internal_gateway/internal_gateway.md) via the internal gateway.

## locaria_data.base_table

base_table is the parent table of all tables created in locaria_data. Each of these must inherit from the base table. For example:-

```sql
CREATE TABLE locaria_data.data_table() INHERITS(locaria_data.base_table);
```

The table locaria_data.imports inherits from base_table and is created at system initiation for all data imported and mapped by standard file operations.

## locaria_data.search_views_union

search_views_union is a union of all views in locaria_data that are made available to the global_search_view. This union is constructed by the function [views_union](../../../database/functions/view_creation/views_union.sql). This function should be run every time a new view is to be added to the system.

views are excluded from this list by adding them to the system parameter **excluded_view_tables** which is an array of table names to be ignored.

views MUST follow the data structure of the base_table and must ahve a unique id column

## global_search_view data structure

The global_search_view has the following columns:-

### fid

Type: Text

A unique id derived from the id and table name and id of the item stored within the table. 

### wkb_geometry

Type: geometry

A geometry that must be in the EPSG:4326 coordinate system

### attributes

Type: JSONB

An attributes structure formatted as follows:-

```json
{
  "tags": ["tag1","tag2"],
  "description" : {
    //search operates down this attribute structure
    "title" : "A display title for an item",
    "text" : "Display text for an item"
  },
  "data" : {
    // one or many data attributes
    "images" : [ an array of image urls formatted by asset_url_maker]
  },
  "table" : "the origin table for the data",
  "ref" : "A reference used for reference searches",
  "ofid": 1, //the id of the item in its origin table,
  "category" : [,"The category name of the item"],
  "acl" : { } //the item's acl
}
```

image urls returned are formatted using the url mask stored in the parameter assets_url. For example:-

```json
{
  "url", "~uuid:_UUID_~url:/assets/_UUID_._EXT_"
}
```
The values of UUID and EXT are merged in from details retrieved from the assets table

### start_date

Type: Timestamp

A date used for date range searches, defaults to date record was created in the origin table

### end_date

Type: Timestamp

A date used for date range searches, defaults to 24 hours after start_date

### range_min

Type: Double precision

A minimum numeric value used for range searches, defaults to 0

### range_max

Type: Double precision

A maximum numeric value used for range searches, defaults to 0

### edit

Type: BOOLEAN

If the item is in a table that can be edited then set to true, if it is in a view which cannot be edited then false

### moderated_update

Type: BOOLEAN

If the item is from a category that requires all updates to be moderated then true else false