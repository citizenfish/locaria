# delete_asset

The delete_asset method deletes an asset from the assets table returning details of the asset deleted such that the calling api can remove the items from S3 storage

## Parameters

### uuid

Default: NULL
Type: Text

The uuid of the asset to delete


## Returns

A JSON structure with details of the asset deleted and an associated history record

```json
{
  "uuid": "12345678",
  "delete": "success",
  "details": {
    "foo": "baa",
    "uuid": "12345678"
  },
  "history": {
    "id": 653
  },
  "response_code": 200
}
```