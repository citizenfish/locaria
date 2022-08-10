# delete_parameters

The delete_parameters method deletes a parameter from the parameters table and writes the parameters passed to the history table

## Parameters

### parameter_name

Default: NULL
Type: Text

The name of the parameter to be deleted. 

### usage

Default: NULL
Type: Text

A usage filter to apply to the delete. If parameter_name is omitted then all parameters with this usage value will be deleted.

## Returns

A JSON structure with the id of the parameter deleted and details of the history record

```json
{
  "history": {
    "id": 611
  },
  "message": "delete success: test_1",
  "response_code": 200
}
```