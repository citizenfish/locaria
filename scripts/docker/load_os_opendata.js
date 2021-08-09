const fs = require('fs')
const readline = require('readline');

//For data downloads
const fetch = require('node-fetch');
const request = require('request');
const {S3Client, ListObjectsCommand, PutObjectCommand, GetObjectCommand} = require("@aws-sdk/client-s3");


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
const {Client} = require('pg')
const {execFile} = require("child_process");
let copyFrom = require('pg-copy-streams').from

/*We need the following:

{
  "AWS_ACCESS_KEY_ID" :"foo",
  "AWS_SECRET_ACCESS_KEY" : "bbb",
  "region": "eu-west-1",
  "domain": "locus1.com",
  "auroraDatabaseName": "locus",
  "auroraMasterUser": "locus",
  "auroraMasterPass": "",
  "auroraHost": "host",
  "auroraPort": ,
  "osDataHubProductURL": "https://api.os.uk/downloads/v1/products",
  "dataSet" : "OpenNames",
  "import_table" : ""
}
*/

let configs = process.env;


const sqlPath = {
    OpenNames: './opennames_view.sql',
    OpenUPRN : './openuprn_view.sql',
    BoundaryLine: './boundaryline_view.sql'
};

const formats = {
    OpenNames: 'GeoPackage',
    OpenUPRN: 'CSV',
    BoundaryLine: 'GeoPackage'
};

const defaultImportTable = 'locus_core.opennames_import';

module.exports.loadOSOpenData = async (params) => {

    if (params) {

        configs = params;
        configs['schema'] = configs.schema === undefined ? 'locus_data' : configs.schema;
        configs['header'] = configs.dataSet === 'OpenUPRN' ? 'HEADER' : '';

        //set AWS environment variables when parameters passed in
        process.env['AWS_ACCESS_KEY_ID'] = configs.AWS_ACCESS_KEY_ID;
        process.env['AWS_SECRET_ACCESS_KEY'] = configs.AWS_SECRET_ACCESS_KEY;

    }

    if (!sqlPath[configs.dataSet]) {
        return {'error': `Product ${configs.dataSet} not supported`};
    }

    global.result['loading'] = configs.dataSet;

    return await loadOSOpenDataProduct(configs.dataSet);


    async function loadOSOpenDataProduct(product) {

        global.result.status = "Loading OS " + product + ".. checking current version";
        let osDataHubProductURL = configs.osDataHubProductURL;

        if (osDataHubProductURL === undefined) {
            return {'error': "Missing osDataHubProductURL"};
        }

        /* Use OS API to get product list, find product then get version and file url */


        let json = await fetch(osDataHubProductURL).then(res => res.json());

        for (var i in json) {
            if (json[i].id === product) {
                let pURL = json[i].url;
                let pVer = json[i].version;

                //get the download url which means 3 calls to OS API
                global.result.status = "Retrieving details for " + product + " version " + pVer;

                json = await fetch(pURL).then(res => res.json());

                const dURL = json.downloadsUrl;

                json = await fetch(dURL).then(res => res.json());

                for (var i in json) {


                    if (formats[product] === json[i].format) {

                        global.result.status = "Loading " + product;

                        return await loadDataS3({
                            version: pVer,
                            url: json[i].url,
                            product: product,
                            size: json[i].size,
                            format: json[i].format
                        });

                    }
                }

            }

        }
    }


    async function loadDataS3(parameters) {


        //Compare our last version with the version present at OS datahub
        let version = '';
        let response;


        const s3Client = new S3Client({region: configs.region, signatureVersion: 'v4'});
        let command = new ListObjectsCommand({Bucket: configs.domain + "-data"})

        try {
            response = await s3Client.send(command);
        } catch (err) {
            return {'stage': 's3Client', 'error': err.message}
        }


        //Attempt to get version
        for (var i in response.Contents) {
            if (response.Contents[i].Key === parameters.product + '/version.txt') {
                //console.log("Folder Exists");

                //get the version string
                command = new GetObjectCommand({
                    Bucket: configs.domain + "-data",
                    Key: parameters.product + "/" + "version.txt"
                });

                response1 = await s3Client.send(command);
                const bodyContents = await streamToString(response1.Body);
                version = bodyContents.replace('[0-9\-]', '');
                console.log("Version [" + version + "]");
            }
        }


        //If the versions differ we need to download the data and upload it
        if (version !== parameters.version) {

            global.result.status = "Step 1 - downloading locally";

            const dest = "/tmp/data.zip";
            const file = fs.createWriteStream(dest);
            parameters['dest'] = dest;


            let cmd = await new Promise(resolve => {
                request(parameters.url).pipe(file);
                file.on('finish', resolve);
            });

            return await processZip(parameters);

        } else {

            return {message: "Data in sync no need to upload to S3"};

        }

    }

    async function processZip(parameters) {
        global.result.status = "Step 2 - Processing downloaded data";

        const outFilePath = parameters.dest + parameters.format.toLowerCase();
        try {
            //remove any previously downloaded data/headers
            fs.unlinkSync(outFilePath);
            fs.unlinkSync(outFilePath + ".header");

        } catch (e) {
            console.log("No output files to delete");
        }

        console.log("Unzipping");

        try {

            let zip = await new Promise((resolve, reject) => {

                 yauzl.open(parameters.dest, {lazyEntries: true, autoClose: true}, function (err, zipfile) {
                    if (err) {
                        console.log(err.message);
                        reject(err.message);
                    }

                    let finishedZip = false;
                    let header = false;
                    let csv = false;
                    let gpkg = false;

                    //Used to prevent race condition where zip closes before streams are written
                    const checkFinished = () => {

                        //OpenUPRN is single csv file with no header so we make it from file header
                        if(parameters.product === 'OpenUPRN' && csv && finishedZip){

                            const uprnFile = fs.createReadStream(outFilePath);
                            const reader = readline.createInterface({input: uprnFile});


                            let outLine = false;

                            reader.on('line', (line) => {
                                //writeFileSync will take time and the line event will fire multiple times in meantime so only write out once
                                if(!outLine){
                                    outLine = true;
                                    fs.writeFileSync(outFilePath + ".header", line);
                                }

                                reader.close();
                                resolve();
                            });

                        }

                        //OpenNames has a header file and csv files (if loading CSV version)
                        if (finishedZip && header && csv) {
                            resolve();
                        }

                        // GPKG processing
                        if(finishedZip && gpkg){
                            resolve();
                        }

                        //Only read after all writes are finished hence we move on here
                        zipfile.readEntry();
                    }

                    zipfile.readEntry();
                    zipfile.on('entry', function (entry) {


                        //CSV files
                        if (/csv/.test(entry.fileName)) {

                            process.stdout.write("Processing CSV " + entry.fileName + "\r");

                            zipfile.openReadStream(entry, function (err, readStream) {

                                if (err) {
                                    console.log(err.message);
                                    return;
                                }

                                //Read OS header into a separate file
                                if (/Docs(.*)csv/.test(entry.fileName)) {
                                    //Write to header file
                                    header = false;
                                    const outFile = fs.createWriteStream(outFilePath + ".header")
                                        .on('finish', () => {
                                            header = true;
                                            checkFinished()
                                        });
                                    readStream.pipe(outFile);
                                } else {
                                    //Append to csv file
                                    csv = false;
                                    const outFile = fs.createWriteStream(outFilePath, {'flags': 'a'})
                                        .on('finish', () => {
                                            csv = true;
                                            checkFinished()
                                        });
                                    readStream.pipe(outFile);
                                }

                            })
                        }  else if(/gpkg/.test(entry.fileName)){

                            process.stdout.write("Processing GPKG " + entry.fileName + "\r");

                            zipfile.openReadStream(entry, function (err, readStream) {

                                if (err) {
                                    console.log(err.message);
                                    return;
                                }


                                //Write to gpkg file
                                gpkg = false;
                                const outFile = fs.createWriteStream(outFilePath)
                                    .on('finish', () => {
                                        gpkg = true;
                                        checkFinished()
                                    });

                                readStream.pipe(outFile);


                            })
                        } else {
                            //console.log("Ignoring " + entry.fileName);
                            zipfile.readEntry();
                        }

                    });

                    zipfile.once('close', async function () {
                        finishedZip = true;
                        checkFinished();

                    });
                })
            });

        } catch (e) {
            return {error: 'Zip file error'}
        }


        if(parameters.format === 'CSV'){
            return await loadCSV(parameters, outFilePath);
        }

        if(parameters.format === 'GeoPackage') {
            return await loadGeoPackage(parameters,outFilePath);
        }


    }

    async function loadGeoPackage(parameters,outFilePath) {

        global.result.status = `Step 3 - moving on to database load [GeoPackage] ${outFilePath}`;

        const execFile = require('child_process').execFile;
        const db = `PG:dbname=${configs.auroraDatabaseName} user=${configs.auroraMasterUser} password=${configs.auroraMasterPass} port=${configs.auroraPort} host=${configs.auroraHost}`;

        let args = ['-f', "PostgreSQL",
                    '-lco', `SCHEMA=${configs.schema}`,
                    '-lco','OVERWRITE=YES',
                    '-t_srs', 'EPSG:4326',
                    '-overwrite',
                    db,
                    outFilePath
                   ];


        try {
            let res  = await new Promise((resolve,reject) => {

                execFile('ogr2ogr', args, (error, stdout, stderr) => {
                    if (error) {
                        console.log('stderr', stderr);
                        reject(error);
                    }
                    console.log(stdout);
                    resolve(stdout);
                });
            });

        } catch(e){
            return {error : e.message};
        }


        return await postProcess(parameters, outFilePath);
    }

    async function loadCSV(parameters, outFilePath) {


        const headerFile = fs.createReadStream(outFilePath + ".header");

        let header = await streamToString(headerFile);
        let import_table = configs.import_table || defaultImportTable;

        global.result.status = "Step 3 - moving on to database load";

        try {
            header = header.toLowerCase()
                .split(',')
                .map(function (value) {
                    return value + " TEXT"
                })
                .join(',')
                .replace(/[^0-9A-Z_ ]/, '');

            let tableCreate = `DROP TABLE IF  EXISTS ${import_table} CASCADE; CREATE TABLE ${import_table}(${header});`;


            const client = new Client({
                user: configs.auroraMasterUser,
                host: configs.auroraHost,
                database: configs.auroraDatabaseName,
                password: configs.auroraMasterPass,
                port: configs.auroraPort,
            });

            client.connect();

            global.result.status =  "Step 4 - Loading " + parameters.product + " this may take some time.";

            let res1 = await new Promise((resolve, reject) => {

                console.log("Creating Import table");

                client.query(tableCreate, function (err, res) {

                    if (err) {
                        console.log(tableCreate);
                        console.log(err.stack)
                        reject(err.stack);

                    }

                    resolve({});
                });
            });


            //Finally load the data
            global.result.status = "Bulk loading data";


            let res2 = await new Promise((resolve, reject) => {

                let stream = client.query(copyFrom(`COPY ${import_table} FROM STDIN WITH CSV ${configs.header}`));
                let fileStream = fs.createReadStream(outFilePath);
                fileStream.on('error', function (err) {
                    console.log(err.message);
                    reject(err.message);
                });
                stream.on('finish', function () {
                    console.log("Finished bulk load")
                    resolve({});

                });
                fileStream.pipe(stream);

            });


        } catch(e) {
            return {error : e.message};
        }

        return await postProcess(parameters, outFilePath, client);
    }

    async function postProcess(parameters, outFilePath, client){

        global.result.status = "Step 5 - Loaded " + parameters.product + " cleaning up and creating views";

        let fileStream = fs.createReadStream(sqlPath[parameters.product]);
        let query = await streamToString(fileStream);


        let finish = await new Promise((resolve, reject) => {


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
        });


        //Update version

        console.log("Updating version");

        const s3Client = new S3Client({region: configs.region, signatureVersion: 'v4'});

        let command = new PutObjectCommand({
            Bucket: configs.domain + "-data",
            Key: parameters.product + "/" + "version.txt",
            Body: parameters.version
        });

        let response = await s3Client.send(command);

        return {message: "All done"};
    }

}