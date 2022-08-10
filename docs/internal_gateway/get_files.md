# get_files 

get_files retrieves a list of files from the database. These can be either files that have been uploaded, pending/processed api import/export files or download files that have been requested.

Be default files marked as "DELETED" are not retrieved

## Parameters

### status

Default: '*'
Type: Text

A filter on status that can be applied. Must be one of:-

- REGISTERED
- DELETED
- DOWNLOAD_REQUESTED
- DOWNLOAD_PROCESSED
- FARGATE_PROCESSING
- FARGATE_PROCESSED
- ERROR
- DELETED

### id

Default: NULL
Type: Integer

The id of a specific file to be retrieved

### filter

Default: NULL
Type: JSON (attribute filter)

An attribute filter to be applied to the retrieved list. For example to retrieve all files of type xlsx

```json
{
  "type" : "xlsx"
}
```

## Returns

A JSON structure with the "files" key pointing to an array of file attribute objects

```json
{
  "files": [
    {
      "id": 9,
      "status": "REGISTERED",
      "created": "2022-08-09T08:41:56.038291",
      "attributes": {
        "name": "File Foo",
        "type": "csv",
        "log_messages": [
          {
            "message": "File created",
            "timestamp": "09/08/2022 08:41:56"
          }
        ]
      },
      "last_update": "2022-08-09T08:41:56.038291"
    },
    {
      "id": 10,
      "status": "REGISTERED",
      "created": "2022-08-09T08:41:56.038291",
      "attributes": {
        "name": "File BAA",
        "type": "csv",
        "log_messages": [
          {
            "message": "File created",
            "timestamp": "09/08/2022 08:41:56"
          }
        ]
      },
      "last_update": "2022-08-09T08:41:56.038291"
    }
  ],
  "response_code": 200
}
```