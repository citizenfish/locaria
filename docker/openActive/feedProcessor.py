import sys
import requests
import json
import uuid
import time
from multiprocessing import Pool

#This is simply for testing locally
sys.path[0:0] = ['../modules']
from openActiveDB import *
from locaria_file_utils import get_local_config
from feedFunctions import loadRPDE

PROCS = 4
DEBUG = True
FEEDS_PARAMETER = 'openActiveFeeds'
FEEDS_PROCESS_PARAMETER = 'openActiveFeedsToProcess'

config = get_local_config('config.json')
db = openActiveDB(config, DEBUG)
if not db.connection:
    print("Unable to connect to database")
    exit()

if DEBUG: print(db.internalGateway('version', {}))

# Get a list of feeds that we are going to retrieve data from
feedsToProcess = db.getParameter(FEEDS_PROCESS_PARAMETER)
if not feedsToProcess.get('urls'): feedsToProcess['urls'] = {}
feedsToProcess['session'] = uuid.uuid4()

# Get parameters from feeds
feeds = db.getParameter(FEEDS_PARAMETER)
errorCount = 0
urlCount = 0
jobs = []
for id in feedsToProcess['feeds']:
    if DEBUG: print(f"Loading {id}")
    jobs.append((id, feedsToProcess, feeds, config, DEBUG))


if __name__ == '__main__': # Important as multiprocess respawns
    start = time.perf_counter()
    with Pool(processes = PROCS) as pool:
        for result in pool.starmap(loadRPDE,jobs):
            urlCount += result[0]
            errorCount += result[1]

    print(f"Completed processing with {urlCount} urls and {errorCount} errors")

    urls = db.getURLs(feedsToProcess['session'])
    feedsToProcess['urls'] = urls
    end = time.perf_counter()
    feedsToProcess['processTime'] = end - start
    # Update our urls
    print(db.setParameter(FEEDS_PROCESS_PARAMETER, feedsToProcess))
    db.close()

    print(f"Completed in {feedsToProcess['processTime']}.1f: seconds")
