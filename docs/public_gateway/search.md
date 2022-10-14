# search

The search method searches the global_search_view using the parameters provided by the user and returns the results in JSON format. This method is a wrapper for the following locaria search methods:-

- bboxsearch
- refsearch
- pointsearch
- datesearch
- filtersearch

These are provided as separate method calls to support GET pathways such as  /filtersearch /bboxsearch etc..


## Parameters

### acl

acl is injected into the parameters packet separately via the acl passed to the internal gateway. This is then used to restrict the search to return only those records allowed by the acl passed in.

### typeahead

Default: ''
Type: Boolean

If true then a [typeahead_search](typeahead_search.md) will be carried out using the parameters provided.

### precision

Default: 0.00001
Type: Float (degrees)

Used to set the precision of geometries returned by the search when the Datagrid format is requested. This is useful to reduce network traffic and packet size for large geojson objects. A precision > 0.00001 is rarely needed.

### cluster

Default: ''
Type: Boolean

If set to true will return the results as clustered geometries using the cluster function.

### format

Default: 'geojson'
Type: String

If set to datagrid will return results in a format suited for display using the React Datagrid control. Otherwise results are returned in geojson format.

### search_text

Default: ''
Type: String

Free text used to carry out a search. This can be any string or numeric along with the wildcard "*" to return everything. The text is used to create a plainto_tsquery structure in Postgres and use it to search the global_search_view in the description attribute.

### my_items

Default: ''
Type: String

If 'true' then the filter is set to return only items owned by the user. Note well this overwrites any filter sent into the search

### limit

Default: 10000
Type: Integer

Set a limit for the number of records returned. Cannot be increased beyond the value of 10,000 when called via the public gateway. Additional records must be retrieved by using a follow up call with an offset value.

### display_limit

Default: 10000
Type: Integer

A limit applied post search after all other filters for display purposes. For example if you only want to show 4 articles on a frint page.

Used in conjuction with the _order attribute stored in the data structure which can also be used for ordering:-

```json
{
  "data": {
    "_order" : 1
  }
}
```

### offset

Default: 0
Type: Integer

Offset the search results by the value supplied in order to support results paging in conjunction with a limit.

### location

Default: ''
Type: String in EWKT format using SRID 4326

A location to be used to centre the search when location_distance criteria are provided.

eg:

```
SRID=4326;POINT(-1.1,53.2)
```

### location_distance

Default: 1000 
Type: Integer (metres) OR string 

A distance used to constrain a search to within a set number of metres of the location provided. If set to "CONTAINS" then a search is done for features contained by the location_geometry provided

### reference

Default: ''
Type: String

A reference used to search the ref attribute of an item in the global_search_view used to retrieve items by known references, such as planning reference IDs etc...

### filter

Default: ''
Type: JSON

A filter used to constrain results which must be in json key/value format.

eg:-

```json
{
  "type" : "car",
  "make"  : "ford"
}
```

This will find all items with attributes that match the values for type and car.

### category

Default: '*'
Type: String or Array

Either a single category as a string or an array of categories to constrain the result set.

### bbox

Default: ''
Type: String formatted as 'xmax ymax, xmin ymin'

A bounding box in EPSG::4326 CRS used to constrain the search to a specific bounding box.

### start_date

Default: ''
Type: String in Date or Timestamp  format'DD/MM/YYYY HH24:MI:SS'

A start date to constrain a search. If the time portion is omitted then the time is set to midnight (ie the start of the day). The search functions on the start_date column of global_search_view

### end_date

### start_date

Default: ''
Type: String in Date or Timestamp  format'DD/MM/YYYY HH24:MI:SS'

An end date to constrain a search. If the time portion is omitted then the time is set to 23:59 minutes (ie: the end of the day). The search functions on the end_date column of global_search_view

### min_range

Default: ''
Type: Float

A minimum value for a numeric range search. This operates on the range_min column of the global_search_view

### max_range

Default: ''
Type: Float

A maximum value for a numeric range search. This operates on the range_max column of the global_search_view

### metadata

Default: true
Type: Boolean

If set to true then search item metadata is returned, otherwise false. The metadata is a json structure as follows:-

```json
{
  "edit" : true|false,
  "sd"  : start_date,
  "ed" : end_date,
  "rm" : range_min,
  "rma" : range_max,
  "acl" : { .. acl .. }
  
}
```

### tags

Default: []
Type: Json array of tags

Filter the search down to a set of tags

### ranking_attributes

Default: 'description,title'
Type: Text (representing a path to an attribute value)

Used to rank results higher using this specific attribute. So search results with search_text in this attribute are ordered higher up the list. In the example above we are looking at the title object within the description object. 

### jsonpath

Default: null
Type: Text

A jsonpath search query string conforming to https://www.postgresql.org/docs/12/functions-json.html

This operates on the data object of the items attributes

## Returns

### Datagrid format

A JSON structure with the following attributes:-

- count, the total number of features available to the search
- feature_count, the actual number of features returned (due to limit)
- features, an array of features in datagrid format with the following attributes
  - id
  - data
  - tags
  - text
  - title
  - category
  - geometry
  - description
- response_code 

```json
{
  "count": 14313,
  "features": [
    {
      "id": "02cbdb379d6bf3981d56aa3952a05a3e",
      "data": {
        "fhrsid": 253103,
        "ogc_fid": 645,
        "postcode": null,
        "ratingkey": "fhrs_5_en-GB",
        "ratingdate": "2021-07-05",
        "schemetype": "FHRS",
        "ratingvalue": "5",
        "addressline1": "Food Hall",
        "addressline2": "140 - 144 Great Western Outlet Vill",
        "addressline3": "1 - 144 Kemble Drive",
        "addressline4": "Rodbourne",
        "businessname": "KFC",
        "businesstype": "Takeaway/sandwich shop",
        "businesstypeid": 7844,
        "scores/hygiene": 0,
        "geocode/latitude": 51.5628093,
        "newratingpending": "False",
        "geocode/longitude": -1.7967136,
        "scores/structural": 0,
        "localauthoritycode": 881,
        "localauthorityname": "Swindon",
        "ratingdate/_xsi:nil": null,
        "localauthoritywebsite": "http://www.swindon.gov.uk/",
        "localauthoritybusinessid": "C48HSNGREA/2",
        "localauthorityemailaddress": "foodhealth&safety@swindon.gov.uk",
        "scores/confidenceinmanagement": 0
      },
      "tags": [],
      "text": "5",
      "title": "KFC",
      "category": "Food Hygiene",
      "geometry": {
        "type": "Point",
        "coordinates": [
          -1.7967136,
          51.5628093
        ]
      },
      "description": {
        "url": "",
        "text": "5",
        "title": "KFC"
      }
    }
  ],
  "feature_count": 2,
  "response_code": 200
}
```


