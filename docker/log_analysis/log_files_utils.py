import gzip
import tempfile
import boto3
import sys
import re
import json
import psycopg

def load_cloudfront_log_file(path, bucket,db):
    print(f"Loading {path} from {bucket}")

    tmp_dir = tempfile.gettempdir()
    tmp_file = f"{tmp_dir}/tmp.zip"
    records = []
    try:
        s3 = boto3.client('s3')
        with open(tmp_file, 'wb') as f:
            s3.download_fileobj(bucket,path,f)

        with gzip.open(tmp_file, 'rt') as ex:
            for line in ex:
                record = {}
                line = line.rstrip('\r\n')
                if re.search('^#Fields:', line):
                    line = line.replace('#Fields: ', '')
                    headers = line.split(' ')

                if re.search('^[0-9]+', line):
                    fields = re.split(r'\t',line)
                    record['filename'] = f"{bucket}/{path}"
                    for i in range(0, len(headers)):
                        record[headers[i]] = fields[i]
                    records.append(record)

        #print(records)
        #exit(0)
        query = 'INSERT INTO locaria_core.logs(log_type,log_message) VALUES(%s,%s::JSONB) RETURNING id'
        load = db.execute(query,['cloudfront', json.dumps(records)])
        db.commit()
        id = load.fetchone()[0]
        if id > 0:
            print(f"Loaded {path} with id {id} deleting log file")
            #s3.delete_object(Bucket=bucket, Key=path)

        return {'loaded' : path}

    except Exception as e:
        return {"error" : str(e)}