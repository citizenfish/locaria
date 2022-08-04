# location_search

The location search returns attributes and geometry for locations matching a search query in text format. The locations are looked up in the location_search_view.

## Parameters

### limit

Default: 10
Type: Integer

A limit on the number of features returned, cannot be increased above 10 items

### offset

Default: 0 
Type: Integer

An offset allowing the next page of results to be retrieved beyond the fixed limit

### location

Default: ''
Type: Text

The text search string to be used for the location search

### address

An alias for location


## Returns

A set of matching locations in geojson format 

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          -3.5771406950267792,
          50.89776898222999
        ]
      },
      "properties": {
        "rank": 0.075990885,
        "address": "1X The road, Town, County, XX1 1XA",
        "postcode": "XX1 1XA",
        "featureType": "location"
      }
    }
  ],
  "response_code": 200
}
```