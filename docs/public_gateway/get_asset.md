# get_asset

get_asset retrieves the details relating to a previously stored asset.

## Parameters

### uuid

Default: ''
Type: Text

The uuid of the stored asset

### filter

Default: {'_FAIL', 'true'}
Type: json

A json filter that can be used to retrieve an asset based upon its attribute values.

## Returns

A JSON object with the assets key refering to an array of asset attributes.

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