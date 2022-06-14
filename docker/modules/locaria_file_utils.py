import psycopg
import os,subprocess
import json
import re

def get_local_config(path):
    try:
        f = open(path)
        config = json.load(f)
        f.close()
    except FileNotFoundError:
        print("Using defaults for theme")
        return {'db_var': 'LOCARIADB', 'theme':'main', 's3_var': 'S3DLBUCKET'}

    return config

def database_connect(env_var):
    try:
        print("Establishing database connection")

        #This will be used later by ogr2ogr so set a standard named environment variable
        os.environ['LOCARIADB'] = os.environ[env_var]
        return psycopg.connect(os.environ[env_var])

    except Exception as error:
        print("Cannot connect to database ... exiting", error)
        exit()

def run_post_process_report(db, file, schema = 'locaria_core'):
    try:
        print(f"Running report {file['report_name']}")
        q_params = {"method" : "report", "report_name" : file["report_name"]}
        q_params.update(file)

        parameters = db.execute(f"SELECT {schema}.locaria_internal_gateway(%s) AS p", [json.dumps(q_params)])
        ret = parameters.fetchone()[0]
        return ret

    except Exception as error:
        print("Cannot run report", error)
        return {'error' : f"SQL error when running {file['report_name']}", "sql_error" : error}



def get_parameters(db, parameter_name = None, schema = 'locaria_core'):

    try:
        print(f"Retrieving parameters : {parameter_name}")
        q_params = {"method" : "get_parameters"}

        if parameter_name != None:
            q_params["parameter_name"] = parameter_name

        parameters = db.execute(f"SELECT {schema}.locaria_internal_gateway(%s,%s) AS p", [json.dumps(q_params), json.dumps({'_groups': ['Admins']})])
        ret = parameters.fetchone()[0]
        return ret

    except Exception as error:
        print("Cannot get parameter", error)
        exit()

def update_file_status(db,schema,id,update):
    update["method"] = "update_file"
    update["id"] = id
    print(update)

    try:
        files = db.execute(f"SELECT {schema}.locaria_internal_gateway(%s) AS files", [json.dumps(update)])
        db.commit()
        return files.fetchone()[0]
    except Exception as error:
        print("Cannot update file", error)
        return {"error" : error}

def get_files_to_process(db,schema, status = 'REGISTERED'):
    files = db.execute(f"SELECT {schema}.locaria_internal_gateway(%s) AS files", [json.dumps({"method" : "get_files", "status" : f"{status}"})])
    return files.fetchone()[0]

def get_record_count(db,table):

    if table == 'ignore':
        return "Multiple tables loaded"
    try:
        count = db.execute(f"SELECT count(*) FROM {table}")
        return count.fetchone()[0]
    except Exception as error:
        return(str(error))

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
    parameters = ['-oo', 'ARRAY_AS_STRING=YES', '-oo', 'FLATTEN_NESTED_ATTRIBUTES=YES']
    return process_file_generic(db, file, parameters)

def process_file_geopackage(db,file):
    print(f"GEOPACKAGE PROCESSING {file['id']}")
    parameters=[]
    return process_file_generic(db,file, parameters)

def process_file_gpx(db,file):
     print(f"GPX PROCESSING {file['id']}")
     parameters=[]
     file['attributes']['layer'] ='waypoints'
     return process_file_generic(db,file, parameters)

def process_file_generic(db,file,parameters):
    print(f"GENERIC PROCESSING {file['id']}")
    parameters.extend(['-lco','FID=ogc_fid', '-lco', 'GEOMETRY_NAME=wkb_geometry',  '--config', 'PG_USE_COPY', 'YES',  '-t_srs', 'EPSG:4326', '-lco', 'OVERWRITE=YES'])

    if 'flatten' in file and file['flatten']:
        parameters.extend(['-oo','FLATTEN_NESTED_ATTRIBUTES=YES'])

    #skipfailures forces pg to commit 1 transaction per record and slows it right down
    if "skipfailures" in file['attributes'] and file['attributes']['skipfailures'] == 'true':
        parameters.extend(['-skipfailures'])

    if "s_srs" in file['attributes']:
        parameters.extend(['-s_srs', file["s_srs"]])

    if 'multifile' in file:
        print("Loading multiple files")
        print(file['multifile'])
        ret = []
        count = 0
        for f in file['multifile']:
            mparameters = []
            if 'flatten' in f and f['flatten']:
                mparameters = parameters.copy()
                mparameters.extend(['-oo','FLATTEN_NESTED_ATTRIBUTES=YES'])
            else:
                mparameters = parameters.copy()
            file['filename'] = f['path']
            # the custom loader can dictate tablename or simply use
            file['table_name'] = f.get('table', file['table_name'] + f"_{count}")
            count += 1
            ret.append(ogr_loader(file, mparameters))

        return {'status' : 'FARGATE_PROCESSED', 'result' : ret, 'message' : 'OGR SUCCESS - Multi'}
    else:
        #log_parameters = parameters[:]
        ogr = ogr_loader(file,parameters)
        return ogr

def get_file_from_url(url, format='json'):
    data = request.get(url)
    filename = tempfile.gettempdir() + f"/{file['id']}.{format}"
    with open(filename, 'wb') as f:
        f.write(data.content)
    return filename

def ogr_loader(file, parameters):

    # TODO ogr2ogr version check we must have gdal > 3.4
    # Important to dereference parameters as called multiple times
    ogr_parameters = parameters.copy()
    #print(parameters)
    if not 'table_name' in file:
        return {'status' : 'ERROR', 'result' : 'Missing table_name definition for ogr_loader'}

    # Set up our variables for ogr2ogr command, TODO use peer authentication from FARGATE

    command = ['ogr2ogr']
    #Note this is set at database connection time
    ogrConn = os.environ['LOCARIADB']

    filename = file.get('filename', f"/vsis3/{file['attributes']['path']}")
    if 'ogr_parameters' in file['attributes']:
        ogr_parameters.extend(file['attributes']['ogr_parameters'])

    if file['table_name'] != 'ignore':
        ogr_parameters.extend(['-nln', file['table_name']])
    else:
        ogr_parameters.extend(['-lco', f"SCHEMA={file['upload_schema']}"])

    ogr_parameters.extend(['-f', 'PostgreSQL',ogrConn, filename])

    command.extend(ogr_parameters)

    if 'layer' in file['attributes']:
        command.extend(file['attributes']['layer'])

    #print(' '.join(command))
    print(f"Running ogr2ogr on {filename} with table {file['table_name']}")

    try:
        result = subprocess.run(command,check=True, capture_output=True)
    except subprocess.CalledProcessError  as error:
        print(f"OGR2OGR Error: {error.stderr.decode('utf-8')}")

        # never return the error here as it can leak the database password in command line
        return {'status' : 'ERROR', 'message': "OGR2OGR Error in execution"}

    # Get a list of the layers that have been loaded and return

    command = ['ogrinfo', '-nomd', '-nogeomtype', filename]
    layers = []
    try:
    	ogrinfo = subprocess.run(command,check=True, capture_output=True, text=True)
    	for layer in ogrinfo.stdout.split('\n'):
            match = re.search(r'^[-0-9]+: (.*)$',layer)
            if match:
                matched = re.sub(r'\-#\\', '_',match.group(1))
                layers.append(matched.lower())

    except subprocess.CalledProcessError  as error:
            #print(f"ogrinfo Error: {error.stderr.decode('utf-8')}")
            print(error.stderr)

    return {'status' : 'FARGATE_PROCESSED', 'result' : {'schema': file.get('upload_schema',''), 'layers': layers, 'filename' : filename,  'message' : 'OGR SUCCESS'}}

