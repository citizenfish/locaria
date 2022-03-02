from locaria_load_utils import *
import sys
import os
import re
import time
import boto3
import tempfile

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

    # Mandatory extension which tells us which loader to use
    extension = f['attributes'].get('ext', 'csv')
    # Any SQL to run after load
    post_process_report = f['attributes'].get('post_process_report', '')

    # A file needs a url or S3 path if we are to process it
    if not 'path' in f['attributes'] and not 'url' in f['attributes'] and not "custom_loader" in f['attributes']:
        update_file_status(db,schema,f['id'],{'status': 'FARGATE_ERROR', 'log_message' : {'error' : 'Missing file path, url or custom loader'}})
        continue

    # The table we are loading to, can only be in uploads schema
    table_name = f['attributes'].get('table_name', f"{table_name_mask}{f['id']}")
    f['table_name'] = f"{upload_schema}.{table_name}"

    # Add any parameters to file structure so passed to processing functions
    f["parameters"] = parameters if "error" not in parameters else {}

    # Custom loaders pull their data directly from API calls and do not need files in S3
    if 'custom_loader' in f['attributes']:

        # We need a temporary directory and filename to download to
        f["attributes"]["tmp_dir"] = tempfile.gettempdir()
        f['attributes']['path'] = f["attributes"]["tmp_dir"] + f"/{f['id']}.{extension}"

        from custom_loaders import custom_loader_main

        # custom loaders should do their stuff and then create a file
        custom_loader_result = custom_loader_main(db,f)
        status = custom_loader_result.get('status', '')
        if status in ('ERROR', 'CANCELLED'):
            update_file_status(db,schema,f['id'],{'status': status, 'log_message' : {'custom_loader_error' : custom_loader_result}})
            continue

        f.update(custom_loader_result)

    else:
        # We are now expecting file to be in S3 so must have a bucket
        if not 'bucket' in f['attributes']:
            update_file_status(db,schema,f['id'],{'status': 'FARGATE_ERROR', 'log_message' : {'error' : 'Missing file bucket'}})
            continue

        # When loading from web client the record is created and then file uploaded, file has filename "id"
        if 'id_as_filename' in f['attributes']:
            f['attributes']['path'] = f"{f['attributes']['bucket']}/{f['attributes']['path']}{f['id']}.{extension}"
            print(f"Constructed filename {f['attributes']['path']}")

        # Make sure file exists in s3 for everything bar json api calls
        if "path" in f["attributes"]:
            path = f['attributes']['path']
            s3 = boto3.resource('s3')
            for bucket_list in s3.Bucket(f['attributes']['bucket']).objects.filter(Prefix=path):
                if not path in bucket_list:
                    update_file_status(db,schema,f['id'],{'log_message' : {'s3_status' : 'File not yet present in S3'}})
                    continue
                else:
                    update_file_status(db,schema,f['id'],{'log_message' : {'s3_status' : 'File found in S3'}})

    update_file_status(db,schema,f['id'],{'status': 'FARGATE_PROCESSING', 'message' : f"Loading {f['attributes']['path'] if 'path' in f['attributes'] else f['attributes']['url']} to {f['table_name']}"})

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

    if post_process_report != '':
        f['report_name'] = post_process_report
        result['attributes']['post_process_report_output'] = run_post_process_report(db,f)

    update_file_status(db,schema,f['id'],result)
    print(f"Processed file {f['id']}")

print(f"Processed {count} entries")




