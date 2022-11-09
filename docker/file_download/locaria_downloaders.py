import xlsxwriter
import tempfile
import json
import pandas as pd
import boto3
import os,subprocess

def download_all(db, schema, parameters):
    print("Downloading all data")

    # If user has chosen a subset then use that
    if parameters.get('categories'):
        categories = {'categories' : parameters['categories']}
    else:
        categories = get_categories(db)

    # Microsoft Excel output
    features = []
    if parameters['format'] == 'xlsx':
        print("Outputting XLSX")
        with pd.ExcelWriter(parameters['path']) as writer:
            for category in categories['categories']:
                features = get_category_data(db, category, parameters.get('filters',''), 'datagrid')
                df = pd.json_normalize(features)
                df.to_excel(writer, sheet_name=f"{category}")

    # JSON output
    elif parameters['format'] == 'json':
        print("Outputting JSON")
        for category in categories['categories']:
            features.extend(get_category_data(db, category, parameters.get('filters',''), 'datagrid'))

        writeFileJson(parameters['path'], features)

    # GEOPACKAGE OUTPUT
    elif parameters['format'] == 'geopackage':
        print("Outputting GEOPACKAGE")
        files = []
        count = 0

        for category in categories['categories']:
            file = f"{parameters['tmp_dir']}/{category}.geojson"
            writeFileJson(file, get_category_data(db, category, parameters.get('filters',''), 'geojson'))
            ogr_params = ['-f', 'GPKG', parameters['path'], '-nln', category, '-lco', 'FID=ogr_id']
            if count > 0:
                ogr_params.extend(['-update'])
            count += 1
            ogr = ogr_output(file, ogr_params)
            files.extend(ogr)

    else:
        return {"status" : "DOWNLOAD_ERROR", 'message' : f"No processor for {parameters['format']}"}

    print(f"Wrote {parameters['path']}")
    s3 = boto3.client('s3')
    s3.upload_file(parameters['path'], parameters['s3_bucket'],  parameters['s3_path'])

    return {"status" : "DOWNLOAD_COMPLETED", "message" : "Download Completed", "attributes" : {"name" : parameters['name'], "fileName": parameters["fileName"]}}

def get_category_data(db, category, filters, format):
    print(f"Writing :{category}")
    features = []
    data = {'count' : 1}
    offset = 0
    while data['count'] > 0:
        data = get_data(db, category, offset, filters, format)
        if format == 'geojson':
            features.extend(data['geojson']['features'])
            data['count'] = data['options']['count']
        else:
            features.extend(data['features'])
        offset = offset + 10000

    if format == 'geojson':
        return {'type': 'FeatureCollection', 'features': features}

    return features

def get_categories(db,schema = 'locaria_core'):

    print(f"Retrieving categories")
    q_params = {"method" : "list_categories_with_data"}
    categories = db.execute(f"SELECT {schema}.locaria_gateway(%s,%s) AS p", [json.dumps(q_params), json.dumps({'_groups': ['Admins']})])
    ret = categories.fetchone()[0]
    return ret


def get_data(db, category, offset, filters, format='datagrid', schema = 'locaria_core'):

    print(f"Retrieving data for {category} on offset {offset}")
    q_params =   {"method" : "search", "format" : format, "category" : f"{category}", "offset" : offset}
    if filters != '':
        q_params.update(filters)

    data = db.execute(f"SELECT {schema}.locaria_gateway(%s,%s) AS p", [json.dumps(q_params), json.dumps({'_groups': ['Admins']})])
    ret = data.fetchone()[0]
    return ret


def writeFileJson(path,data):
    print(f"Writing {path}")
    with open(path, 'w') as p:
        json.dump(data,p)
    return path

def ogr_output(output, parameters):
     command = ['ogr2ogr']
     command.extend(parameters)
     command.extend([output])
     try:
         result = subprocess.run(command,check=True, capture_output=True)
     except subprocess.CalledProcessError  as error:
         print(f"OGR2OGR Output Error: {error.stderr.decode('utf-8')}")
         return {'status' : 'ERROR', 'message': "OGR2OGR Error in execution"}

     print(result)
     return {'status': 'SUCCESS', 'message': 'OGR2OGR file written'}