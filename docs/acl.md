In order to allow the following operations:-

update
delete
moderate
we need to add an ACL mechanism to the global_search_view

At present the system is focus upon public presentation of data. This mechanism when combined with cognito will allow for selective viewing and editing of data. The use cases considered are:-

marking data for internal view only
tagging data with a group and allowing that group to add/edit/delete that data
allowing groups to add data to a specific category only and then facilitating subsequent moderation by a member of the moderators group
allowing individuals to comment upon data and edit/delete their comments
I propose that this is achieved using an acl structure within the metadata structure that already exists in the global_search_view. This has the advantage of using existing jsonb indexes and will not affect the current public workflows. row level security cannot be used for this as Postgres does not support its operation on views.

The acl will be structured as follows:-
```json
{
"owner" : <COGNITO_ID>,
"view" : [<COGNITO_GROUP_ID>,<COGNITO_GROUP_ID>,..],
"update" : [<COGNITO_GROUP_ID>,<COGNITO_GROUP_ID>,..],
"delete" : [<COGNITO_GROUP_ID>,<COGNITO_GROUP_ID>,..],
"moderate" : [<COGNITO_GROUP_ID>,<COGNITO_GROUP_ID>,..]
}
```

A missing attribute implies as follows:-

"owner" : "no individual ownership"
"view" : "available to all"
"update"/"delete"/"moderate" : cannot be updated/deleted/moderated