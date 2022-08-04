# revgeocoder

Returns the closest locations and their distance from  a supplied longitude and latitude. Locations are retrieved from the location_search_view

## Parameters

### lon

Default: null
Type: Float (WGS84 longitude)

The longitude of the point to be searched from

### lat

Default: null
Type: Float (WGS84 longitude)

The latitude of the point to be searched from

### limit

Default: 15
Type: Integer

A limit on the number of features returned, cannot be increased above 15 items

### offset

Default: 0
Type: Integer

An offset allowing the next page of results to be retrieved beyond the fixed limit

## Returns

A set of locations in geosjon format with the attribute distance_rank added (measure in metres)

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
        "address": "1X The road, Town, County, XX1 1XA",
        "postcode": "XX1 1XA",
        "distance_rank": 7.67063944
      }
    }
  ],
  "response_code": 200
}
```