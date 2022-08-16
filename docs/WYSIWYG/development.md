# Proposed format for MD processor

## MD examples we must cope with

```markdown
# Heading
&STYLE1&## Heading2

A paragraph

{"color":"red"}Danger

----------

A paragraph with a [link](http://foo.com) and some other text **bolded**

%NavTypeSimple param1="foo" param2={"bar"}%

```

## Structure

```javascript
[
	{
		"type":"h1",
		"children":[
			{ "text":"Heading" }
		]
	},
	{
		"type":"h2",
        "style":"STYLE1",
		"children":[
			{ "text":"Heading2" }
		]
	},
	{
		"type":"br"
	},
	{
		"type":"p",
        "children":[
			{ "text":"A paragraph" }
        ]
    },
	{
		"type":"p",
        "sx":{"color":"red"},
		"children":[
			{ "text":"Danger" }
		]
	},
	{
		"type":"divider"
	},
	{
		"type":"br"
	},
	{
		"type":"p",
		"children":[
			{ "text":"A paragraph" },
			{
				"type":"link",
                "text":"link",
                "ref":"http://foo.com"
            },
			{ "text":"and some other text" },
			{
				"type":"bold",
				"text":"bolded"
			}
		]
	},
    {
		"type":"plugin",
        "plugin":"NavTypeSimple",
        "params": {"param1":"foo","param2":"bar"}
	},
]
```