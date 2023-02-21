import sys
import uuid
import time
from multiprocessing import Pool

# This is simply for testing locally
sys.path[0:0] = ['../modules']
from openActiveConfig import *
from openActiveDB import *
from locaria_file_utils import get_local_config
from feedFunctions import loadRPDE

stats = {'pre_load' : {}, 'post_load': {}, 'post_delete' :{}}

DEBUG = logics.get(sys.argv[1], DEFAULT_DEBUG) if len(sys.argv) > 1 else DEFAULT_DEBUG
DELETE = logics.get(sys.argv[2], DEFAULT_DELETE) if len(sys.argv) > 2 else DEFAULT_DELETE

config = get_local_config('config.json')
db = openActiveDB(config, DEBUG)
if not db.connection:
    print("Unable to connect to database")
    exit()

if DEBUG: print(db.internalGateway('version', {}))

# Truncate tables prior to import
if __name__ == '__main__':
    if DELETE:
        feedTypes = db.getParameter(FEEDS_PARAMETER).get('feedTypes')
        if not feedTypes:
            print('FeedTypes not configured')
            exit()

        for f in feedTypes:
            db.truncateTable(f)

        db.resetUrls()

# Get a list of feeds that we are going to retrieve data from
feedsToProcess = db.getParameter(FEEDS_PROCESS_PARAMETER)

if not feedsToProcess.get('urls'): feedsToProcess['urls'] = {}

# We create a sessionID for this load so that we can retrieve data at end of process (we run a multi-process load so
# cannot keep track)
feedsToProcess['session'] = str(uuid.uuid4())

# Get parameters from feeds
feeds = db.getParameter(FEEDS_PARAMETER)
errorCount = 0
urlCount = 0
jobs = []

for f in feeds['feedTypes']:
    c = db.countRecords(f)
    stats['pre_load'][f] = c

for id in feedsToProcess['feeds']:
    if DEBUG: print(f"Loading {id}")
    jobs.append((id, feedsToProcess, feeds, config, DEBUG))

if __name__ == '__main__':  # Important as multiprocess respawns
    start = time.perf_counter()
    with Pool(processes=PROCS) as pool:
        for result in pool.starmap(loadRPDE, jobs):
            urlCount += result[0]
            errorCount += result[1]

    # Remove deleted records and calculate table stats
    for f in feeds['feedTypes']:
        c = db.countRecords(f)
        stats['post_load'][f] = c
        d = db.deleteOldRecords(f)
        stats['post_delete'][f] = d['deletes']

    loaded = {key: stats['post_load'][key] - value for key, value in stats['pre_load'].items()}
    final = {key: value + (stats['post_load'][key] - value) - stats['post_delete'][key] for key, value in stats['pre_load'].items()}

    # Tidy up after load
    print('Post Processing Data')
    p_res = db.query(PROCESS_QUERY)
    for key, value in p_res[0][0].items():
        if key in final:
            final[key] -= value

    # Here we update the url list processed by retrieving them from logs table
    feedsToProcess['urls'] = db.getURLs(feedsToProcess['session'])
    feedsToProcess['processTime'] = round(time.perf_counter() - start, 0)

    # create and store stats
    total_items = 0
    loaded_items = 0
    for key in loaded:
        total_items += final[key]
        loaded_items += loaded[key]

    feedsToProcess['stats'] = {'loaded' : loaded, 'final' : final, 'summary' : f"Completed load using {urlCount} urls and {errorCount} errors in {feedsToProcess['processTime']} seconds, loaded {loaded_items} final total {total_items}"}

    # Update our urls and stats from this load
    db.setParameter(FEEDS_PROCESS_PARAMETER, feedsToProcess)
    db.insertLog(feedsToProcess['session'], 'load_summary', feedsToProcess['stats'])

    db.close()
    print(feedsToProcess['stats']['summary'])