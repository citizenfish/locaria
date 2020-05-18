# Lex Packet send format

# Lex packet return format

## Overview

There are two types of returns from lex that are used. One is an 'informational' return that is the standard
packet type used by lex defined as 'PlainText' and 'CustomPayload' which is used to pass our custom format back.

### PlainText

PlainText format is that standard return from lex and would look like this:

```json
{
  "dialogState":"ElicitSlot",
  "intentName":"GetCurrentEvents",
  "message":"Which area or postcode are you interested in?",
  "messageFormat":"PlainText",
  "responseCard":null,
  "sentimentResponse":{
    "sentimentLabel":"NEUTRAL",
    "sentimentScore":"{Positive: 0.016174993,Negative: 0.006684837,Neutral: 0.9771063,Mixed: 3.392314E-5}"},
    "sessionAttributes":{
      "map_centre":"-0.7424414554134273,51.338889361876085",
      "map_zoom_level":"16","ourMessageId":"CB_2"
    },
   "sessionId":"2020-01-28T09:12:33.301Z-QiYWvjIm",
   "slotToElicit":"Location",
   "slots":{"Location":null}
}
```

In the client we only look for

```json
{
  "messageFormat":"PlainText",
  "message":"Which area or postcode are you interested in?"
}
```

The message is simply displayed to the user in this instance. MessageFormat:"PlainText" defines that we
only look for the "message" element which we display to the user.

### CustomPayload

A CustomPayload could look like this:

```json
{
  "dialogState":"Fulfilled",
  "intentName":"GetWaste",
  "message":"{\"text_message\":\"I have found GU15 3HD\",\"widgets\":[{\"type\":\"geojson\",\"data\":{\"type\":\"FeatureCollection\",\"debug\":{\"method\":\"search\",\"category\":\"Waste and Recycling\",\"location\":\"SRID=4326;POINT(-0.743166424536075 51.3394703242612)\",\"search_text\":\"recycling\"},\"features\":[{\"type\":\"Feature\",\"geometry\":{\"type\":\"Point\",\"coordinates\":[-0.741716486290858,51.3383083921277]},\"properties\":{\"fid\":\"4212704d599484da01c4c1a8c0b51ee9\",\"ofid\":2,\"title\":\"Rear of The Camberley Theatre, Knoll Road Car Park , The Camberley Theatre,  Knoll Road, Camberley, GU15 3SY\",\"category\":[\"Waste and Recycling\"],\"description\":\"Recycling centre books & CD's/DVDs (BHF); glass bottles and jars; paper and magazines; textiles (BHF/Traid); shoes (Variety Club)\"}},{\"type\":\"Feature\",\"geometry\":{\"type\":\"Point\",\"coordinates\":[-0.743166424536075,51.3394703242612]},\"properties\":{\"lat\":-0.7431494,\"lon\":51.3394698,\"rank\":0.215039,\"uprn\":\"010002670314\",\"usrn\":\"38800711\",\"title\":\"Surrey Heath Borough Council Surrey Heath House Knoll Road\",\"address\":\"Surrey Heath Borough Council Surrey Heath House Knoll Road Camberley Surrey GU15 3HD \",\"la_code\":\"3640\",\"x_coord\":487644,\"y_coord\":160792,\"locality\":null,\"pao_text\":\"Surrey Heath House\",\"postcode\":\"GU15 3HD\",\"sao_text\":\"Surrey Heath Borough Council\",\"ward_code\":\"43UJGF\",\"parish_code\":\"E04009581\",\"postal_town\":\"Camberley\",\"organisation\":null,\"pao_end_number\":null,\"pao_end_suffix\":null,\"sao_end_number\":null,\"sao_end_suffix\":null,\"pao_start_number\":null,\"pao_start_suffix\":null,\"sao_start_number\":null,\"sao_start_suffix\":null,\"street_description\":\"Knoll Road\",\"feature_type\":\"location_feature\"}}]}}]}",
  "messageFormat":"CustomPayload",
  "responseCard":null,
  "sentimentResponse":{
    "sentimentLabel":"NEUTRAL",
    "sentimentScore":"{Positive: 1.6690968E-4,Negative: 5.651446E-5,Neutral: 0.99977535,Mixed: 1.1723666E-6}"
  },
  "sessionAttributes":{
     "map_centre":"-0.7417519723328496,51.33932900155875",
     "map_zoom_level":"15.820426799394294","ourMessageId":"CB_10"
  },
  "sessionId":"2020-01-28T09:31:46.662Z-dwllffWs",
  "slotToElicit":null,
  "slots":{
    "DistanceQualifier":null,
    "Location_UK":"GU15 3HD",
    "TimeQualifier":null,
    "WasteType":"recycling"
   }
}
```

Again we are only interested in two elements:

```json
{
  "message":"{\"text_message\":\"I have found GU15 3HD\",\"widgets\":[{\"type\":\"geojson\",\"data\":{\"type\":\"FeatureCollection\",\"debug\":{\"method\":\"search\",\"category\":\"Waste and Recycling\",\"location\":\"SRID=4326;POINT(-0.743166424536075 51.3394703242612)\",\"search_text\":\"recycling\"},\"features\":[{\"type\":\"Feature\",\"geometry\":{\"type\":\"Point\",\"coordinates\":[-0.741716486290858,51.3383083921277]},\"properties\":{\"fid\":\"4212704d599484da01c4c1a8c0b51ee9\",\"ofid\":2,\"title\":\"Rear of The Camberley Theatre, Knoll Road Car Park , The Camberley Theatre,  Knoll Road, Camberley, GU15 3SY\",\"category\":[\"Waste and Recycling\"],\"description\":\"Recycling centre books & CD's/DVDs (BHF); glass bottles and jars; paper and magazines; textiles (BHF/Traid); shoes (Variety Club)\"}},{\"type\":\"Feature\",\"geometry\":{\"type\":\"Point\",\"coordinates\":[-0.743166424536075,51.3394703242612]},\"properties\":{\"lat\":-0.7431494,\"lon\":51.3394698,\"rank\":0.215039,\"uprn\":\"010002670314\",\"usrn\":\"38800711\",\"title\":\"Surrey Heath Borough Council Surrey Heath House Knoll Road\",\"address\":\"Surrey Heath Borough Council Surrey Heath House Knoll Road Camberley Surrey GU15 3HD \",\"la_code\":\"3640\",\"x_coord\":487644,\"y_coord\":160792,\"locality\":null,\"pao_text\":\"Surrey Heath House\",\"postcode\":\"GU15 3HD\",\"sao_text\":\"Surrey Heath Borough Council\",\"ward_code\":\"43UJGF\",\"parish_code\":\"E04009581\",\"postal_town\":\"Camberley\",\"organisation\":null,\"pao_end_number\":null,\"pao_end_suffix\":null,\"sao_end_number\":null,\"sao_end_suffix\":null,\"pao_start_number\":null,\"pao_start_suffix\":null,\"sao_start_number\":null,\"sao_start_suffix\":null,\"street_description\":\"Knoll Road\",\"feature_type\":\"location_feature\"}}]}}]}",
  "messageFormat":"CustomPayload"
}
```

The "messageFormat":"CustomPayload" defines that the "message" element will contain our custom format which is
a json object that has been stringified. Lex does not allow us to send json native so in the client we JSON.parse() this string.

The original object format is:

```json
{
  "text_message":"Display to user",
  "widgets":[
    {"type":"geojson","data":{}}
  ]
}
```

"text_message" as per the PlainText mode is displayed to the user

The "widgets" is an optional array that causes the display of various widgets in the client. Each widget requires two elements:

```json
{
  "type": "widget name",
  "data": {} 
}
```

Type can be one of the following and are templates found in: site/templates/widgets.html

* geojson - A valid geojson object

```json
{"type":"FeatureCollection","features":[]}
```

The client needs the following feature properties as a minimum:

```json
{
  "featureType": "Bin",
  "ofid": "123456",
  "title": "Short Title",
  "address": "Address 123",
  "image": "http://foo.bar.com"
}
```

Any addtional properties can be added and displayed using templates assigned by the featureType param

* center - A new map center object

```json
{
  "new_mapcentre": "-0.7424414554134273,51.338889361876085"
}
```

* zoom - A new map zoom object

```json
{
  "new_zoom_level": "12"
}
```