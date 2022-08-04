# list_categories

This method returns an array of categories from the categories table.

## Parameters

### attributes

Default: 'false'
Type: Boolean

If set to true then the attributes column of the category will be returned as well as the category name.

### category

Default: NULL
Type: Text

If set to a category name then only this category will be returned.

## Returns

### attributes = 'true'

A categories object containing an array of categories with the category name as the key and attributes as the other values

```json
{
  "categories": [
    {
      "foo": "baa",
      "key": "acl_test"
    }
  ],
  "response_code": 200
}
```

### attributes = 'false'
```json
{
    "categories":
    [
        "acl_test",
        "LOCARIA_TEST",
        "LOCARIA_TEST_MOD",
        "LOCARIA_TEST_NO_DATA"
    ],
    "response_code": 200
}
```
