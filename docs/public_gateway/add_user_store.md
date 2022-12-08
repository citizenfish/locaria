# add_user_store

add_user_store adds or updates an entry in the user_store table linked to the _user_ID passed in the acl

## Parameters

### user_store

Default: {}
Type: JSON

A json structure to be stored, if the userID already exists then this will be appended.


## Returns

A json structure containing the userid passed in and details of inserts/updates carried out

```json
 {"insert": 0, "update": 1, "userid": "acl 1", "response_code": 200}
```