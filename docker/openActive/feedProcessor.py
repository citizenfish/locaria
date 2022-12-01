import sys
import requests
import json
import uuid
import time
from multiprocessing import Pool

#This is simply for testing locally
sys.path[0:0] = ['../modules']
from openActiveConfig import *
from openActiveDB import *
from locaria_file_utils import get_local_config
from feedFunctions import loadRPDE

stats = {}

config = get_local_config('config.json')
db = openActiveDB(config, DEBUG)
if not db.connection:
    print("Unable to connect to database")
    exit()

if DEBUG: print(db.internalGateway('version', {}))

# Get a list of feeds that we are going to retrieve data from
feedsToProcess = db.getParameter(FEEDS_PROCESS_PARAMETER)
if not feedsToProcess.get('urls'): feedsToProcess['urls'] = {}

# We create a sessionID for this load so that we can retrieve data at end of process (we run a multi-process load so cannot keep track)
feedsToProcess['session'] = str(uuid.uuid4())

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

    # Here we update the url list processed by retrieving them from logs table
    urls = db.getURLs(feedsToProcess['session'])
    print(f"{feedsToProcess['session']} {urls}")


    feedsToProcess['urls'] = urls

    end = time.perf_counter()
    feedsToProcess['processTime'] = round(end - start, 0)

    # Remove deleted records and calculate table stats
    for f in feeds['feedTypes']:
        db.deleteOldRecords(f)
        c = db.countRecords(f)
        stats[f] = c

    feedsToProcess['stats'] = stats

    # Update our urls and stats
    db.setParameter(FEEDS_PROCESS_PARAMETER, feedsToProcess)
    db.close()

    print(f"Completed in {feedsToProcess['processTime']} seconds {stats}")
