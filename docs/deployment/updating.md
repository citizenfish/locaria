# Updating a system

## Theme updates from sql

### Overview

Updating only the theme sql would normally be done if the site content has been constructed in SQL or an export has done
and placed in the themes export directory. When updating from SQL you will overwrite any updates that have been done
outside the SQL for example in admin so care should be taken.

#### Process

First start the configure tool. This assumes you have a working install and a fully deployed system as per the install guide

```shell
node scripts/configure.js
```

At the prompt you should see:

```shell
Command[h for help]?
```

Type 'e' and enter

You will now be asked what type of system you are deploying. This will normally be pre-populated for you if you have only installed
a single system and your can just hit enter to accept the default but if you have multiple systems select the required one.

```shell
Command[h for help]?e
Stage to deploy [sb]?
```

Next select the theme you are installing. Again on non-multi tenant systems this will be pre-populated for you. The theme
relates directly to the sql you are installing and where it installs it and is defined in your locario.json when you setup the system.

It is  recommended as part of install that this be in another repo outside of this one that can be backed up seperatly we use:

```javascript
"themeDir": "../locaria_private/themes/"
```

Next it will ask for an environment. This will by default be 'dev' but if you have setup live / test etc you can select it here.

```javascript
environment to use [dev]?
Deploy command for sb:swindonbid;dev [h for help]?
```
The prompt is showing that in this instance we are deploying to system **sb** theme **swindonbid** and environment **dev**. You
will be shown this again at certain points, specifically if you have a system flagged as live where you will be asked to confirm
the details but it is important to check this is all correct. If not hit 'q' and then 'e' again to reselect.

From this menu we type 'usql' and hit enter.

This will now update the SQL. Firstly the system SQL, this includes latest updates as part of the main release and then it will update
your local SQL from the themedir. Any images that are requried are also uploaded, errors are reported and the process should exist with
success for example

```javascript
Running: src/theme/builder/database/articles.sql
SQL src/theme/builder/database/articles.sql OK
Result DELETE - 12
Result INSERT - 12
Result REFRESH - null
DONE 9 FAILED 0 Records SKIPPED 0
End of databases
```

#### Images

The upload of images which can then be used in the system and specifically referenced in the sql is done via a config file in you
local theme dir IE 

```javascript
#themes/swindonbid/images/image_upload.json

    {
	"townCentre.jpg": {
	"usage": "Gallery",
		"mime_type": "image/jpg",
		"ext": "jpg"
    }
}
```

Adding files in the above format you need to also put the image in the same directory. The upload system will detect files that have
not previously been deployed to that environment and upload them. If you need to update an image (for example doing a resize) locate the
output file for the environment EG:

```javascript
#serverless/outputs/sb-outputs-swindonbid-dev-images.json
{
	"townCentre.jpg": {
	"usage": "Gallery",
		"mime_type": "image/jpg",
		"ext": "jpg",
		"url": "/assets/c1b10689-55fe-4b2c-b5fb-f4af5bf0e04b.jpg",
		"uuid": "c1b10689-55fe-4b2c-b5fb-f4af5bf0e04b"
    }
}
```

Simply remove the entry for the file you wish to refresh (or the entire file in the event of full re-upload) and then re-run the 'usql' process


