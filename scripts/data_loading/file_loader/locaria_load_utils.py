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

def get_file_details(db, schema, fileID):

    q = db.prepare(f"SELECT status,attributes from {schema}.files WHERE id = $1")
    file = q(fileID)

    if len(file) == 0:
        print(f"File {fileID} not found")
        exit()

    q = db.prepare(f"UPDATE {schema}.files SET status = 'PREUPLOAD' WHERE id = $1")
    update = q(fileID)

    if update[1] != 1:
        print(f"Unable to update file {fileID} status")
        exit()

    return file[0]

def move_to_temp(_fileDetails):
    fileDetails = json.loads(_fileDetails)
    tmp_dir = tempfile.gettempdir()
    s3 = boto3.client('s3')
    try:

        with tempfile.NamedTemporaryFile() as tmp:
            s3.download_fileobj(fileDetails['bucket'], fileDetails['path'], tmp)

    except Exception as e:
        print(f"S3 download error {e}")
        exit()

def ogr_loader(fileName, parameters, layers = []):
    print(f"ogr_loader loading {fileName} with parameters {parameters} and layers {layers}")

def file_status(db,schema,status,statusMessage):
    q = db.prepare(f"UPDATE {schema}.files set status = $1)