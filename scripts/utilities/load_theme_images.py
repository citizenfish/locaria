import sys
import json
import os
sys.path[0:0] = ['../../docker/modules']
from locaria_file_utils import database_connect, upload_to_s3

if len(sys.argv) < 4:
    exit("load_theme_images.py: Missing parameters <config file path> <images directory> <s3_bucket> <s3_path optional>")


if os.environ.get('LOCARIADB', '') == '':
    exit('load_theme_images.py: Missing LOCARIADB environment variable')

profile = os.environ.get('LOCARIAPROFILE', '')
if  profile == '':
    exit('load_theme_images.py: Missing LOCARIAPROFILE environment variable')

path = sys.argv[1]
dir = sys.argv[2]
bucket = sys.argv[3]
s3_path = sys.argv[4]

db = database_connect('LOCARIADB')

print(f"Loading images from config: {path} in directory {dir} using profile {profile}")

try:
    with open(path) as config_file:
        config = json.load(config_file)
except Exception as e:
    exit(f"Cannot open config file: {e}")

output = {}
for folder, subs, files in os.walk(dir):
    for filename in files:
        if config.get(filename, '') != '' and config.get(filename).get('url','') == '':
            filepath = os.path.join(folder, filename)
            print(f"Loading {filepath}")
            ret = upload_to_s3(profile, filepath, bucket, s3_path)
            if ret.get('error', '') == '':
                config[filename]['url'] = ret['url']
            else:
                print(f"Error uploading {filepath} [{ret['error']}]")

with open(path, 'w') as p:
    json.dump(config,p)


