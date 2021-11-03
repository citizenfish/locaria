const fetch = require('node-fetch')
const utils = require('../load_utils.js')
const {S3Client, PutObjectCommand} = require("@aws-sdk/client-s3");
const fs = require('fs')

const formats = {
    OpenNames: 'GeoPackage',
    OpenUPRN: 'GeoPackage',
    OpenUSRN: 'GeoPackage',
    BoundaryLine: 'GeoPackage'
}

//SQL to run post install
const sqlPath = {
    OpenNames: './opennames_view.sql',
    OpenUPRN : './openuprn_view.sql',
    BoundaryLine: './boundaryline_view.sql'
}

const suffix = {
    geopackage: 'gpkg',
    csv: 'csv'
}

const zipFile = '/tmp/zipfile.zip'
const outFile = '/tmp/outfile'

module.exports.load_os_opendata = async (command, us) => {


        us({message: "Loading OS Open Data", details: command.parameters.dataSet})

        //We need to know what we are loading and where we get it from
        let osDataHubProductURL = command.parameters.osDataHubProductURL
        let product = command.parameters.product

        if (osDataHubProductURL === undefined) {
            return {'error': "Missing osDataHubProductURL"};
        }

        //Get download URL and version from OS Datahub
        let productURL = await getProductURL(product);

        //Check version, if we have it already then no need to load
        let version = await checkVersion(productURL)

        if (version.load == false) {
            us({message: "Data is up to date load cancelled", details: version.version})
            //TODO UNCOMMENTS!!
            //return {message: `${product} is already up to date version ${version.version}`}
        }

        us({message: "Loading commenced", details: version, product: product})


        //Download and unzip the data file
        let unzip = await downloadAndUnzip(productURL)
        us({message: "Unzip complete, loading to database", details : unzip, format: productURL.format})

        //Add input/output files to command so we can delete later
        command = Object.assign(command, unzip)

        //Load the file into the database
        let dbLoad = productURL.format === 'GeoPackage' ? await utils.loadGeopackage(command) : await utils.loadCSV(command)
        us({message: "DB Load complete", details: dbLoad})

        //Post process SQL to create indexes, views and any other data mangling
        command['sqlFile'] = command.sqlFile ? command.sqlFile : sqlPath[product];

        let ppSQL = command.sqlFile ? await utils.runQuery(command) : {message: 'No SQL File provided'}
        us({message: "Post Process complete", details: ppSQL})

        //tidy up, delete download and processed files
        fs.unlinkSync(zipFile)
        fs.unlinkSync(unzip.output)

        //update version loaded in S3
        const s3Client = new S3Client({region: region, signatureVersion: 'v4'})
        let s3command = new PutObjectCommand({
            Bucket: bucket,
            Key: `${product}/version.txt`,
            Body: version.version
        });

        let response = await s3Client.send(s3command)
        us({message: "Tidy Up complete", details: response})

        return {message : "Loaded OS Opendata", product: product, productURL: productURL, version: version}


    /*
    All OS opendata is provided in ZIP format so we need to download it and then unzip it before loading into database
     */
    async function downloadAndUnzip(productURL) {

        try {
                //First we download the file to a temporary location
                us({message: 'Begin download', details: productURL})
                const file = fs.createWriteStream(zipFile)
                await new Promise(resolve => {

                    fetch(productURL.url)
                        .then(
                            res => new Promise((resolve) => {
                                    res.body.pipe(file)
                                    res.body.on('end', () => resolve())
                                }
                            ))
                    file.on('finish', resolve);
                });

                let zipoutput = `${outFile}.${suffix[productURL.format.toLowerCase()]}`
                us({message : `Downloaded ${productURL.url} to ${zipFile} unzipping to ${zipoutput}`})


                //Next we unzip the file
                return(await utils.unzipFile({input: zipFile, output: `${zipoutput}`}))

        } catch (e) {
            throw ({message: 'downloadAndUnzip', error: e})

        }
    }

    /*
    This function checks the version provided by OS against the last version loaded in order to decide
    whether or not to proceed with load
     */
    async function checkVersion(productDetails) {

        try {
            let path = `${productDetails.product}/version.txt`
            let version = await utils.gets3File(command.region,command.bucket, path)
            let returnValue = false;


            if((version.error && version.error.message == 'NoSuchKey') || version !== productDetails.version){
                version = productDetails.version;
                returnValue = true
            }

            return {load: returnValue, version: version || productDetails.version}


        } catch(e) {

            return ({load: true, version: productDetails.version})
        }
    }
    /*
    This function calls the OS Data Hub API to get details of the product downloads
    If they match our requirements then a url and version is returned
     */
    async function getProductURL(product) {

        try {

            let json = await fetch(osDataHubProductURL).then(res => res.json());

            for (var i in json) {

                if (json[i].id === product) {

                    let pURL = json[i].url;
                    let pVer = json[i].version;

                    //get the download url which means 3 calls to OS API

                    json = await fetch(pURL).then(res => res.json())

                    const dURL = json.downloadsUrl;

                    json = await fetch(dURL).then(res => res.json())
                    for (var i in json) {


                        if (formats[product] === json[i].format) {

                            return {
                                version: pVer,
                                url: json[i].url,
                                product: product,
                                size: json[i].size,
                                format: json[i].format
                            };

                        }
                    }

                }

            }

            throw {error: `Product ${product} not found`}

        } catch(e) {

            throw ({message: 'getProductURL error', error: e})
        }

    }
}

