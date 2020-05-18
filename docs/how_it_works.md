# LOCUS Technical Detail

##System Structure

LOCUS is installed into a single schema within a PostgreSQL database. This schema is named **locus_core** and contains all views, types and functions required to operate the search and retrieval API. The overall structure is as follows:-


- locus_core
    - materialised views
        - global_search_view 
    - views
        - search_view_union
            - view1
            - view2
            - etc....
    - tables
        - base_table
            - data_table1 
            - data_table2
            - etc....
        - parameters
        - logs
        - opennames       
    - functions
        - locus_gateway 
        - search
        - get_item
        - search_views_union
        - opennames_postcode_geocoder
        - base36_decode
    - types
        - search_categories  
        

## Single search view -  **global_search_view**

**global_search_view** is a materialized view that holds all data to be searched. It is defined within the **locus_core** schema and must be present and full of data for LOCUS to operate quickly. The view is materialised which means that it holds its own copy of LOCUS data. This data has been optimised for full text searching and categorisation. 

**global_search_view** is created by the SQL contained within **[configuration/schema_and_views/create_search_views.sql](../configuration/functions/create_search_views.sql)**   

The view is constructed of the following data items:-

- a unique id for each data item contained within
- a geometry (currently a point geometry in EPSG::4326 CRS)
- a category
- a weighted text search vector to support full text searching
- date item was added
- a set of attributes (in JSON format) including:-
    - url
    - title
    - description
    - source data table
    
It is basically a subset of the LOCUS data environment, optimised for searching and normalised. The view is indexed using the geometry (to support spatial queries) and the text search vector (to support full text queries). An additional index is created on the unique id, this is necessary to support the refreshing of data within the view whilst other users are accessing it concurrently.

**global_search_view** pulls its data from two sources:-

- base_table <- a table within the locus_core schema from which other data tables can inherit
- search_views_union <- a consolidated view of all views that are feeding data into the LOCUS environment

 ## Base Table - base_table
 
 The Base table provides a template for data that is imported directly into LOCUS. This table can be inherited by other tables and as a result the data will automatically become visisble to the global_search_view.
 
 Loading data into an inherited table is the easiest way to get data into LOCUS as the inheritance will ensure that the data conforms to the global_search_view schema. Inheritance allows for the querying of all inherited tables from a single point. It also gives flexibility in table design as changes to the base_table will automatically filter down to those tables that have inherited from it.
 
## Search views union - search_views_union

The search_views_union view consolidates all views that are providing data into LOCUS into a single view for ease of management. A view is basically a "window" upon one or many database tables. It allows a table that does not conform to LOCUS data schema to be imported via a single SQL statement.

A search view must adhere to the following structure:-

```SQL
(
    id BIGINT,
    wkb_geometry GEOMETRY(4326),
    date_added TIMESTAMP,
    category locus_core.search_category,
    attributes JSONB
    
)
```

The attributes structure must be formatted as :-

```json
{
"title" : "<title>",
"description" : "<description",
"table" : "<table schema>.<table name>"

}
```
For example:-

If we had the table "planning" defined as follows:-  

```SQL
CREATE TABLE planning (

    id INTEGER,
    title TEXT,
    description TEXT,
    lat TEXT,
    lon TEXT,
    url TEXT,
    date_of_app DATE,
    time_of_app TIME,
    other_information TEXT,
);    
```

We can create a view that conforms to the LOCUS schema as follows:-

```SQL
CREATE VIEW locus_core.planing_view AS
SELECT
        distinct on (id) id,
        ST_GEOMFROMEWKT('SRID=4326;POINT'||lon||' '||lat||')') AS wkb_geometry,
        (date || ' ' || time)::TIMESTAMP AS date_added,
        ARRAY['Planning'] AS category,
        jsonb_build_object('title', title, 'description', description, 'table', tableoid::regclass::text) AS attributes
FROM planning;
``` 

This view is added to the search_views_union view by running the function  **search_view_union** as follows:-

```SQL
SELECT locus_core.search_view_union();
```  

This function will add any view in the locus_core schema to the global_search_view. Views can be ommitted from this view via the addition of a system parameter:-

```sql
INSERT INTO locus_core.parameters(parameter_name, parameter)
SELECT 'excluded_view_tables',
	   json_build_array('ignore_this_table');
```

##Search API locus_gateway()

The LOCUS search api is implemented within the database via a single calling function **locus_gateway()**. The function is passed a list of parameters formatted as JSON. These are:-

```json
{
"method" : "search|bboxsearch|get_item|list_categories|version",
"search_text" : "<text to search for>",
"category" : "category1,category2,category3",
"offset" : 0,
"limit" : 100,
"bbox" : "xmax ymax, xmin ymin",
"location" : "SRID=4326;POINT(-1, 50)",
"debug" : "true|false"
}
```

The **method** parameter is used to decide which API function to call. These functions are either separate functions within the locus_core schema or a direct return.

The search api will return data in json format. Data containing geometries is returned as GeoJSON. Data is always returned in the EPSG:4326 co-ordinate reference system.

### Search logging

Search packets can be logged within a system **logs** table. This is useful for either debugging purposes or carrying out analytics to work out what are the most popular categories and/or search topics. Logging is switchedon by default but can be disabled by adding a system parameter as follows:-

```sql
INSERT INTO locus_core.parameters(parameter_name, parameter)
SELECT 'log_configuration',
	   json_build_object('log_searches', 'false);

```


                