# preview_file_data

This method is used when loading data to get a preview as to how the data will be formatted when loaded into the global_search view. The method will retrieve data from any table in the schema **locaria_uploads** it attempts to find the following fields in the loaded data:-

- title
- text
- url
- tags

These are then mapped onto a standard structure that represents the attributes in global_search_view

The mappings can be altered via parameters, the idea being that they can be set from a mapping screen to fine tune the load process and get data in the right places.

## Parameters

### table

Default: ''
Type: Text

The name of the table in locaria_uploads to be previewed

### title_field

Default: 'THISWILLFAIL'
Type: Text

The name of the column carrying the title of the data loaded

### text_field

Default: 'THISWILLFAIL'
Type: Text

The name of the column carrying the text description of the data loaded

### url_field

Default: 'THISWILLFAIL'
Type: Text

The name of the column carrying the url field of the data loaded

### tag_field

Default: 'THISWILLFAIL'
Type: Text

The name of the column carrying the tag items of the data loaded

### override_geometry

Default: false
Type: Boolean

Use an internal geocoder for geometry rather than that created in the table

### geocoder_type

Default: ''
Type: Text

One of:-

- full_text_postcode
- postcode
- lonlat
- osgrid

To select the geocoder to be used for data preview

### limit

Default: 10
Type: Integer

The number of items to return in preview

### offset

Default: 0
Type: Integer

An offset to be applied when returning data

### postcode_field

Default: 'postcode'
Type: Text

The name of the attribute containing the postcode

### x_field

Default: ''
Type: Text

The name of the field carrying the geometry X value

### y_field

Default: ''
Type: Text

The name of the field carrying the geometry Y value

## Returns

```json
{
  "items": [
    {
      "id": 1,
      "url": "https://foo.com/baaa",
      "data": {
        "lat": 53.2,
        "lon": -1.4,
        "url": "https://foo.com/baaa",
        "tags": [
          "foo",
          "baa"
        ],
        "text": "TEST TEXT 1",
        "title": "TEST TITLE 1",
        "ogc_fid": 1
      },
      "tags": [
        "foo",
        "baa"
      ],
      "text": "TEST TEXT 1",
      "title": "TEST TITLE 1",
      "geometry": {
        "type": "Point",
        "coordinates": [
          -1.2,
          54.2
        ]
      }
    },
    {
      "id": 2,
      "url": "https://foo2.com/baaa2",
      "data": {
        "lat": 53.2,
        "lon": -1.4,
        "url": "https://foo2.com/baaa2",
        "tags": [
          "foo2",
          "baa2"
        ],
        "text": "TEST TEXT 2",
        "title": "TEST TITLE 2",
        "ogc_fid": 2
      },
      "tags": [
        "foo2",
        "baa2"
      ],
      "text": "TEST TEXT 2",
      "title": "TEST TITLE 2",
      "geometry": null
    }
  ],
  "data_keys": [
    "lat",
    "lon",
    "url",
    "tags",
    "text",
    "title",
    "ogc_fid"
  ],
  "response_code": 200
}
```


