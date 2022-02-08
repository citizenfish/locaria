from locaria_load_utils import *
import sys
import os
import re
import time


debug = 0
schema = 'locaria_core' if len(sys.argv) < 3  else sys.argv[2]
upload_schema = 'locaria_uploads' if len(sys.argv) < 4  else sys.argv[3]
table_name_mask = 'upload_file_'

db = database_connect()

files_to_process = get_files_to_process(db,schema)
count = 0

for f in files_to_process["files"]:
    count += 1
    start_time = time.time()

    if not 'path' in f['attributes'] and not 'url' in f['attributes']:
        update_file_status(db,schema,f['id'],{'status': 'FARGATE_ERROR', 'log_message' : {'error' : 'Missing file path or url'}})
        continue

    f['table_name'] = f"{upload_schema}.{table_name_mask}{f['id']}"

    # When loading from web client the record is created and then file uploaded, file has filename "id"
    # We need to check that it is there before processing

    if 'id_as_filename' in f['attributes']:
        f['attributes']['path'] = f"{f['attributes']['bucket']}/{f['attributes']['path']}{f['id']}.{f['attributes']['ext']}"
        print(f"Constructed filename {f['attributes']['path']}")

    # TODO make sure file exists in s3
    print(f['attributes']['file_type'])

    update_file_status(db,schema,f['id'],{'status': 'FARGATE_PROCESSING', 'message' : f"Loading {f['attributes']['path'] if 'path' in f['attributes'] else f['attributes']['url']} to {f['table_name']}"})

    if 'file_type' in f['attributes']:
        if f['attributes']['file_type'] in ['text/csv', 'application/csv']:
                result = process_file_csv(db,f)
        elif f['attributes']['file_type'] in ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.ms-excel.sheet.binary.macroEnabled.12','application/vnd.ms-excel', 'application/vnd.ms-excel.sheet.macroEnabled.12']:
                result = process_file_xls(db,f)
        elif f['attributes']['file_type'] in ['application/json']:
                result = process_file_json(db,f)
        elif f['attributes']['file_type'] == 'geopackage':
                result = process_file_geopackage(db,f)
        else:
                result = {'status': 'FARGATE_ERROR', 'log_message' : {'error' : f"Unsupported file type {f['attributes']['type']}"}}
    else:

        #extension = os.path.splitext(f['attributes']['path'])[1].lower().replace('.','')
        extension = f['ext']
        if re.match('^xl',extension):
            result = process_file_xls(db,f)
        elif re.match('^cs|tx',extension):
            result = process_file_csv(db,f)
        elif re.match('^gpk',extension):
            result = process_file_geopackage(db,f)
        elif re.match('^js|ge', extension):
            result = process_file_json(db,f)
        else:
            result = process_file_generic(db,f)

    if result['status'] == 'FARGATE_PROCESSED':
        result['attributes'] = {'table_name' : f['table_name'], 'processing_time' : round(time.time() - start_time,2), 'record_count' : get_record_count(db, f['table_name'])}

    update_file_status(db,schema,f['id'],result)
    print(f"Processed file {f['id']}")


print(f"Processed {count} entries")




