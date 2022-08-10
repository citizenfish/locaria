# get_moderation_items

The get_moderation_items method retrieves items from the moderation queue that are pending authorisation.

## Parameters

No parameters are required

## Returns

A json structure with the moderation_items object key holding an array of moderation items

```json
{
  "response_code": 200,
  "moderation_items": [
    {
      "id": 9,
      "fid": "5ce61020c5d4c81cf1ffdb93dd110fd3",
      "status": "RECEIVED",
      "attributes": {
        "moderate": "test"
      }
    },
    {
      "id": 34,
      "fid": "738d08270921acaff90362c42de8f126",
      "status": "RECEIVED",
      "attributes": {
        "acl": {
          "_groups": [
            "Admins"
          ]
        },
        "method": "update_item",
        "geometry": "SRID=4326;POINT(-1.3 54.2)",
        "attributes": {
          "new_update": "true"
        },
        "search_date": "2022-07-01"
      }
    },
    {
      "id": 35,
      "fid": "4c1d7119071088bc9821dad16ee61eb8",
      "status": "RECEIVED",
      "attributes": {
        "acl": {
          "_groups": [
            "Admins"
          ]
        },
        "method": "update_item",
        "geometry": "SRID=4326;POINT(-1.3 54.2)",
        "attributes": {
          "new_update": "true"
        },
        "search_date": "2022-07-01"
      }
    }
  ]
}

```