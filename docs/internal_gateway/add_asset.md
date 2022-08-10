# add_asset

The add_asset method adds or updates details of an asset that is stored in external storage (usually AWS S3) such that it can be used by features within the locaria system.

A history record is written with the parameters passed to the method.

## Parameters

### uuid

Default: NULL
Type: Text, must be a uuid

A unique id to be assigned to the asset

### attributes

Default: {}
Type: JSON

A set of attributes for the asset. Assets that are returned via the [asset_url_maker()](../../database/functions/utility/asset_url_maker.sql) call must have the following set:-

- ext, the file extension of the asset

## Returns

A json structure with the asset uuid and details of the history record created

```json
{
  "uuid": "12345678",
  "history": {
    "id": 645
  },
  "response_code": 200
}
```
