import sys
import requests
import json

#This is simply for testing locally
sys.path[0:0] = ['../modules']
from dataProcessorConfig import *
from locariaDB import *
from locaria_file_utils import get_local_config
from locaria_api_utils import *
from dataProcessors import classSelectors

config = get_local_config('config.json')
db = locariaDB(config, DEBUG)
if not db.connection:
    print("Unable to connect to database")
    exit()

parameters = db.getParameter(DATA_SCRAPER_PARAMETER)
print(parameters)

# process sites that require link scraping
if LINK_SITES:
    for site in parameters.get('link_sites', []):
        site['urls']= getLinks(site)
        proc = classSelectors[site['class']](site, DEBUG)
        res = proc.processUrls(db)


# process data read from local files in json format
if JSON_FILES:
    for site in parameters.get('local_files', []):
        proc = classSelectors[site['class']](site, DEBUG)
        res = proc.processJson(db)

if APIS:
    for site in parameters.get('apis', []):
        proc = classSelectors[site['class']](site, DEBUG)
        res = proc.processAPI(db)