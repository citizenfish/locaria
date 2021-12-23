import postgresql
import os
import tempfile
import boto3
import json

def database_connect():
    try:
        return postgresql.open(os.environ['LOCARIADB'])

    except KeyError:
        print("Database credentials not provided ... exiting")
        exit()

def update_file_status(db,schema,id,update):
    q = db.prepare(f"SELECT {schema}.locaria_internal_gateway($1) AS files")
    update["method"] = "update_file"
    update["id"] = id
    files = q(json.dumps(update))
    return json.loads(files[0][0])

def get_files_to_process(db,schema):
    q = db.prepare(f"SELECT {schema}.locaria_internal_gateway($1) AS files")
    files = q(json.dumps({"method" : "get_files", "status" : "REGISTERED"}))
    return json.loads(files[0][0])

def process_file_csv(db,file):
    print("CSV PROCESSING")
    return {"status" : 'PROCESSED', "log_message" : {"result": "CSV PROCESSED"}}

def process_file_xls(db,file):
    print("XLS PROCESSING")
    return {"status" : 'PROCESSED', "log_message" : {"result": "XLS PROCESSED"}}

def process_file_geojson(db,f):
    print("GEOSJSON PROCESSING")
    return {"status" : 'PROCESSED', "log_message" : {"result": "GEOJSON PROCESSED"}}