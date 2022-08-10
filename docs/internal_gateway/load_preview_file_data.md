# load_preview_file_data

This method loads data into the table locaria_data.imports and as such makes it available to the global_search_view. Data is mapped into the correct format using the [preview_file_data](preview_file_data.md) function.

The method is designed to be called multiple times until all data for a file is loaded. This allows for parallel processing and also shorter wait times as a maximum of 5000 records can be loaded in any single call.

The first call made sets the parameters for the import, subsequent calls read this from the file record itself.

## Parameters

The first call accepts the parameters of [preview_file_data](preview_file_data.md)  along with the following.

### id

Default: -1
Type: Integer the id of tht file to be loaded

### category

Default: null
Type: Text

The category to apply to the loaded data

## Returns

A json structure with:-

- status IMPORTING if another call is required or IMPORTED if all records are done
- processed number of records processed this call
- category_id the category id allocated to the data
- record_count the number of records in the file

```json
{
  "status": "IMPORTED",
  "processed": 2,
  "category_id": 164,
  "record_count": 0,
  "response_code": 200
}
```



