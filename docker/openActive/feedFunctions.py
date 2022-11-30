import sys
import requests
import json
sys.path[0:0] = ['../modules']
from openActiveDB import *
from locaria_api_utils import getJson

def loadRPDE(id, feedsToProcess, feeds, config, debug=False):

    # We open a new connection as this function can be run as a parallel process
    funcDB = openActiveDB(config, debug)

    # We store urls at the end of the process as they tell us where to start from next load
    urls = {}
    errors = []

    # feed is of type Dataset in openActive: https://developer.openactive.io/data-model/types/dataset
    feed = feedsToProcess['feeds'][id]
    distribution = feed.get('distribution',[])
    org = feed.get('@id')

    if not org:
        errors = [{"error" : "No @id in feed", "feed": feedsToProcess}]
        return urls, errors

    # rpde is type DataDownload in openActive: https://developer.openactive.io/data-model/types/datadownload
    for rpde in distribution:
        name = rpde.get('name','')
        urlID = f"{id}{name}"
        inserts = []

        # We either use the last url or fetch from the last url retrieved
        # url points to an rpde feed in openActive: https://openactive.io/realtime-paged-data-exchange/

        url = feedsToProcess['urls'].get(urlID, rpde.get('contentUrl'))


        while True and url:
            # Store the last url so we don't iterate the entire list again
            if url != "" : urls[urlID] = url

            if debug: print(f"Getting data from {url}")
            rpde_data = getJson(url)
            items = rpde_data.get('items',[])

            if items:
                inserts = inserts + items
            else:
                break

            # rpde spec says if the url is same as last then no more data
            if rpde_data.get('next', url) == url:
                break

            # this is how paging happens we use the next url to get the next page of data
            url = rpde_data.get('next')

            res = funcDB.insertJson(feeds['feedTypes'], inserts, org)

            if res['errors']:
                errors.append(res['errors'])
                if debug: print(res['errors'])

            inserts = []



    # we store these in database each function call as the calls are made multiprocess, they are retrieved at end of load process
    if urls: funcDB.insertLog(feedsToProcess['session'], 'urls', urls)
    if errors: funcDB.insertLog(feedsToProcess['session'], 'errors', errors)

    funcDB.close()
    return len(urls), len(errors)
