# add_asset

add_asset stores details of an image, binary object of file stored in AWS S3 for subsequent use in linking or embedding. 

## Parameters

### uuid

Default: NULL
Type: Text

A uuid used to refer to the asset this is generated and used externally.

### attributes

Default: {'internal', 'false'}
Type: JSON

A set of attributes relating to the asset.

## Returns

A json structure containing the uuid passed in

```json
{"uuid": "12345678", "response_code": 200}
```