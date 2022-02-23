from locaria_load_utils import *
import sys
import os
import re
import time
import boto3

debug = 0
schema = 'locaria_core' if len(sys.argv) < 3  else sys.argv[2]
upload_schema = 'locaria_uploads' if len(sys.argv) < 4  else sys.argv[3]
table_name_mask = 'upload_file_'

# Make database connection, retrieve any parameters and then a list of files to process
db = database_connect()
print("Database connection established")
parameters = get_parameters(db,"file_upload")
files_to_process = get_files_to_process(db,schema)

count = 0

for f in files_to_process["files"]:
    count += 1
    start_time = time.time()

    # A file needs a url or S3 path if we are to process it
    if not 'path' in f['attributes'] and not 'url' in f['attributes']:
        update_file_status(db,schema,f['id'],{'status': 'FARGATE_ERROR', 'log_message' : {'error' : 'Missing file path or url'}})
        continue

    f['table_name'] = f"{upload_schema}.{table_name_mask}{f['id']}"

    # When loading from web client the record is created and then file uploaded, file has filename "id"
    # We need to check that it is there before processing

    if 'id_as_filename' in f['attributes']:
        f['attributes']['path'] = f"{f['attributes']['bucket']}/{f['attributes']['path']}{f['id']}.{f['attributes']['ext']}"
        print(f"Constructed filename {f['attributes']['path']}")

    # Make sure file exists in s3 for everything bar json api calls
    if "path" in f["attributes"]:
        path = file['attributes']['path']
        s3 = boto3.resource('s3')
        for bucket_list in s3.Bucket(f['attributes']['bucket']).objects.filter(Prefix=path):
            if not path in bucket_list:
                update_file_status(db,schema,f['id'],{'log_message' : {'s3_status' : 'File not yet present in S3'}})
                continue
            else:
                update_file_status(db,schema,f['id'],{'log_message' : {'s3_status' : 'File found in S3'}})

    update_file_status(db,schema,f['id'],{'status': 'FARGATE_PROCESSING', 'message' : f"Loading {f['attributes']['path'] if 'path' in f['attributes'] else f['attributes']['url']} to {f['table_name']}"})

    # Add any parameters to file structure so passed to processing functions
    f["parameters"] = parameters if "error" not in parameters else {}

    extension = f['attributes']['ext'] if "ext" in f["attributes"] else os.path.splitext(f['attributes']['path'])[1].lower().replace('.','')
    if re.match('^xl',extension):
        result = process_file_xls(db,f)
    elif re.match('^cs|tx',extension):
        result = process_file_csv(db,f)
    elif re.match('^gpk',extension):
        result = process_file_geopackage(db,f)
    elif re.match('^js|ge', extension):
        result = process_file_json(db,f)
    elif re.match('^gpx', extension):
        result = process_file_gpx(db,f)
    else:
        result = process_file_generic(db,f)

    if result['status'] == 'FARGATE_PROCESSED':
        result['attributes'] = {'table_name' : f['table_name'], 'processing_time' : round(time.time() - start_time,2), 'record_count' : get_record_count(db, f['table_name'])}

    update_file_status(db,schema,f['id'],result)
    print(f"Processed file {f['id']}")

print(f"Processed {count} entries")




