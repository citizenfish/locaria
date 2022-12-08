## Public Gateway Parameters

The public gateway accepts two parameters, a JSON object containing the method required and any parameters for it and an Access Control List (ACL) object giving details of the user making the call.

### Parameters

```json
{
  "method" : "search",
  "search_text" : "foo"
}
```
The parameters object must contain the name of the **method** that is to be called. This should be one of:-

- search
- bboxsearch
- refsearch
- pointsearch
- datesearch
- filtersearch
- get_item
- list_categories
- list_tags
- list_categories_with_data
- location_search
- address_search
- version
- revgeocoder
- add_message
- report
- get_parameters
- add_asset
- get_asset
- delete_asset
- get_vector_tile


### ACL

Locaria ACLS are described in [acl.md](../acl.md) the acl provided to the internal gateway should have the following structure:-

```json
{
  "_userID" : <A unique user ID> | "PUBLIC",
  "_groups" : ["Group 1", "Group 2", "Group 3"]
}
```

If an ACL is not provided the default of an empty object is used. ie:-

```json
{}
```
## Public Gateway Methods

### search

The [search method](./search.md) carries out a search and returns the results to the user

### bboxsearch

The bboxsearch method is a placeholder for the  [search method](./search.md) method and used to provide a separate pathway for GET calls.

### refsearch

The refsearch method is a placeholder for the  [search method](./search.md) method and used to provide a separate pathway for GET calls

### pointsearch

The pointsearch method is a placeholder for the  [search method](./search.md) method and used to provide a separate pathway for GET calls

### datesearch

The datesearch method is a placeholder for the  [search method](./search.md) method and used to provide a separate pathway for GET calls

### filtersearch

The filtersearch method is a placeholder for the  [search method](./search.md) method and used to provide a separate pathway for GET calls

### get_item

The [get_item](get_item.md) method retrieves additional data for an item from the global_search_view. 

### add_item

The [add_item](../internal_gateway/add_item.md) method allows a user to add an item to the system

### list_categories

The [list_categories](list_categories.md) method returns a list of all categories configureed within the categories table

### list_categories_with_data

The [list_categories_with_data](list_categories_with_data.md) method returns a list of all categories that have corresponding data in the global_search_view

### location_search

The [location_search](location_search.md) method  returns a list of locations that match a search query. For example "SN1 3LX" will return a postcode.

### address_search

This is an alias for [location_search](location_search.md)

### version

This method returns the version number of the public gateway currently in use.

### revgeocoder

The [revgeocoder](revgeocoder.md) method returns the closest set of locations to a given longitude and latitude.

### add_message

The [add_message](add_message.md) method adds a message to the messages table. It is primarily designed for the use of "Contact us" forms or applications.

### report

The [report](report.md) method runs a custom SQL report and returns the results 

## get_parameters

The [get_parameters](get) method returns system parameters 

## add_asset

The [add_asset]() method adds details of an image or other binary uri to the database along with a uuid that can be used by a feature  to link to that asset

## get_asset

The [get_asset](get_asset.md) method retrieves the details relating to a previously stored asset.

## delete_asset

The [delete_asset](delete_asset.md) method deletes asset details from the database



## get_vector_tile

The get_vector_tile method creates a vector tile in Mapbox Vector Tile format.

## Returns

### success

A JSON structure containing the results of the method call and a response_code of 200

```json
{
  "response_code": 200,
  ...
}
```
### error

A JSON structure containing the route, an error message, a logid and a response code.

```json
{
  "error": "request could not be completed",
  "logid": 12908,
  "route": "public_api",
  "response_code": 600
}
```
