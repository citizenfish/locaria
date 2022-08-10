# update_file

update_file updates a file's attributes, status and last_update date. The method deals with log_messages in file attributes ensuring that they are appended to an existing array thus maintaining a full audit of operations carried out upon a file.

## Parameters

### log_messages

Default: []
Type: A JSON array of log message objects

log_messages are objects carrying processing information for the file and usually sent by batch processors. Each log_message has a timestamp added to it automatically.

### attributes

Default: {}
Type: A JSON object of attributes to add to the file's attributes

attributes are appended to the existing file attributes

### id

Default: NULL
Type: Integer

The file id of the file to be updated

### status

The new status of the file (if changed)

## Returns

A JSON structure containing the file id and the updated status

```json
{
  "id": 12,
  "status": "REGISTERED",
  "response_code": 200
}
```

