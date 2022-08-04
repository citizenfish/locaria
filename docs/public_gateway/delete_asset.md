# delete_asset

The delete_asset method deletes asset details from the database and returns details of the asset deleted.

## Parameters

### uuid

Default: ''
Type: Text

The uuid of the stored asset

## Returns

A json structure with details of the asset deleted.

```json
{
  "uuid": "12345678",
  "delete": "success",
  "details": {
    "foo": "baa",
    "uuid": "12345678"
  },
  "response_code": 200
}
```
