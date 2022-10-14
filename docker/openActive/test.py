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

feedsToProcess = {}
feedsToProcess['session'] = '07911356-276a-44c3-8315-3d163a474764'
urls = db.getURLs(feedsToProcess['session'])
print(type(urls))