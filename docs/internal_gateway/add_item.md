# add_item

add_item adds an item to the database by inserting it into a defined data table. The item is subsequently available to the global_search_view_live view and will appear in the global_search_view after the view has been refreshed.

After insertion a history item is added to the history table with the parameters passed to the add_item method.

The acl is set to the default system 
## Parameters

### table

Default: ''
Type: Text

The name of the table that the item will be inserted into.

### attributes

Default: NULL
Type: JSON

A json object of attributes to be added to the item

### category

Default: NULL
Type: Text

The name of the category to tag the item with

### search_date

Default: NOW()
Type: Timestamp

The creation date to be added to the item

### geometry

Default: NULL
Type: Text ( a geometry in EWKT format)

A geometry for the item, can be in any CRS but will be transformed to EPSG:4326

### _newacl

Default: {"update" : ["Admins"], "delete" : ["Admins"]}
Type: JSON [acl](../acl.md) structure to be applied to the item

## Returns

A json structure with the id of the added item and the related history record created

```json
{
  "id": 152,
  "history": {
    "id": 440
  },
  "message": "add success: 152",
  "response_code": 200
}
```
