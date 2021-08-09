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

/*We need the following:

{
  "AWS_ACCESS_KEY_ID" :"foo",
  "AWS_SECRET_ACCESS_KEY" : "bbb",
  "region": "eu-west-1",
  "domain": "locus1..com",
  "auroraDatabaseName": "locus",
  "auroraMasterUser": "locus",
  "auroraMasterPass": "pass",
  "auroraHost": "host",
  "auroraPort": 3306,
  "osDataHubProductURL": "https://api.os.uk/downloads/v1/products",
  "dataSet" : "OpenNames"
}
*/

let configs = process.env;

module.exports.loadOSOpenData = async(params) =>  {

    if(params){
        configs = params;

        //set AWS environment variables when parameters passed in
        process.env['AWS_ACCESS_KEY_ID'] = configs.AWS_ACCESS_KEY_ID;
        process.env['AWS_SECRET_ACCESS_KEY'] = configs.AWS_SECRET_ACCESS_KEY;

    }
    const load = configs.dataSet;


    if (load === 'OpenNames' || load === '') {
        let res =  await loadOSOpenDataProduct('OpenNames');
        return res;
    } else {
        console.log('error');
        return {'error': "Product [" + load + "] not supported"};
    }



 async function loadOSOpenDataProduct(product) {
    console.log("Loading OS " + product + ".. checking current version");
    let osDataHubProductURL = configs.osDataHubProductURL;

    if (osDataHubProductURL === undefined) {
        return{'error' : "Missing osDataHubProductURL"};
    }

    /* Use OS API to get product list, find product then get version and file url */


     let json = await fetch(osDataHubProductURL).then(res => res.json());

     for (var i in json) {
         if (json[i].id === product) {
             let pURL = json[i].url;
             let pVer = json[i].version;

             //get the download url which means 3 calls to OS API
              console.log("Retrieving details for " + product + " version " + pVer);

              json = await fetch(pURL).then(res => res.json());

              const dURL = json.downloadsUrl;

              json = await fetch(dURL).then( res => res.json());

             for (var i in json) {
                 if (json[i].format === 'CSV') {
                     console.log("Loading " + product)
                     return loadDataS3({
                         version: pVer,
                         url: json[i].url,
                         product: product,
                         size: json[i].size
                     })


                 }
             }

         }

     }
}


async function loadDataS3(parameters) {


    //Compare our last version with the version present at OS datahub
    let makeDir = true;
    let version = '';
    let response;

    console.log(process.env);
    const s3Client = new S3Client({region: configs.region, signatureVersion: 'v4'});
    let command = new ListObjectsCommand({Bucket: configs.domain + "-data"})

    try {
         response = await s3Client.send(command);
    } catch(err){
        return {'stage' : 's3Client', 'error' : err.message}
    }


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


        let cmd = await new Promise(resolve => {
            request(parameters.url).pipe(file);
            file.on('finish', resolve);
        });

        return processZip(parameters);

    } else {
        console.log("Data in sync no need to upload to S3");
        return {message :  "Data in sync no need to upload to S3"};

    }

}

async function processZip(parameters) {
    console.log("Step 2 - Processing downloaded data");

    const outFilePath = parameters.dest + '.csv';
    try {
        fs.unlinkSync(outFilePath);

    } catch (e) {
        console.log("No output file to delete");
    }

    console.log("Unzipping");


    let zip = await new Promise(resolve => {

        yauzl.open(parameters.dest, {lazyEntries: true}, function (err, zipfile) {
            if (err) {
                console.log(err.message);
                resolve();
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

            }).once('end', async function () {
                zipfile.close();
                resolve();

            });
        })
    });


    return loadCSV(parameters, outFilePath)

}

async function loadCSV(parameters, outFilePath) {
    const headerFile = fs.createReadStream(outFilePath + ".header");

    let header = await streamToString(headerFile);
    let import_table = configs.import_table || 'locus_core.opennames_import';

    console.log("Step 3 - moving on to database load");

    header =  header.toLowerCase()
                        .split(',')
                        .map(function (value) {
                                return value + " TEXT"
                        })
                        .join(',')
                        .replace(/[^0-9A-Z_ ]/,'');

    let tableCreate = `DROP TABLE IF  EXISTS ${import_table} CASCADE; CREATE TABLE ${import_table}(${header});`;


    const client = new Client({
        user: configs.auroraMasterUser,
        host: configs.auroraHost,
        database: configs.auroraDatabaseName,
        password: configs.auroraMasterPass,
        port: configs.auroraPort,
    });

    client.connect();

    console.log("Step 4 - Loading " + parameters.product + " this may take some time.");

    let res = await new Promise( (resolve, reject) => {

        console.log("Creating Import table");

        client.query(tableCreate, function (err, res) {

            if (err) {
                console.log(tableCreate);
                console.log(err.stack)
                 reject(err.stack);
            } else {
                //Finally load the data
                console.log("Bulk loading data");

                let stream = client.query(copyFrom(`COPY ${import_table} FROM STDIN WITH CSV`));
                let fileStream = fs.createReadStream(outFilePath);
                fileStream.on('error', function (err) {
                    console.log(err.message);
                     reject(err.message);
                });
                stream.on('finish', function () {

                    resolve({});

                });
                fileStream.pipe(stream);
            }
        });
    }).catch(error => { return {'error' : error}});

    if(res.error) {
        return res;
    }

    console.log("Step 5 - Loaded " + parameters.product + " cleaning up and creating views");

    let fileStream = fs.createReadStream('./scripts/location_search_view.sql');
    let query = await streamToString(fileStream);

    let finish = await new Promise((resolve,reject) => {


        client.query(query, function (err, res) {

            if (err) {
                console.log(err.stack)
                reject(err.stack);
            }

            //clean up
            fs.unlinkSync(outFilePath);
            fs.unlinkSync(parameters.dest);
            console.log("View created");
            resolve({});
        });
    }).catch(error => { return {'error' : error}});

    if(finish.error) {
        return finish;
    }

    return {message: "All done"};
}

}