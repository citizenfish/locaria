#Overview

Locaria has the capability to provide map layers in Mapbox MVT vector tile format. These layers can be created from any data table in the system which must have the following columns:-

- wkb_geometry (4326)
- attributes (JSONB)

A tile is created using the function **locaria_core.get_vector_tile** which is passed the name of the tileset and x/y/z values.

The tileset name is looked up in the parameters table which must return a table name. This is then used to create the tiles using the functions:-

- xyz_tile_to_bbox, create a bounding box from X/Y/Z coordinates
- geometry_to_mvt, retrieve the geometry from the table and return as MVT with attributes

Currently only a single layer is supported in the tiles

# Setting up a tileset

## Step one data

Create a table or view with a geometry and attributes column. For example the following creates a view for census data:-

```sql
CREATE OR REPLACE VIEW locaria_tests.census_data_output_areas AS
            SELECT
                   wkb_geometry,
                   row_to_json(OA.*)::JSONB - 'wkb_geometry' AS attributes
        FROM locaria_data.census_data_output_areas OA;
```

## Step two parameters

Add a parame