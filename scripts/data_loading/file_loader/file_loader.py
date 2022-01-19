from locaria_load_utils import *
import sys
import os
import re

debug = 0
schema = 'locaria_core' if len(sys.argv) < 3  else sys.argv[2]
upload_schema = 'locaria_uploads' if len(sys.argv) < 4  else sys.argv[3]
table_name_mask = "file_"

db = database_connect()

files_to_process = get_files_to_process(db,schema)
count = 0

for f in files_to_process["files"]:
    count += 1

    if not "path" in f["attributes"]:
        update_file_status(db,schema,f["id"],{"status": "FARGATE_ERROR", "log_message" : {"error" : "Missing file path"}})
        continue

    f["table_name"] = f"{upload_schema}.{table_name_mask}{f['id']}"
    update_file_status(db,schema,f["id"],{"status": "FARGATE_PROCESSING", "log_message" : {"message" : f"Loading {f['attributes']['path']} to {f['table_name']}"}})

    if "type" in f["attributes"]:
        if f["attributes"]["type"] == "csv":
                result = process_file_csv(db,f)
        elif f["attributes"]["type"] == "xls":
                result = process_file_xls(db,f)
        elif f["attributes"]["type"] == "geojson":
                result = process_file_geojson(db,f)
        elif f["attributes"]["type"] == "geopackage":
                result = process_file_geopackage(db,f)
        else:
                result = {"status": "FARGATE_ERROR", "log_message" : {"error" : f"Unsupported file type {f['attributes']['type']}"}}
    else:

        extension = os.path.splitext(f["attributes"]["path"])[1].lower().replace('.','')
        if re.match("^xl",extension):
            result = process_file_xls(db,f)
        elif re.match("^cs|tx",extension):
            result = process_file_csv(db,f)
        elif re.match("^gpk",extension):
            result = process_file_geopackage(db,f)
        elif re.match("^js|ge"):
            result = process_file_geojson(db,f)
        else:
            result = process_file_generic(db,f)

    print(update_file_status(db,schema,f["id"],result))
    print(result)

print(f"Processed {count} entries")




