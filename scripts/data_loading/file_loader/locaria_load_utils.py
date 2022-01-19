import psycopg
import os,subprocess
import json
from urllib.parse import urlparse

def database_connect():
    try:
        print("Database connection established")
        return psycopg.connect(os.environ['LOCARIADB'])

    except Exception as error:
        print("Cannot connect to database ... exiting", error)
        exit()

def update_file_status(db,schema,id,update):
    update["method"] = "update_file"
    update["id"] = id
    files = db.execute(f"SELECT {schema}.locaria_internal_gateway(%s) AS files", [json.dumps(update)])
    # Remember to commit write transactions with psycopg
    db.commit()
    return files.fetchone()[0]

def get_files_to_process(db,schema):
    files = db.execute(f"SELECT {schema}.locaria_internal_gateway(%s) AS files", [json.dumps({"method" : "get_files", "status" : "REGISTERED"})])
    return files.fetchone()[0]

def process_file_csv(db,file):
    print(f"CSV PROCESSING: {file['id']}")
    parameters = ['-oo','HEADERS=YES', '-oo','X_POSSIBLE_NAMES=lon*,Lon*,east*,East*,e,E', '-oo','Y_POSSIBLE_NAMES=lat*,Lat*,north*,North*,n,N', '-oo', 'AUTODETECT_TYPE=YES']
    return process_file_generic(db,file, parameters)

def process_file_xls(db,file):
    print(f"XLS PROCESSING  {file['id']}")
    parameters=['--config','OGR_XLSX_HEADERS', 'FORCE', '--config', 'OGR_XLSX_FIELD_TYPES', 'AUTO']
    return process_file_generic(db,file, parameters)

def process_file_geojson(db,file):
    print(f"GEOJSON PROCESSING  {file['id']}")
    return process_file_generic(db,file, parameters)

def process_file_geopackage(db,file):
    print(f"GEOPACKAGE PROCESSING  {file['id']}")
    return process_file_generic(db,file, parameters)

def process_file_generic(db,file,parameters):
    print("GENERIC PROCESSING")
    parameters.extend(['-lco', 'GEOMETRY_NAME=wkb_geometry', '--config', 'PG_USE_COPY', 'YES', '-overwrite', '-skipfailures', '-t_srs', 'EPSG:4326'])
    if "s_srs" in file:
        parameters.extend(['-s_srs', file["s_srs"]])
    else:
        parameters.extend(['-s_srs', 'EPSG:4326'])
    ogr = ogr_loader(file,parameters)
    return {"status" : ogr["status"], "log_message" : {"parameters" : parameters, "result" : ogr["result"]}}

def ogr_loader(file, parameters):
    pgConn = urlparse(os.environ['LOCARIADB'])

    if not 'table_name' in file:
        return {'status' : 'ERROR', 'result' : 'Missing table_name definition for ogr_loader'}

    command = ['ogr2ogr']
    ogrConn = 'PG:dbname=' + pgConn.path[1:] + ' user=' + pgConn.username + ' password=' + pgConn.password + ' host=' + pgConn.hostname + ' port=' + str(pgConn.port)

    parameters.extend(['-nln', file['table_name'],'-f', 'PostgreSQL',ogrConn, f"/vsis3{file['attributes']['path']}"])
    command.extend(parameters)

    if 'layer' in file['attributes']:
        command.extend([file['attributes']['layer'])

    try:
        result = subprocess.run(command,check=True, capture_output=True)
    except subprocess.CalledProcessError as error:
        return {'status' : 'ERROR', 'result' : error}

    return {'status' : 'PROCESSED', 'result' : result.stdout}