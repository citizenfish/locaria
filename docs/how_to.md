# Important Warnings

LOCUS depends upon two key views within the Postgres database. The **global_search_view** and **search_views_union**

Both views are maintained and refreshed periodically by the **scraper** batch process. This uses a custom SQL snippet to refresh the materialized view.

It is IMPORTANT that any view in the search_views_union view is not deleted without recreating the global_seach_view. The reason is that the delete must be cascaded which in turn will remove the global_search view.

If you wish to remove a view it is better to update it with null values. eg:-

```SQL
CREATE OR REPLACE VIEW locus_core.planning_applications AS
SELECT 0 AS id,
       NULL AS wkb_geometry,
       NULL AS date_added,
       NULL AS category,
       NULL AS attributes;

SELECT locus_core.search_view_union();
```

This will have the same outcome but will not remove the global_search_view.

## Import data into LOCUS 

Firstly create a table in the locus_core schema to hold your data. This MUST have a PRIMARY KEY called **nid** which is of type BIGINT. This is used when importing data subsequently into this table to decide whether it is a new or existing record.


```SQL
CREATE TABLE locus_core.my_new_data_table (
       nid BIGINT PRIMARY KEY
) INHERITS (locus_core.base_table);
```

This will create a table with the column structure reflecting the system vase_table. Data can now be added as follows:-

```SQL
INSERT INTO locus_core.my_new_data_table(nid, attributes, wkb_geometry, category)
SELECT 1234,
	   jsonb_build_object('title', 'Item title', 
			      'description', 'Item description text',
			      'other_data', '2434'),
	   ST_GEOMFROMEWKT('SRID=4326;POINT(-1 51)'),
	   ARRAY['Events']::locus_core.search_category[]
```

Each data item should have:-

- a unique nid
- an attributes column in JSONB format
- a geometry in EPSG:4326 CRS
- one or more categories, cast to locus_core.search_category


## Add existing PostgreSQL data 

Existing postgres data can be added via the use of views. The following example imports data from a table of car parks:-

```SQL

CREATE OR REPLACE VIEW locus_core.car_parks AS
SELECT distinct on (id_0) id_0 as id,
       ST_Transform(geom, 4326) AS wkb_geometry,
       now() as date_added,
       ARRAY['Highways and Transport']::locus_core.search_category[] AS category,
       jsonb_build_object('title', name, 'description', name, 'table', tableoid::regclass::text) AS attributes
FROM locus.shbc_carparks_locus;
```

As can be seen the structure is similar to that of the data imported directly but it is very important that the source table name is included in the attributes structure to facilitate retrieval of the data in full following a search query. This can be done automatically as shown above by adding the attribute:-

```json
'table', tableoid::regclass::text
```

## Add data via JSON API 

LOCUS comes with a utility function that will load data from a http/https endpoint on a regular basis. This is controlled by a set of application parameters that define the url and how to load the data. The example below loads data for weather stations in a defined distance from a set location:-

Firstly we create a table to hold the data once imported:-
```SQL
CREATE TABLE locus_core.flood_warning (
       nid BIGINT PRIMARY KEY
) INHERITS (locus_core.base_table);
```

Next we set up the import:-
```SQL
INSERT INTO locus_core.parameters(parameter_name, parameter)
SELECT 'json_sources',
       jsonb_build_object(
        'locus_core.events',
            jsonb_build_object(
                               'url', 'https://www.surreyheath.gov.uk/events-json',
                               'sql', $SQL$

                                        INSERT INTO locus_core.events(nid,attributes, wkb_geometry, category)
                                        SELECT (($1::JSONB)#>>'{event,nid}')::BIGINT,
                                               (($1::JSONB)->'event') || jsonb_build_object('description', ($1::JSONB)#>>'{event,event_details}'),
                                               locus_core.opennames_postcode_geocoder(($1::JSONB)#>>'{event,venue}'),
                                               ARRAY['Events']::locus_core.search_category[]
                                        ON CONFLICT (nid) DO UPDATE
                                        SET attributes = (($1::JSONB)->'event') || jsonb_build_object('description', ($1::JSONB)#>>'{event,event_details}'),
                                                         wkb_geometry = locus_core.opennames_postcode_geocoder(($1::JSONB)#>>'{event,venue}')

                                       $SQL$,
                               'json_key', 'events',
                               'last_run', now())
     );
```

This creates a parameter called "json_sources" which is an array of objects with a single object per import. The object consists of:-

- a key which must be unique (table name recommended)
- a url to retrieve json from
- a json_key which tells us which key in the retrieved json contains our records
- an SQL statement to take each JSoN record and load it into the table.

The SQL is passed each JSON record as the $1 placeholder. It must then use this to create a unique id (nid) a geometry in EPSG:4326 CRS and an attributes structure with title and description. The SQL above does an UPSERT using the ON CONFLICT mechanism. This will update the record if the nid already exists. 

Alos note the use of the locus_core.base36_decode() function to take an alphanumeric key and convert it to an integer.

This process is called every 10 minutes. The last_run object is used to queue each in turn. The system will pull the items in order of when updated and execute the last first

Parameters can be added to the url which is useful for APIS such as the crime data which requires a year and month. Data is usually only available two months prior. This can be acheived by adding the url as:-

```
https://data.police.uk/api/crimes-street/all-crime?poly=51.39372,-0.64394:51.37079,-0.74210:51.33331,-0.78027:51.27808,-0.73535:51.27794,-0.69469:51.31108,-0.68399:51.30929,-0.64500:51.31839,-0.61879:51.33036,-0.62176:51.33350,-0.57309:51.34777,-0.54477:51.36367,-0.55142:51.39423,-0.61150&date=CRIME-DATE

```

The CRIME-DATE part of the URL will be substituted with current year and 2 months previously (eg: 2019-10)

These substitutions can be added to the function **locus_core.get_json_data_urls**

## Add or amend categories

Categories are defined using a system type called locus_core.search_category. 

A new category can be added with:-

```SQL
ALTER TYPE locus_core.search_category ADD VALUE 'NEW CATEGORY'
```

Categories cannot be removed without redefining the type and reloading existing data


