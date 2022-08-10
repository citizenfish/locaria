# update_category

The update_category method adds a new category or updates an existing category. A history record is written to the history table with details of the parameters passed.

## Parameters

### category

Default: NULL
Type: Text

Name of the category to add or update

### attributes

Default: NULL
Type: JSON

Category attributes to add or update

### rename

Default: NULL
Type: Text

If not null then the category will be renamed to the value passed in rename

## Returns

A JSON structure with the id of the category affected and details of the history record created.

```json
{
  "id": 186,
  "history": {
    "id": 633
  },
  "response_code": 200
}
```