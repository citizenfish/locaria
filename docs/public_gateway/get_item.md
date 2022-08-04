# get_item

The get_item method retrieves all of the attributes for an item stored within the live and pending data views.The method operates on either the [global_search_view](../locaria_data_views/materialised_views/global_search_view.md) or the [global_search_view_live](../locaria_data_views/views/global_search_view_live.md). 

get_item includes an acl check via the function [locaria_core.acl_check](../../database/functions/utility/acl_check.sql) to ensure that the user has the required access to the item.

## Parameters

## live

Default: 'false'
Type: Boolean

If set to false then retrieve the item from the [global_search_view](../locaria_data_views/materialised_views/global_search_view.md) by searching for the supplied _identifier in the fid column

If set to true then retrieve the item from the [global_search_view_live](../locaria_data_views/views/global_search_view_live.md) by searching for the supplied _identifier in the fid column additionally append any items for this fid that appear in the moderations queue with status RECEIVED 

## acl

The acl is appended to parameters automatically via the calling function. 

A user must have moderator privileges on the item in order to retrieve it from the live view.

A user must have view privileges on the item in order to retrieve it from the search view

## fid

Default: ''
Type: Text

The fid used to retrieve the item from the fid column of the requested view. Must not be sent if the _identifier attribute is to be used instead

## _identifier

Default: ''
Type: Text

An alternative to the fid to retrieve an item via its own fixed identifier stored in the data structure and named identifier, eg:-

```json
{
  "data": {
    "_identifier" : "foo"
  }
}
```
## Returns

The get_item call returns a single feature in geojson format. If the live view is selected then any moderations that are pending are supplied as a JSON array representing record structure of the moderations table.

```json
{
    "type": "FeatureCollection",
    "features":
    [
        {
            "type": "Feature",
            "geometry":
            {
                "type": "Point",
                "coordinates":
                [
                    -3.537229663,
                    50.374909122
                ]
            },
            "properties":
            {
                "acl":
                {
                    "view":
                    [
                        "3"
                    ],
                    "owner": "acl 3"
                },
                "fid": "e76d29bd58b19beec78e4cb454163349",
                "ref": "",
                "data":
                {
                    "images":
                    []
                },
                "ofid": 41,
                "tags":
                [],
                "_live": false,
                "table": "locaria_data.test_acl",
                "category": "acl_test",
                "description":
                {
                    "text": "acl 3",
                    "type": "test"
                },
                "_moderations":
                []
            }
        }
    ],
    "response_code": 200
}
```


