import sys
import os
#This is simply for testing locally
sys.path[0:0] = ['../modules']
from locaria_file_utils import *
from locaria_downloaders import *
import time

S3_PREFIX = 'loaderDownloads'
FORMATS = {'geopckage' : 'gpkg', 'json' : 'json'}
config = get_local_config('config.json')

# Make database connection, retrieve any parameters and then a list of downloads to process
db = database_connect(config)
parameters = get_parameters(db,"file_download")

#if parameters.get('error', '') != '':
#    print('ERROR file_download parameters not configured')
#    exit()

schema = config.get('schema','locaria_core')

# We need an s3 bucket to drop fies into
parameters['s3_bucket'] = os.environ.get(f"{config['s3_var']}_{config['theme']}")
if parameters['s3_bucket'] == None:
    print(f"No s3 bucket configured [{config['s3_var']}_{config['theme']}]")
    exit()

downloads_to_process = get_files_to_process(db, schema, 'DOWNLOAD_REQUESTED')

count = 0

for f in downloads_to_process['files']:
    count += 1
    start_time = time.time()

    attributes = f['attributes']
    attributes['s3_bucket'] = parameters['s3_bucket']
    # We need a temporary directory and filename to download to
    attributes["tmp_dir"] = tempfile.gettempdir()
    attributes['fileName'] = f"{f['id']}.{FORMATS.get('format', 'xlsx')}"
    # Storage path on s3
    attributes['s3_path'] = f"{S3_PREFIX}/{attributes['fileName']}"
    # tempfile local storage path
    attributes['path'] = f"/{attributes['tmp_dir']}/{attributes['fileName']}"

    if attributes.get('type', 'all_data') == 'all_data':
        try:
            result = download_all(db, schema, attributes)
        except Exception as e:
            result = {'status': 'DOWNLOAD_ERROR', 'message' : f"Error: {str(e)}"}

        update_file_status(db, schema,f['id'], result)

    print(f"Processed download {f['id']}")

print(f"Processed {count} entries")