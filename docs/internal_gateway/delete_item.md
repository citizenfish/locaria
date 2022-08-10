# delete_item

Delete item will remove an item from one of the system tables. It retrieves the table information from the global_search_view. An acl check is carried out to ensure that the user has the authority to delete the requested item. 

After deletion a history item is added to the history table with the parameters passed to the delete_item method.

## Parameters

### fid

Default: NULL
Type: Text

The fid of the item from the global_search_view

## Returns

A json object with the id of the history item created and a success message
```json
{
  "history": {
    "id": 459
  },
  "message": "delete success: 4b9b5da3985ff3b86019c55a23346c58",
  "response_code": 200
}
```
