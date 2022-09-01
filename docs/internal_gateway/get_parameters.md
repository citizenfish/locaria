# get_parameters

This method retrieves one or many parameters from the parameters table

## Parameters

### parameter_name

Default: NULL
Type: Text

Name of the parameter to be retrieved

### usage

Default: NULL
Type: Text

A usage filter to apply to the returned results. If used without parameter_name will return all items that match that usage

### delete_key

Default: ''
Type: Text

An object key to delete from returned results. Used to minimise data transfer when only requiring summary details of a parameter.

### send_acl

Default: false
Type: Boolean

Return the parameter's acl in the _acl structure

## Returns

A JSON structure with the object key parameters holding a set of parameter objects 

```json
 {
  "parameters": {
    "test_1": {
      "data" : {
        "test_1": "10",
      },
      "last_updated" : "",
      "_acl" : {
        "view" : ["PUBLIC"],
        "update" : ["Admins"],
        "delete" : ["Admins"]
      }
    }
  },
  "response_code": 200
}
```
