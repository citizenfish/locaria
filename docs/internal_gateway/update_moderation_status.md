# update_moderation_status

This method updates the moderation status of an item

## Parameters

### id

Default: NULL
Type: Integer

The id of the moderation item

### status

Default: NULL
Type: Text

The new status of the item

## Returns

A JSON structure with the id of the item updated and an update message

```json
{
  "id": 36,
  "message": "Item added to moderation queue",
  "response_code": 200
}
```