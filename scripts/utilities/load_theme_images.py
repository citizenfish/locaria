import sys
import json
import os
sys.path[0:0] = ['../../docker/modules']
from locaria_file_utils.py import db_connect

if len(sys.argv) != 4:
    exit("load_theme_images.py: Missing parameters <config file path> <images directory> <s3_bucket> <s3_path optional>")

if os.environ.get('LOCARIADB', '') == '':
    exit('load_theme_images.py: Missing LOCARIADB environment variable')

if os.environ.get('LOCARIAPROFILE', '') == '':
    exit('load_theme_images.py: Missing LOCARIAPROFILE environment variable')

path = sys.argv[1]
dir = sys.argv[2]
bucket = sys.argv[3]

print(f"Loading images from config: {path} in directory {dir}")

try:
    with open(path) as config_file:
        config = json.load(config_file)
except Exception as e:
    exit(f"Cannot open config file: {e}")

for folder, subs, files in os.walk(dir):
    for filename in files:
        if config.get(filename, '') != '':
            filepath = os.path.join(folder, filename)
            print(f"Loading {filepath}")

