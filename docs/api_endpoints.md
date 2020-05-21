#Overview

LOCUS provides an api accessible over http/https. The api has endpoints for GET and POST calls.

All of these endpoints will be accessible from a single URL which you will configure when installing LOCUS. For this document we refer to this as https://URL/

**STAGE** refers to the stage that was deployed to Amazon, usually "test" or "live"

All endpoints return data/errors in JSON format

## GET Endpoints

### Get API Version

Call:-

```bash
https://URL/STAGE/version

```

Response:-

```json

{"version":"0.1"}
```

## List LOCUS Categories

Call:-

```bash
https://URL/STAGE/list_categories

```

Response:-

```json
["General","Events","Community","Planning","Democracy","Education","Health","Highways and Transport","Waste and Recycling","Environment","NEW CATEGORY"]
```

## Search and Retrieve by category

This call will retrieve all items in a specified category. A default limit of 100 items is used. This can be overridden by chaning the variable **default_limit** in the function search.sql

Call:-

```bash
https://URL/STAGE/search/<CATEGORY>

eg:-

https://URL/STAGE/search/Waste and Recycling

```

A wildcard can be used for all categories:-

```bash
https://URL/STAGE/search/*
```

The response is returned in GeoJSON format, for example:-

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "fid": "071e8c0caea5b3d491cfbdb910e599db",
        "ofid": 5,
        "title": "Chobham Rugby Club, Windsor Road, Chobham, GU24 8LD",
        "category": [
          "Waste and Recycling"
        ],
        "description": "Recycling centre glass bottles and jars ONLY"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -0.603745128713994,
          51.3530929860418
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "fid": "25962747576897227bf7c0c5718493fe",
        "ofid": 16,
        "title": "Wharf Road Car Park, Wharf Road, Frimley Green,  GU16 6LE",
        "category": [
          "Waste and Recycling"
        ],
        "description": "Recycling centre books & CDs/DVDs (BHF); textiles (LMB) & shoes (Variety Club)"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -0.726371990063884,
          51.3025462417603
        ]
      }
    }
  ]
}

```

A search text filter can be applied to this call by appending a search string:-

Call:-

```bash
https://URL/STAGE/search/Waste and Recycling/Frimley
```

A limit can be applied by appending an integer to the search test:-

```bash
https://URL/STAGE/search/Waste and Recycling/Frimley/1
```

An offset can be applied by appending an integer to the limit:-

```bash
https://URL/STAGE/search/Waste and Recycling/Frimley/1/4
```

##Search and retrieve by bounding box

A bounding box search is similar to a standard search but uses a bounding box to restrict items retrieved by geographical area. The parameters are sent in exactly the same order as per a normal search but the url is preceeded with a bounding box formatted as follows:-

```
xmax ymax, xmin ymin
```

The bounding box co-ordinates must be in EPSG:4326 Coordinate reference system format.

Call:-

```
https://URL/STAGE/bboxsearch/<BBOX><CATEGORY>

eg:-

https://URL/STAGE/bboxsearch/-0.8 51.3,-0.7 51.4/*

```

A search text filter can be applied to this call by appending a search string:-

Call:-

```bash
https://URL/STAGE/bboxsearch/-0.8 51.3,-0.7 51.4/Waste and Recycling/Frimley
```

A limit can be applied by appending an integer to the search test:-

```bash
https://URL/STAGE/bboxsearch/-0.8 51.3,-0.7 51.4/Waste and Recycling/Frimley/1
```

An offset can be applied by appending an integer to the limit:-

```bash
https://URL/STAGE/bboxsearch/-0.8 51.3,-0.7 51.4/Waste and Recycling/Frimley/1/4
```

##Reference search

A reference search uses a reference or unique ID to narrow the search down to a particular address or data point. This can be a UPRN, USRN or other identifier that has been added to the data.

Call:-

```
https://URL/STAGE/refsearch/{reference}
```

Variables can be added to this endpoint as follows:-

```
https://URL/STAGE/refsearch/{reference}/{category}
https://URL/STAGE/refsearch/{reference}/{category}/{limit}
https://URL/STAGE/refsearch/{reference}/{category}/{limit}/{offset}
```

##Location search

A location search uses a specific location to narrow the search down within a specified distance from that location. Location is specified as a EWKT point geometry. Distance is specified in metres.

Call:-

```
https://URL/STAGE/pointsearch/{location}/{location_distance}

eg:-

https://URL/STAGE/pointsearch/SRID=4326;POINT(-0.6357175552859%2051.3249957893552)/1000
```

Variables can be added to this endpoint as follows:-

```
https://URL/STAGE/pointsearch/{location}/{location_distance}/{category}
https://URL/STAGE/pointsearch/{location}/{location_distance}/{category}/{search_text}
https://URL/STAGE/pointsearch/{location}/{location_distance}/{category}/{search_text}/{limit}
https://URL/STAGE/pointsearch/{location}/{location_distance}/{category}/{search_text}/{limit}/{offset}
```

##Date search

A date search uses a set of dates to narrow the search down to a particular date range. Dates are specified in YYYY-MM-DD format.

Call:-

```json
https://URL/STAGE/datesearch/{start_date}/{end_date}/{category}
```

Variables can be added to this endpoint as follows:-

```json
https://URL/STAGE/datesearch/{start_date}/{end_date}/{category}/{search_text}
https://URL/STAGE/datesearch/{start_date}/{end_date}/{category}/{search_text}/{location}/{location_distance
```



## POST Endpoints

### POST API Version

Call:-

```bash
https://URL/STAGE/version
Body: {}

```

Response:-

```json

{"version":"0.1"}
```

## List LOCUS Categories

Call:-

```bash
https://URL/STAGE/list_categories
Body: {}
```

Response:-

```json
["General","Events","Community","Planning","Democracy","Education","Health","Highways and Transport","Waste and Recycling","Environment","NEW CATEGORY"]
```

## Search and Retrieve by category

This call will retrieve all items in a specified category. A default limit of 100 items is used. This can be overridden by chaning the variable **default_limit** in the function search.sql

Call:-

```bash
https://URL/STAGE/search

Body: { "category": "Waste and Recycling" }

```

A wildcard can be used for all categories:-

```bash
Body: { "category": "*" }
```

The response is returned in GeoJSON format, for example:-

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "fid": "071e8c0caea5b3d491cfbdb910e599db",
        "ofid": 5,
        "title": "Chobham Rugby Club, Windsor Road, Chobham, GU24 8LD",
        "category": [
          "Waste and Recycling"
        ],
        "description": "Recycling centre glass bottles and jars ONLY"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -0.603745128713994,
          51.3530929860418
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "fid": "25962747576897227bf7c0c5718493fe",
        "ofid": 16,
        "title": "Wharf Road Car Park, Wharf Road, Frimley Green,  GU16 6LE",
        "category": [
          "Waste and Recycling"
        ],
        "description": "Recycling centre books & CDs/DVDs (BHF); textiles (LMB) & shoes (Variety Club)"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -0.726371990063884,
          51.3025462417603
        ]
      }
    }
  ]
}

```

A search text filter can be applied to this call by appending a search string:-

Call:-

```bash
https://URL/STAGE/search

Body: { "category": "Waste and Recycling", "search_text":"Frimley" }
```

A limit can be applied by appending an integer to the search test:-

```bash
https://URL/STAGE/search

Body: { "category": "Waste and Recycling", "search_text":"Frimley", "limit":1 }

```

An offset can be applied by appending an integer to the limit:-

```bash
https://URL/STAGE/search

Body: { "category": "Waste and Recycling", "search_text":"Frimley", "limit":1, "offset": 4 }

```

##Search and retrieve by bounding box

A bounding box search is similar to a standard search but uses a bounding box to restrict items retrieved by geographical area. The parameters are sent in exactly the same order as per a normal search but the url is preceeded with a bounding box formatted as follows:-

```
xmax ymax, xmin ymin
```

The bounding box co-ordinates must be in EPSG:4326 Coordinate reference system format.

Call:-

```
https://URL/STAGE/bboxsearch

eg:-

Body: { "bbox": "-0.8 51.3,-0.7 51.4", "category":"*" }


```

A search text filter can be applied to this call by appending a search string:-

Call:-

```bash
https://URL/STAGE/bboxsearch

Body: { "bbox": "-0.8 51.3,-0.7 51.4", "category":"*", "search_text":"Frimley" }

```

A limit can be applied by appending an integer to the search test:-

```bash
https://URL/STAGE/bboxsearch

Body: { "bbox": "-0.8 51.3,-0.7 51.4", "category":"*", "search_text":"Frimley", "limit":1 }

```

An offset can be applied by appending an integer to the limit:-

```bash
https://URL/STAGE/bboxsearch

Body: { "bbox": "-0.8 51.3,-0.7 51.4", "category":"*", "search_text":"Frimley", "limit":1, "offset":4 }
```

##Search and retrieve by reference

A reference can be used to narrow to the search to a specific reference such as a UPRN,USRN or other custom reference field added to the data.

Call:-

```
https://URL/STAGE/refsearch

eg:-

Body: { "reference": "12345"}


```

Ths POST call supports the following variables:-

- search_text
- category
- limit
- offset
- location
- location_distance
- bbox

##Search and retrieve by location/distance

A location can be used to narrow to the search to a specific location and a distance from that location specified in metres (default 1000 metres).

Call:-

```
https://URL/STAGE/pointsearch

eg:-

Body: { "location": "SRID=4326;POINT(-0.6357175552859%2051.3249957893552)", "location_distance" : "3000"}


```

Ths POST call supports the following variables:-

- search_text
- category
- limit
- offset

##Search and retrieve by date

A date range  can be used to narrow down results with dates between a specific range:-

Dates must be in YYYY-MM-DD format

Call:-

```
https://URL/STAGE/datesearch

eg:-

 { "search_text" : "Waitrose:, 
   "category"    : "Waste and Recycling",
   "start_date"  : "2019-12-18",
   "end_date"    : "2019-12-18"
```

Ths POST call supports the following variables:-

- search_text
- category
- limit
- offset
- location
- location_distance