import sys
import requests
import json
import uuid
import time

#This is simply for testing locally
sys.path[0:0] = ['../modules']
from openActiveDB import *
from locaria_file_utils import get_local_config

DEBUG = True
config = get_local_config('config.json')
db = openActiveDB(config, DEBUG)

inserts = db.insertJson(['course'],
                        [{
                                     "state": "deleted",
                                     "kind": "Course",
                                     "id": "mb3szcbljkan",
                                     "modified": 1623087063
                                 },
                                 {
                                     "state": "deleted",
                                     "kind": "Course",
                                     "id": "mderrl9gduys",
                                     "modified": 1623087063
                                 },
                                 {
                                     "state": "deleted",
                                     "kind": "Course",
                                     "id": "tivbcrbk3cwj",
                                     "modified": 1623087063
                                 }],
                        'test')

deletes = db.deleteOldRecords('course')
print(deletes)
