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

- published <- the number of items in the materialized search view
- live_view <- the number of items in the live view (subtracting live_view - published = number of items not yet published)
- add_item <- number of items added via the add_item api since last refresh
- delete_item <- number of items deleted via the delete_item api since last refresh
- update_item <- number of items updated via the update_item since last refresh
- moderations <- number of items in the moderation queue that need to be moderated

```json
{
  "published": 31,
  "live_view": 32,
  "add_item": 0,
  "moderations" : 12,
  "delete_item": 0,
  "update_item": 0,
  "update_fids": ["12345"],
  "delete_fids": ["44545554"],
  "response_code": 200
}
```