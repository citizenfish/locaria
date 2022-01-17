from locaria_load_utils import *
import sys

debug = 0


schema = 'locaria_core' if len(sys.argv) < 3  else sys.argv[2]

db = database_connect()

files_to_process = get_files_to_process(db,schema)
count = 0

for f in files_to_process["files"]:
    count+=1
    if "type" in f["attributes"]:
        if f["attributes"]["type"] == "csv":
                result = process_file_csv(db,f)
        elif f["attributes"]["type"] == "xls":
                result = process_file_xls(db,f)
        elif f["attributes"]["type"] == "geojson":
                result = process_file_geojson(db,f)
        else:
                result = {"status": "FARGATE_ERROR", "log_message" : {"error" : f"Unsupported file type {f['attributes']['type']}"}}

        update_file_status(db,schema,f["id"],result)
    else:
        update_file_status(db,schema, f["id"],{"status": "FARGATE_ERROR", "log_message" : {"error" : "Missing file type "}})

print(f"Processed {count} entries")




