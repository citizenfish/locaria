# Moderation Process for adding data

If a category has the attribute

```json
{
  moderated_update: true
}
```

Then any items added to it will also add an item to the moderation_queue table

This applies to updates on the items as well

# Adding an item

When you add an item by default it has an acl as follows

```json
{
  view: [
    'Admins',
    'Moderators'
  ]
}
```

And so is not available to PUBLIC via search but Admins and Moderators can find it.

An item is added to the moderation queue these can be received via:-

```json
{
  method: 'get_moderation_items'
}
```

Which returns:-

```json
{
  "response_code": 200,
  "moderation_items": [
    {
      "id": 5,
      "fid": "6a7f996217f959cb7f9bc107967c06bd",
      "status": "RECEIVED",
      "created": "2022-09-13T14:37:52.113139",
      "attributes": {
        "id": "418",
        "type": "add",
        "table": "imports",
        "category": "LOCARIA_TEST_MOD",
        "category_id": 177
      }
    }
  ]
}
```

To make an item viewable send:-

```json
{ 
  method: update_item,
  moderation_id: 5 // (from the id in get_moderation_items call)
}
```

With acl:-

```json
{
  _newACL: {
    view: [
      'PUBLIC'
    ]
  }
}
```

This will update its acl and remove it from the moderation queue