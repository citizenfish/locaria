# get_parameters

The get_parameters method returns an structure of JSON structures from the parameters table of the database. It is used to retrieve individual parameters by name or a set of parameters by usage type.

## Parameters

### parameter_name

Default: NULL
Type: Text

Name of the parameter to be retrieved

### usage

Default: NULL
Type: Text

The usage category of parameters to be retrieved. This can be used with parameter_name to have a set of parameters with the same name but different usages or on its own to return a specific usage set.

### delete_key

Default: NULL
Type: Text

The name of a json object key to delete from the returned parameter. This is useful to reduce network traffic, for example when receiving summary information from a large parameter

## Returns

A json object is returned with the parameters key holding an object with the parameter_name being the key to the parameter values

```json
{
  "parameters": {
    "test_1": {
      "test_1": "10"
    }
  },
  "response_code": 200
}
```
