#Locaria "add" and moderation

items in global_search_view are restricted by _group only

**add_item** adds an item to a core table and it will be available on request

**add_to_moderation_queue** adds an item into a queue to be moderated

**get_moderation_items** gets items awaiting moderation

**update_moderation_status** allows an item in moderation queue to have its status changed

**update_item** will put anything with moderated_update flag into the moderation queue

get_item will return any pending moderations for an item that has records in the moderation queue

So process appears to be as follows:-

Adding items

Add an item with **add_item** and set its _group to be that of moderators/administrators, that way only they can see it. Add tag “Awaiting Moderation”

search using their _group and tag “Awaiting moderation”

To approve:
update item remove _group and tag

To delete:
delete item

Allowing comments

**update_item** will automatically add a record to the **moderation_queue**

moderators retrieve these records with **get_moderation_items**

if happy then they copy attributes and update using update_item then use update_moderation_status to set status to anything bar RECEIVED

otherwise update_moderation_status to set status to REFUSED

#History

- add_item
- update_item
- delete_item

All call **add_history** and add a record to the history table with in_view FALSE

**view_report** lists the pending update/add/deletes

**refresh_view** calls update_history and sets these all to TRUE








