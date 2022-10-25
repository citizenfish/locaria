import sys
import requests
import json

#This is simply for testing locally
sys.path[0:0] = ['../modules']
from foodAndHealthConfig import *
from locariaDB import *
from locaria_file_utils import get_local_config
from locaria_api_utils import *
from foodAndHealthProcessors import classSelectors

config = get_local_config('config.json')
db = locariaDB(config, DEBUG)
if not db.connection:
    print("Unable to connect to database")
    exit()

parameters = db.getParameter(DATA_SCRAPER_PARAMETER)

# process sites that require link scraping
for site in parameters.get('link_sites_ignore', []):
    site['urls']= getLinks(site)
    proc = classSelectors[site['class']](site, DEBUG)
    res = proc.processUrls(db)


# process data read from local files in json format
for site in parameters.get('local_files', []):
    proc = classSelectors[site['class']](site, DEBUG)
    res = proc.processJson(db)