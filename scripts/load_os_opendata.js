const fs = require('fs')


//For data downloads
const fetch = require('node-fetch');
const request = require('request');
const {S3Client, ListObjectsCommand, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");


//For decoding file contents as S3 api uses filestreams
const streamToString = (stream) =>
    new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });

//Unzip and process files
const yauzl = require('yauzl');
const { Client } = require('pg')
let copyFrom = require('pg-copy-streams').from

let configs = process.env;

module.exports.loadOSOpenData = (params) => {

    if(params){
        configs = params;
    }
    const load = configs.dataSet;

    if (load === 'OpenNames' || load === '') {
        return loadOSOpenDataProduct('OpenNames');
    } else {
        return {'error': "Product [" + load + "] not supported"};
    }



 function loadOSOpenDataProduct(product) {
    console.log("Loading OS " + product + ".. checking current version");
    let osDataHubProductURL = configs.osDataHubProductURL;

    if (osDataHubProductURL === undefined) {
        return{'error' : "Missing osDataHubProductURL"};
    }

    /* Use OS API to get product list, find product then get version and file url */

    fetch(osDataHubProductURL)
        .then(res => res.json())
        .then(json => {

            for (var i in json) {
                if (json[i].id === product) {
                    let pURL = json[i].url;
                    let pVer = json[i].version;

                    //get the download url which means 3 calls to OS API
                    console.log("Retrieving details for " + product + " version " + pVer);

                    fetch(pURL)
                        .then(res => res.json())
                        .then(json => {
                            let dURL = json.downloadsUrl;
                            fetch(dURL)
                                .then(res => res.json())
                                .then(json => {
                                    for (var i in json) {
                                        if (json[i].format === 'CSV') {
                                            loadDataS3({
                                                version: pVer,
                                                url: json[i].url,
                                                product: product,
                                                size: json[i].size
                                            });
                                        }
                                    }
                                })
                        })


                }
            }
        });

}


async function loadDataS3(parameters) {


    //Compare our last version with the version present at OS datahub
    let makeDir = true;
    let version = '';
    const s3Client = new S3Client({region: configs.region, signatureVersion: 'v4'});
    let command = new ListObjectsCommand({Bucket: configs.domain + "-data"})
    let response = await s3Client.send(command);


    //Do we need to create the version file ?
    for (var i in response.Contents) {
        if (response.Contents[i].Key === parameters.product + '/version.txt') {
            console.log("Folder Exists");
            makeDir = false;

            //get the version string
            command = new GetObjectCommand({
                Bucket: configs.domain + "-data",
                Key: parameters.product + "/" + "version.txt"
            });

            response = await s3Client.send(command);
            const bodyContents = await streamToString(response.Body);
            version = bodyContents.replace('[0-9\-]', '');
            console.log("Version [" + version + "]");
        }
    }

    //Create the directory
    if (makeDir) {
        console.log("Making new folder");
        command = new PutObjectCommand({
            Bucket: configs.domain + "-data",
            Key: parameters.product + "/" + "version.txt",
            Body: parameters.version
        });

        response = await s3Client.send(command);

    }

    //If the versions differ we need to download the data and upload it
    if (version !== parameters.version) {

        console.log("Step 1 - downloading locally");
        const dest = "/tmp/data.zip";
        const file = fs.createWriteStream(dest);
        parameters['dest'] = dest;

        request(parameters.url).pipe(file);
        file.on('finish', function () {
            file.close(processZip(parameters));
        })

    } else {
        console.log("Data in sync no need to upload to S3");
        return;

    }

}

function processZip(parameters) {
    console.log("Step 2 - Processing downloaded data");

    const outFilePath = parameters.dest + '.csv';
    try {
        fs.unlinkSync(outFilePath);

    } catch (e) {
        console.log("No output file to delete");
    }

    yauzl.open(parameters.dest, {lazyEntries: true}, function (err, zipfile) {
        if (err) {
            console.log(err.message);
            return;
        }


        zipfile.readEntry();
        zipfile.on('entry', function (entry) {
            if (/csv/.test(entry.fileName)) {
                console.log(entry.fileName);
                zipfile.openReadStream(entry, function (err, readStream) {
                    if (err) {
                        console.log(err.message);
                        return;
                    }
                    readStream.on('end', function () {
                        zipfile.readEntry();
                    });

                    //Read OS header into a separate file
                    if (/Docs(.*)csv/.test(entry.fileName)) {
                        const outFile = fs.createWriteStream(outFilePath + ".header");
                        readStream.pipe(outFile);
                    } else {
                        const outFile = fs.createWriteStream(outFilePath, {'flags': 'a'});
                        readStream.pipe(outFile);
                    }

                })
            } else {
                console.log("Ignoring " + entry.fileName);
                zipfile.readEntry();
            }

        }).on('end', function () {
            console.log("Step 3 - moving on to database load");
            //First we need to make our table create statement

            loadCSV(parameters, outFilePath)
        });
    });
}

async function loadCSV(parameters, outFilePath) {
    const headerFile = fs.createReadStream(outFilePath + ".header");
    let header = await streamToString(headerFile);
    //TODO move out of code
    let tableCreate = "CREATE TABLE IF NOT EXISTS locus_core.opennames_import(" +
        header.toLowerCase().split(',').map(function (value) {
            return value + " TEXT"
        }).join(',')
        + ")";


    const client = new Client({
        user: configs.auroraMasterUser,
        host: configs.auroraHost,
        database: configs.auroraDatabaseName,
        password: configs.auroraMasterPass,
        port: configs.auroraPort,
    });

    client.connect();

    client.query(tableCreate, function (err, res) {

        if (err) {
            console.log(err.stack)
        } else {
            //Finally load the data
            console.log("Step 4 - Loading " + parameters.product + " this may take some time.")
            let stream = client.query(copyFrom('COPY locus_core.opennames_import FROM STDIN WITH CSV'));
            let fileStream = fs.createReadStream(outFilePath);
            fileStream.on('error', function (err) {
                console.log(err.message);
            });
            stream.on('finish', function () {
                console.log("Step 5 - Loaded " + parameters.product + " cleaning up and creating views");

                //finally create the search view
                //TODO this should be in a config file
                const query = `DROP MATERIALIZED VIEW IF EXISTS locus_core.location_search_view;
							CREATE MATERIALIZED VIEW locus_core.location_search_view AS
							SELECT "﻿id" AS id,
							   ST_TRANSFORM(ST_GEOMFROMEWKT('SRID=27700;POINT('||geometry_x||' '||geometry_y||')'), 4326) AS wkb_geometry,
							  
							   name1 AS location,
							   local_type as location_type,
							   setweight(to_tsvector(COALESCE(name1,'')), 'A') ||
							   setweight(to_tsvector(COALESCE(name2,'')), 'B') ||
							   setweight(to_tsvector(COALESCE(populated_place,'')), 'C') ||
							  setweight(to_tsvector(COALESCE(district_borough,'')), 'D') AS tsv
							FROM   locus_core.opennames_import
							WHERE  local_type IN ('City','Town','Other Settlement','Village','Hamlet','Suburban Area','Named Road','Postcode');
							
							CREATE INDEX opennames_wkb_geometry_idx ON locus_core.location_search_view USING GIST(wkb_geometry);
							CREATE INDEX os_opennames_weighted_tsv  ON locus_core.location_search_view USING GIN(tsv);`;

                client.query(query, function (err, res) {
                    //clean up
                    fs.unlinkSync(outFilePath);
                    fs.unlinkSync(parameters.dest);
                    console.log("View created");
                    return;
                });

            });
            fileStream.pipe(stream);
        }
    });


}

}