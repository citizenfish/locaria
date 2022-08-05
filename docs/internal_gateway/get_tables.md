# get_tables

The get_tables method retrieves a list of system tables used to store data for a given category. This is used for editing items or operations where it is necessary to know the base table of an item

## Parameters

### category

Default: ''
Type: String

The name of the category for which the desired table information should be returned

## Returns

A JSON structure with an array of table names in the table object

```json
{
  "tables": [
    "test_acl"
  ],
  "response_code": 200
}
```