# get_asset

The get_asset method retrieves details of an asset stored in the assets table

## Parameters

### uuid

Default: NULL
Type: Text

The uuid of the asset to retrieve

### filter

Default: {"_FAIL" : "true"}
Type: JSON

A JSON filter to be applied to the attributes column to retrieve multiple assets. Will be redundant if a uuid is passed.

## Returns

A JSON structure with the assets object key having an array of asset objects.

```json
{
  "assets": [
    {
      "foo": "baa",
      "uuid": "12345678"
    }
  ],
  "response_code": 200
}
```