# get_user_store

get_user_store retrieves an entry from the user_store table linked to the _user_ID passed in the acl

## Parameters

### path

Default: ''
Type: TEXT

A comma delimited path to the object in the json structure required (default entire structure is returned)

eg:-

```json
{
  "foo" : {"baa" :  "wibble"}
}
```

path = 'foo' will return 

```json
{"baa" :  "wibble"}
```

## Returns

A json structure containing the attributes

```json
 {"foo2": "baa2", "response_code": 200}
```