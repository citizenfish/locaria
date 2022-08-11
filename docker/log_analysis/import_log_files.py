import sys
import os
#This is simply for testing locally
sys.path[0:0] = ['../modules']
from locaria_file_utils import *
from log_files_utils import *

config = get_local_config('config.json')
# logBucket is where we are reading files from
bucket  = config.get('logBucket','')
if bucket == '':
    print('Log bucket not configured')
    print(config)
    exit(0)

# Make database connection, retrieve any parameters and then a list of downloads to process
db = database_connect(config)
# bucket: locarialogs-sb-swindonbidlive

files = get_bucket_file_list('', bucket)

for file in files:
    zips = load_cloudfront_log_file(file, bucket,db)
    print(zips)
