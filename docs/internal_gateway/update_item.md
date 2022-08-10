# update_item

Update item updates the attributes, date and geometry for an item stored in the system tables. The moderation status of the item is checked and if true the update is dropped into the moderation queue rather thn being updated directly. This moderation status is set by a category having the attribute:-

```json
{
  "moderated_update" : "true"
}
```

Post update a history record is created using the parameters passed to the update call.

## Parameters

### fid

Default: NULL
Type: Text

The fid from the global_search_view for the item to be updated.

### attributes

Default: {}
Type: JSON

A json object that will be appended to the current item attributes

### geometry

Default: NULL
Type: Text ( a geometry in EWKT format)

A geometry for the item, can be in any CRS but will be transformed to EPSG:4326

### category

Default: NULL
Type: Text

The name of the category to tag the item with

### search_date

Default: NOW()
Type: Timestamp

The creation date to be added to the item

### moderation_id

Default: NULL
Type: INTEGER

The id of an item that has been updated from the data in the moderation queue. The item's moderation status will be set to "ACCEPTED" removing it from the queue and making the update live.

## Returns

An item that does not require moderation approval

```json
{
  "history": {
    "id": 468
  },
  "message": "update success: 175",
  "response_code": 200
}
```

An item requiring moderation approval

```json
{
  "id": 35,
  "message": "Item added to moderation queue",
  "response_code": 200
}
```

