# add_message

add_message stores a message in the messages table. Messages can be used to send email or attached to features as comments.

## Parameters

### message

Default: null
Type: JSON

A message to be added to the messages table

### attributes

Default: {'type' : 'contact'}
Type: JSON

A set of attributes to be added to the message. If the attribute send_email is set to true then a trigger will be run to send an email using the following attributes:-

- message.name (sender)
- message.email (sender)
- message.subject (subject)
- message.body (body of message)
The attribute email_type can be used to call other lambda processor other than the contact us mechanism

### parent_id

Default: NULL
Type: Integer

A linked message id used to create a hierarchy of messages.

## Returns

The id of the message created is returned

```json
{"id": 2, "response_code": 200}
```
