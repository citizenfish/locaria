from locaria_load_utils import *
import sys

debug = 0
#args = bucket_url file_id (schema)

if len(sys.argv) < 2:
    print("Usage: file_loader.py fileID (schema)")
    exit()

schema = 'locaria_core' if len(sys.argv) < 3  else sys.argv[2]

db = database_connect()

# Get details of file to process
fileDetails = get_file_details(db, schema, int(sys.argv[1]))
if debug:
    print(json.loads(fileDetails[1])["bucket"])

# Move to temp directory ready for upload
tmpFilename = move_to_temp(fileDetails[1])


