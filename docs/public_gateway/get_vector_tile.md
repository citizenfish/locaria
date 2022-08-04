# get_vector_tile

The get_vector_tile method creates a mapbox vector tile format tile for a given set of coordinates and a stored table configuration. It requires the parameter tileset to retrieve details of the table to be used to create the vector tile.

## Parameters

### tileset

Default: NULL
Format: Text

The name of the system parameter to be used to create the tilese

# x

The X coordinate of the vector tile

# y 

The Y coordinate of the vector tile

# z

The Z coordinate of the vector tile

## Returns

A json structure with a base64 encoded vector tile

```json
{
  "vt" : "124765467467",
  "response_code" : 200        
}
```