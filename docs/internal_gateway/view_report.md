# view_report

The view_report method returns the following statistics related to the global_search_view

- total number of items
- number pending addition
- number pending deletion
- number pending update

## Parameters

No parameters are sent

## Returns

A json structure containing the statistics.

```json
{
  "total": 31,
  "add_item": 0,
  "delete_item": 0,
  "update_item": 0,
  "update_fids": ["12345"],
  "delete_fids": ["44545554"],
  "response_code": 200
}
```