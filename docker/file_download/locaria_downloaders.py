import xlsxwriter
import tempfile
import json
import pandas as pd
import boto3

def download_all(db, schema, parameters):
    print("Downloading all data")
    categories = get_categories(db)
    # Microsoft Excel output
    features = []
    if parameters['format'] == 'xlsx':
        print("Outputting XLSX")
        with pd.ExcelWriter(parameters['path']) as writer:
            for category in categories['categories']:
                features = get_category_data(db, category, parameters.get('filters',''))
                df = pd.json_normalize(features)
                df.to_excel(writer, sheet_name=f"{category}")
    #JSON output
    elif parameters['format'] == 'json':
        print("Outputting JSON")
        for category in categories['categories']:
            features.extend(get_category_data(db, category, parameters.get('filters','')))

        writeFileJson(parameters['path'], features)

    else:
        return {"status" : "DOWNLOAD_ERROR", 'message' : f"No processor for {parameters['format']}"}

    print(f"Wrote {parameters['path']}")

    s3 = boto3.client('s3')
    s3.upload_file(parameters['path'], parameters['s3_bucket'],  parameters['s3_path'])
    return {"status" : "DOWNLOAD_PROCESSED", "s3_path" : parameters['s3_path'], "s3_bucket": parameters['s3_bucket']}

def get_category_data(db, category, filters):
    print(f"Writing :{category}")
    features = []
    data = {'count' : 1}
    offset = 0
    while data['count'] > 0:
        data = get_data(db,category, offset, filters)
        features.extend(data['features'])
        offset = offset + 10000
    return features

def get_categories(db,schema = 'locaria_core'):
    try:
        print(f"Retrieving categories")
        q_params = {"method" : "list_categories_with_data"}
        categories = db.execute(f"SELECT {schema}.locaria_gateway(%s,%s) AS p", [json.dumps(q_params), json.dumps({'_groups': ['Admins']})])
        ret = categories.fetchone()[0]
        return ret
    except Exception as error:
        print("Cannot get categories", error)
        exit()

def get_data(db, category, offset, filters, schema = 'locaria_core'):
    try:
        print(f"Retrieving data for {category} on offset {offset}")
        q_params =   {"method" : "search", "format" : "datagrid", "category" : f"{category}", "offset" : offset}
        if filters != '':
            q_params.extend(filters)
        data = db.execute(f"SELECT {schema}.locaria_gateway(%s,%s) AS p", [json.dumps(q_params), json.dumps({'_groups': ['Admins']})])
        ret = data.fetchone()[0]
        return ret
    except Exception as error:
        print("Cannot get data", error)
        exit()

def writeFileJson(path,data):
    print(f"Writing {path}")
    with open(path, 'w') as p:
        json.dump(data,p)
    return path