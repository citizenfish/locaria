import sys
import requests
import json

#This is simply for testing locally
sys.path[0:0] = ['../modules']
from openActiveConfig import *
from locariaDB import *
from locaria_file_utils import get_local_config
from locaria_api_utils import *

DEBUG = debugs.get(sys.argv[1], DEFAULT_DEBUG) if len(sys.argv) > 1  else DEFAULT_DEBUG


config = get_local_config('config.json')
db = locariaDB(config, DEBUG)
if not db.connection:
    print("Unable to connect to database")
    exit()

if DEBUG: print(db.internalGateway('version', {}))

# This is the parameter we are going to update in database
# It will be a list of feeds that will be traversed by the feedProcessor.py script
feedsToProcess = db.getParameter(FEEDS_PROCESS_PARAMETER)
feedsToProcess['feeds'] = {}
# First we retrieve the feeds url which gives us a list of compliant directories
feeds = db.getParameter(FEEDS_PARAMETER)

# This is a list of feeds to ignore
if not feedsToProcess.get('exclude'):
    feedsToProcess['exclude'] = []

feedCount = 0
errors = []

if not feeds:
    print(f"Missing parameter {FEEDS_PARAMETER}")
    exit()

try:
    # Next we get the feed details from each of the catalogues
    catalogues = getJson(feeds.get("dataCatalogueURL"), 'hasPart')
    if not catalogues:
        print("Cannot retrieve catalogues")
        exit()

    for hasPart in catalogues:
        # Finally we retrieve the metadata for each catalogue this is an embedded script in a HTML page :-(
        dataCatalogues = getJson(hasPart,'dataset')
        for dataSet in dataCatalogues:
            metadata = getJsonLD(dataSet)
            if metadata:
                type = metadata.get('@type')
                # We are only loading dataset feeds
                if type == 'Dataset':
                    print(f"{dataSet} : {type}")
                    id = metadata.get('@id')
                    if id:
                        if not id in feedsToProcess['exclude']:
                            feedsToProcess['feeds'][id] = metadata
                            feedCount += 1
                    else:
                        errors.append({"dataSet" :dataSet, "error" : "id", "metadata" : metadata})
                else:
                    errors.append({"dataSet" :dataSet, "error" : "type", "metadata" : metadata})
            else: errors.append(errors.append({"dataSet" :dataSet, "error" : "metadata"}))

except Exception as error:
    print("Untrapped error in feed discovery")
    print(str(error))
    exit()

feedsToProcess['errors'] = errors
feedsToProcess['discovered'] = feedCount
feedsToProcess['errorCount'] = len(errors)

print(f"Discovered {feedCount} feeds")
print(db.setParameter(FEEDS_PROCESS_PARAMETER, feedsToProcess))


