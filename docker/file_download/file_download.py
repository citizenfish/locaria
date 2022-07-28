import sys
import os
#This is simply for testing locally
sys.path[0:0] = ['../modules']
from locaria_file_utils import *
from locaria_downloaders import *
import time

config = get_local_config('config.json')

# Make database connection, retrieve any parameters and then a list of downloads to process
db = database_connect(f"{config['db_var']}_{config['theme']}")
print("Database connection established")
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

    if attributes.get('type', 'all_data') == 'all_data':
        # TODO repeated code could be better
        if attributes.get('format') == 'json':
            attributes['s3_path'] = f"downloads/{f['id']}.json"
            attributes['path'] = attributes["tmp_dir"] + f"/{f['id']}.json"
        elif attributes.get('format') == 'geopackage':
            attributes['s3_path'] = f"downloads/{f['id']}.gpkg"
            attributes['path'] = attributes["tmp_dir"] + f"/{f['id']}.gpkg"
        else:
            attributes['format'] = 'xlsx'
            attributes['s3_path'] = f"downloads/{f['id']}.xlsx"
            attributes['path'] = attributes["tmp_dir"] + f"/{f['id']}.xlsx"

        try:
            result = download_all(db, schema, attributes)
        except Exception as e:
            result = {'status': 'DOWNLOAD_ERROR', 'message' : f"Error: {str(e)}"}

        update_file_status(db, schema,f['id'],result)

    print(f"Processed download {f['id']}")

print(f"Processed {count} entries")