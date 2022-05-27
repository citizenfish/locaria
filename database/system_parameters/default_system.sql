DELETE FROM locaria_core.parameters WHERE  parameter_name ='assets_url';
INSERT INTO locaria_core.parameters(parameter_name, parameter,acl)
--TODO replace locaria.org with custom domain ability
SELECT 'assets_url',
       jsonb_build_object(
               'url', '~uuid:_UUID_~url:https://{{theme}}.locaria.org/assets/_UUID_._EXT_'
           ),
       jsonb_build_object('update', jsonb_build_array('Admins'),'delete', jsonb_build_array('Admins'));

DELETE FROM locaria_core.parameters WHERE  parameter_name ='default_acl';

INSERT INTO locaria_core.parameters(parameter_name, parameter,acl)
SELECT 'default_acl',
       jsonb_build_object(
           'delete',    jsonb_build_array('Admins', 'Moderator'),
           'update',    jsonb_build_array('Admins', 'Moderator'),
           'moderate',  jsonb_build_array('Admins', 'Moderator')
           ),
       jsonb_build_object('update', jsonb_build_array('Admins'),'delete', jsonb_build_array('Admins'));

DELETE
FROM locaria_core.parameters
WHERE parameter_name = 'systemMain';

INSERT INTO locaria_core.parameters(parameter_name, acl, parameter)
SELECT 'systemMain',
       jsonb_build_object('update', jsonb_build_array('Admins'),'delete', jsonb_build_array('Admins')),
       '{
         "mapXYZ": "https://api.os.uk/maps/raster/v1/zxy/Road_3857/{z}/{x}/{y}.png?key=w69znUGxB6IW5FXkFMH5LQovdZxZP7jv",
         "mapBuffer": 50000,
         "defaultZoom": 15,
         "searchLimit": 40,
         "clusterCutOff": 5,
         "mapAttribution": "© Crown copyright and database rights 2022 OS",
         "clusterWidthMod": 20,
         "clusterAlgorithm": "KMEANS",
         "searchDistance": true,
         "searchLocation": true,
         "searchTags": true,
         "searchCategory": true
       }'::JSONB;

DELETE
FROM locaria_core.parameters
WHERE parameter_name = 'langENG';


INSERT INTO locaria_core.parameters(parameter_name, acl, parameter)
SELECT 'langENG',
       jsonb_build_object('update', jsonb_build_array('Admins'),'delete', jsonb_build_array('Admins')),
       '
                  {
                    "siteCallToAction": "Learn more about your location",
                    "siteSubCallToAction": "Enter an address or postcode to find information about that area",
                    "channelCallToAction": "Click on one of the channels below to find out more about your selected location.",
                    "searchInstruction": "Search for a location or item",
                    "distanceLabel": "kilometres",
                    "locationResultsHeader": "Locations Found",
                    "featureResultsHeader": "Items Found",
                    "resetCategoryText": "Reset Category",
                    "selectAllCategoryText": "Select All",
                    "resetDistanceText": "Reset Proximity",
                    "distanceSelectText": "Proximity",
                    "tagSelectText": "Tags applied",
                    "noTagsSelectedText": "No Tags active",
                    "resetTagsText": "Clear Tags",
                    "selectAllTagsText": "Select All",
                    "setAsLocationText": "Set as Default",
                    "copyrightCompany": "(c) Nautoguide Ltd. 2022",
                    "copyrightLink": "https://nautoguide.com",
                  "poweredByLink": "https://github.com/nautoguide/locaria",
                  "poweredByText": "Powered by Locaria",
                    "licensedLink": "https://github.com/nautoguide/locaria/blob/master/LICENSE",
                  "licensedText": "Licensed under the GPL 3.0",
                    "contactFormTitle": "Contact Us",
                    "contactFormText": "Feel free to contact us with any questions you may have about Locaria",
                    "contactFormNameLabel": "Name",
                    "contactFormEmailLabel": "Email Address",
                    "contactFormMessageLabel": "Your Message",
                    "contactFormSubmitLabel": "Send Message",
                    "contactFormSubmittedTitle": "Your message has been sent",
                    "contactFormSubmittedText": "Thank you for contacting us we will respond as soon as we possibly can",
                    "contactFormMessageIdText": "Message ID"
                  }
              '::JSONB;

DELETE
FROM locaria_core.parameters
WHERE parameter_name = 'siteMap';


INSERT INTO locaria_core.parameters(parameter_name, acl, parameter)
SELECT 'siteMap',
       jsonb_build_object('update', jsonb_build_array('Admins'), 'delete', jsonb_build_array('Admins')),
       '
       [
         {
           "key": "explore",
           "name": "Explore Map",
           "description": "Explore the map",
           "backgroundColor": "#ddaa22",
           "color": "#fff",
           "link":"/Search/[]/",
           "items": [
             {
               "name": "Shopping",
               "link": "/Search/[\"Shopping\"]/"
             },
             {
               "name": "Hospitality",
               "link": "https://google.com"
             }
           ]
         },
         {
           "key": "guides",
           "name": "Guides",
           "description": "Guides",
           "backgroundColor": "#e5544c",
           "color": "#fff"
         },
         {
           "key": "about",
           "name": "About",
           "description": "About",
           "backgroundColor": "#0099cc",
           "color": "#fff"
         },
         {
           "key": "news",
           "name": "News & Events",
           "description": "News and Events",
           "backgroundColor": "#99cc33",
           "color": "#fff"
         },
         {
           "key": "business",
           "name": "Business",
           "description": "Business",
           "backgroundColor": "#993399",
           "color": "#fff",
           "link":"/Search/[\"Business\"]/"
         }
       ]
       '::JSONB;

