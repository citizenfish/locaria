# set_parameters

The set_parameters method adds or updates a parameter within the parameters table. If the parameter exists already it is updated if not it is created. If _newACL is not passed then a default ACL is added as follows:-

```json
{
  "update" : ["Admins"],
  "delete": ["Admins"]
}
```

A history record is written with the parameters passed to the call

## Parameters

### parameter_name

Default: NULL
Type: Text

Name of the parameter to add or update

### usage

Default: SYSTEM
Type: Text

The parameter's usage tag

## Returns

A JSON structure with the parameter id

```json
{
  "id": 84,
  "history": {
    "id": 598
  },
  "response_code": 200
}
```