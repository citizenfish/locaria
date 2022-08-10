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

The [add_item](add_item.md) method adds an item to the database into one of te tables listed by get_tables

### delete_item

The [delete_item](delete_item.md) method deletes an item from a system table

### update_item

The [update_item](update_item.md) method updates the attributes, geometry or acl of an item in the system tables. 

### refresh_search_view

The refresh_search_view method refreshes the materialized view global_search_view after updates, inserts or deletes on the system tables

### get_files

The [get_files](get_files.md) method retrieves a list of registered files from the database 

### add_file

The [add_file](add_file.md) method registers a file within the database 

### request_download_data

The request_download_data method is an alias for [add_file](add_file.md) 

### update_file

The update_file method updates a file's attributes, status and last_update date. 

### delete_file

The delete_file method marks a file as deleted within the locaria database

### report

The [report](../public_gateway/report.md) method operates in exactly the same way as the same method in the public_gateway but the internal flag is passed as true

### view_report

The view_report method returns the status of the global_search_view with regard to which items from the global_search_live view are yet to become visible within this view.


### add_group
### get_group

Currently deprecated pending review

### get_moderation_items

The [get_moderation_items](get_moderation_items.md) method retrieves items from the moderation queue that are pending authorisation.

### preview_file_data

The [preview_file_data](preview_file_data.md) method is used when loading data to get a preview as to how the data will be formatted when loaded into the global_search view

### load_preview_file_data

The [load_preview_file_data](load_preview_file_data.md) method uses a mapping run through preview_file_data to load data into the table locaria_data.imports and hence make it available to the global_search_view

### update_moderation_status

The [update_moderation_status](update_moderation_status.md) method updates the status of an item in moderation

### get_parameters

The [get_parameters](get_parameters.md) method retrieves one or many parameters from the parameters table

### set_parameters

The [set_parameters](set_parameters.md) method adds or updates a parameter within the parameters table

### delete_parameters

The [delete_parameters](delete_parameters.md) method deletes a parameter from the parameters table

### update_category

The [update_category](update_category.md) method adds a new category or updates an existing category

### add_asset

The [add_asset](add_asset.md) method adds or updates details of an asset that is stored in external storage (usually AWS S3) such that it can be used by features within the locaria system

### get_asset

The [get_asset](get_asset.md) method retrieves details of an asset stored in the assets table.

### delete_asset

The delete_asset method deletes an asset from the assets table





