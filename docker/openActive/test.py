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

config = get_local_config('config.json')
db = openActiveDB(config, True)

FEEDS_PARAMETER = 'openActiveFeeds'
feeds = db.getParameter(FEEDS_PARAMETER)

stats = {}
for f in feeds['feedTypes']:
    res = db.deleteOldRecords(f)
    print(res)
    c = db.countRecords(f)
    stats[f] = c[0]

print(stats)