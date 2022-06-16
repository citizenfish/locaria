# Overview

file_loader.py is a python script for loading data into locaria. It is designed to be run from a docker container as it has dependecies upon gdal binaries and a number of other python modules.

# Running file_loader.py

The script can be run via two mechanisms:-

- command line
- Fargate docker process

## Command Line 

file_loader requires the following environment variables to be set in order to run from the command line:-

- LOCARIADB_<stage> = "porstgresql://user:password@hostname:port/database"
- AWS_ACCESS_KEY_ID = <An IAM credential that has read access to the S3 bucket for incoming files>
- AWS_SECRET_ACCESS_KEY = <As above>

gdal binaries must be installed with the following in your path:-

- ogr2ogr
- ogrinfo

You will need to have access to the locaria database via a VPN connection or other means.

The following python modules must be installed:-

- psycopg
- boto3
- requests
- datetime

Simply run it as follows:-

```shell
python3 file_loader.py
```

## Fargate docker process

In production file_loader is triggered automatically when a file is uploaded. This happens via the following steps:-

- A record in the **files** table is added or updated with status **REGISTERED**
- the trigger **files_trigger** is run which then makes a call to the function **aws_lambda_interface()** with parameters as follows:-

```json
{
  'function': 'file_loader', 
  'fargate': 'true', 
  'mode': 'Event'
}
```

- function <- this is the docker container that is going to be run
- fargate <- if true runs a fargate task
- mode <- Event runs the task asynchronously

This retrieves the parameter **fargate_config** from the parameters table which is as follows:-

```json
{
  "file_loader": {
    "arn": "arn of lambda to call",
    "task": "fargate task to run",
    "region": "region",
    "ecsName": "ECS container name",
    "ecrRepositoryUri": "ECR repository containing docker image",
    "vpcPrivateSubnetA": "subnet",
    "vpcPrivateSubnetB": "subnet",
    "ServerlessSecurityGroup": "sg-"
  }
}
```

This will trigger the function listed in arn (usually ecsRunner) which will launch the Fargate container containing **file_loader.py**

# Operation

file_loader.py runs through the following process:-

- read any local configuration from the file config.json, this contains the following:-

```json
{"db_var":"LOCARIADB","theme":"unittest","s3_var":"S3DLBUCKET"}
```
  - db_var <- the environment variable containing database credentials
  - s3_var <- the s3 bucket for downloads (not used)
  - theme <- the theme to append to environment variables


- establish a database connection
- read any additional parameters from the parameter **file_upload**
- retrieve a list of files with status=**REGISTERED**
- process each file in turn
- update the status of processed files

# File Processing Detail

Files are processed based upon the attributes stored in the file record. 

```json
{
  "extension" : "xls|csv|tsv|gpk|json|geojson|gpx", // defaults to csv
  "custom_loader" : "name of custom loader", //allows a custom routine to deal with file loading
  "path" : "path to the file on Amazon S3",
  "url" : "url of file if it is to be downloaded",
  "table_name": "name of table to load into|no_table_name", //ignored if id_as_filename set
  "id_as_filename": "true|false", //when files upload from client their path is set by the file_id this flag tells file_loader to compute the filename using this id and the extension
  "bucket": "s3 bucket where file is located",
  "layer" : ["layer1", "layer2"] //an array of layers to load (default all of them),
  "ogr_parameters" : ["-lco", "FOO=BAA"] //custom parameters to pass to ogr2ogr,
  "s_srs": "EPSG:4326" //source srs of file data
}
```

**custom_loader** routines are typically used for data that is downloaded via api calls in json or other formats. at present the following are supported:-

- planning_loader
- flood_loader
- os_opendata
- crime_loader
- thelist_events
- reed_jobs

A custom_loader routine is added as a function in the file custom_loaders.py

Each function should create a file that can be loaded by the main process. This is usually in either GEOJSON or GEOPACKAGE format.



