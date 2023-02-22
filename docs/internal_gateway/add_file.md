# add_file

The add_file method registers a file with locaria and returns an id. The following types of file are currently processed by locaria:-

- uploads <- data to be added to locaria
- downloads <- data downloaded from locaria
- api calls <- data imported into locaria via an api call

## Parameters

### file_attributes

Default: {}
Type: A JSON structure of file attributes. 

More details are available in the [file_loader](../../../locaria_private/docker/file_loader/file_loader.md) documentation

## Returns

The id and status of the file created.

```json
 {
  "id": 12,
  "status": "REGISTERED",
  "response_code": 200
}
```