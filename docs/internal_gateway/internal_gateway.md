#internal_gateway

## Public Gateway Parameters

The public gateway accepts two parameters, a JSON object containing the method required and any parameters for it and an Access Control List (ACL) object giving details of the user making the call.

### Parameters

```json
{
  "method" : "get_tables",
  "parameter" : "foo"
}
```
The parameters object must contain the name of the **method** that is to be called. This should be one of:-

- version
- get_tables
- add_item
- delete_item
- update_item
- refresh_search_view
- get_files
- add_file
- request_download_data
- update_file
- delete_file
- report
- view_report
- add_group
- get_group
- get_moderation_items
- preview_file_data
- load_preview_file_data
- update_moderation_status
- get_parameters
- set_parameters
- delete_parameters
- update_category
- add_asset
- get_asset
- delete_asset

## Internal Gateway Methods

### version

This method returns the version number of the internal gateway currently in use.

### get_tables

The [get_tables](get_tables.md) method retrieves a list of system tables used to store data for a given category.

### add_item


