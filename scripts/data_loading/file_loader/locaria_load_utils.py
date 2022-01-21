import psycopg
import os,subprocess
import json
import boto3
from urllib.parse import urlparse
import tempfile


def database_connect():
    try:
        print("Establishing database connection")
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

def get_record_count(db,table):
    count = db.execute(f"SELECT count(*) FROM {table}")
    return count.fetchone()[0]

def process_file_csv(db,file):
    print(f"CSV PROCESSING: {file['id']}")
    parameters = ['-oo','HEADERS=YES', '-oo','X_POSSIBLE_NAMES=lon*,Lon*,east*,East*,e,E', '-oo','Y_POSSIBLE_NAMES=lat*,Lat*,north*,North*,n,N', '-oo', 'AUTODETECT_TYPE=YES']
    return process_file_generic(db,file, parameters)

def process_file_xls(db,file):
    print(f"XLS PROCESSING  {file['id']}")
    parameters=['--config','OGR_XLSX_HEADERS', 'FORCE', '--config', 'OGR_XLSX_FIELD_TYPES', 'AUTO']
    return process_file_generic(db,file, parameters)

def process_file_json(db,file):
    print(f"JSON PROCESSING  {file['id']}")
    filename = ''

    if 'custom_loader' in file['attributes']:
        file['attributes']['path'] = tempfile.gettempdir() + f"/{file['id']}.json"
        from custom_loaders import custom_loader_main
        filename = custom_loader_main(file['attributes']['custom_loader'],db,file)
        file['filename'] = filename
        parameters = ['-lco', 'ID_GENERATE=YES']
        return process_file_generic(db,file,parameters)

    return {'status' : 'REGISTERED', 'filename' : filename}
    #return process_file_generic(db,file, parameters)

def process_file_geopackage(db,file):
    print(f"GEOPACKAGE PROCESSING  {file['id']}")
    return process_file_generic(db,file, parameters)

def process_file_generic(db,file,parameters):
    print("GENERIC PROCESSING")
    parameters.extend(['-lco', 'GEOMETRY_NAME=wkb_geometry', '--config', 'PG_USE_COPY', 'YES', '-overwrite', '-t_srs', 'EPSG:4326'])

    #skipfailures forces pg to commit 1 transaction per record and slows it right down
    if "skipfailures" in file['attributes'] and file['attributes']['skipfailures'] == 'true':
        parameters.extend(['-skipfailures'])

    if "s_srs" in file['attributes']:
        parameters.extend(['-s_srs', file["s_srs"]])
    else:
        parameters.extend(['-s_srs', 'EPSG:4326'])

    log_parameters = parameters[:]
    ogr = ogr_loader(file,parameters)
    return {"status" : ogr["status"], "log_message" : {"message" : ogr["message"], "parameters" : log_parameters, "result" : ogr["result"]}}

def get_file_from_url(url, format='json'):
    data = request.get(url)
    filename = tempfile.gettempdir() + f"/{file['id']}.{format}"
    with open(filename, 'wb') as f:
        f.write(data.content)
    return filename

def ogr_loader(file, parameters):

    if not 'table_name' in file:
        return {'status' : 'ERROR', 'result' : 'Missing table_name definition for ogr_loader'}

    if not 'path' in file['attributes']:
        return {'status' : 'ERROR', 'result' : 'Missing path for ogr_loader'}

    # Set up our variables for ogr2ogr command
    pgConn = urlparse(os.environ['LOCARIADB'])
    command = ['ogr2ogr']
    ogrConn = f"PG:dbname={pgConn.path[1:]} user={pgConn.username} password={pgConn.password} host={pgConn.hostname} port={pgConn.port}"

    filename = file['filename'] if 'filename' in file else  f"/vsis3{file['attributes']['path']}"

    #Can use GDAL driver or boto3 to get file from s3, gdal is default, boto3 added as option in case gdal break things and alos to allow local debug if needed
    if 's3_driver' in file['attributes'] and file['attributes']['s3_driver'] == 'boto3':
        filename = f"s3:/{file['attributes']['path']}"
        #download file to tmp filename we need to preserve extension for ogr2ogr
        print(f"Downloading from s3 {filename}")
        s3file = urlparse(filename)
        tmp_dir = tempfile.gettempdir()
        tmp_file = os.path.basename(s3file.path)
        filename = f"{tmp_dir}/{tmp_file}"
        s3 = boto3.client('s3')
        with open(filename,'wb') as f:
            #note we need to strip leading slash from s3 path
            s3.download_fileobj(s3file.netloc, s3file.path.strip('/'), f)
    else:
        print(f"Using GDAL driver to access file")

    parameters.extend(['-nln', file['table_name'],'-f', 'PostgreSQL',ogrConn, filename])
    command.extend(parameters)

    if 'layer' in file['attributes']:
        command.extend([file['attributes']['layer']])

    print(f"Running ogr2ogr on {filename}")
    print(' '.join(command))
    try:
        result = subprocess.run(command,check=True, capture_output=True)
    except subprocess.CalledProcessError as error:
        print("OGR2OGR ERROR")
        print(error)
        return {'status' : 'ERROR', 'result' : result.stderror.decode('utf-8'), 'message': 'OGR ERROR'}

    return {'status' : 'FARGATE_PROCESSED', 'result' : {'filename' : filename, 'stdout' : result.stdout.decode('utf-8'), 'returncode' : result.returncode}, 'message' : 'OGR SUCCESS'}