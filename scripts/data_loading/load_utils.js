const {S3Client, GetObjectCommand,PutObjectCommand,DeleteObjectCommand} = require("@aws-sdk/client-s3")
const yauzl = require('yauzl')
const fs = require("fs")
const {execFile} = require("child_process")
const {Client} = require("pg")
const fetch = require("node-fetch");


const streamToString = (stream, toString = true) =>
    new Promise((resolve, reject) => {
        const chunks = []
        stream.on("data", (chunk) => chunks.push(chunk))
        stream.on("error", reject)
        stream.on("end", () => resolve(toString? Buffer.concat(chunks).toString("utf8") : Buffer.concat(chunks)))
})


module.exports.gets3File  = async (region,bucket,path, toString = true)  => {

        const s3Client = new S3Client({region: region, signatureVersion : "v4"});

        try {
                const S3command = new GetObjectCommand({
                        Bucket: bucket,
                        Key: path
                })

                let s3response = await s3Client.send(S3command)

                if(!s3response.Body){
                        return {error: "Command body empty"}
                }

                let fileContents = await streamToString(s3response.Body, toString)

                return fileContents

        } catch(e){
                throw ({message: 'gets3File error', error: e})
        }

}

module.exports.puts3File = async(region,bucket,path,body, contentType='application/json') => {

        const s3Client = new S3Client({region: region, signatureVersion : "v4"});

        try {

                const S3command = new PutObjectCommand({
                        Bucket: bucket,
                        Key: path,
                        Body: body
                })

                let s3response = await s3Client.send(S3command)

                return {message: s3response}

        } catch(e) {
                throw ({message: 'puts3File error', error: e})
        }

}

module.exports.deletes3File = async(region,bucket,path) => {

        const s3Client = new S3Client({region: region, signatureVersion : "v4"});
        console.log(`${region} ${bucket} ${path}`)
        try {

                const S3command = new DeleteObjectCommand({
                        Bucket: bucket,
                        Key: path
                })

                let s3response = await s3Client.send(S3command)

                return {message: s3response}

        } catch(e) {
                console.log(e)
                throw ({message: 'deletes3File error', error: e})
        }
}

module.exports.unzipFile = async(parameters) => {

        let returnValue = {processedFiles :[], input: parameters.input, output: parameters.output}

        try {
                await new Promise((resolve, reject) => {
                        yauzl.open(parameters.input, {
                                lazyEntries: true,
                                autoClose: true
                        },  (err, zipfile) => {

                                if (err) {
                                        console.log(err.message);
                                        reject(err.message);
                                }

                                let gpkg = false;
                                let finishedZip =false;

                                //make sure we have finished writing before we close the process
                                const checkFinished = () => {
                                        if(gpkg && finishedZip) {
                                                resolve()
                                        }
                                }
                                zipfile.readEntry()

                                zipfile.on('entry', (entry) =>{

                                        if(/gpkg|csv/.test(entry.fileName)){
                                                returnValue.processedFiles.push(entry.fileName)
                                                zipfile.openReadStream(entry,  (err, readStream) => {

                                                        if (err) {
                                                                console.log(err.message)
                                                                reject(err);
                                                        }

                                                        //ensure we finish writing before closing zip
                                                        gpkg = false;
                                                        const outFile = fs.createWriteStream(parameters.output)
                                                            .on('finish', () => {
                                                                gpkg = true;
                                                                checkFinished()
                                                        })

                                                        readStream.pipe(outFile)

                                                        readStream.on('end', ()=>{
                                                                zipfile.readEntry()
                                                        })


                                                })
                                        } else {
                                                zipfile.readEntry()
                                        }
                                })

                                zipfile.once('close', async function () {
                                        finishedZip = true
                                        checkFinished()

                                });

                        }
                )

                })

                return returnValue

        } catch(e){

                throw ({message: 'unzipFile error', error: e})
        }
}

module.exports.loadGeopackage = async(command) => {



        const db = `PG:dbname=${command.credentials.auroraDatabaseName} active_schema=${command.parameters.schema || 'locus_data'} user=${command.credentials.auroraMasterUser} password=${command.credentials.auroraMasterPass} port=${command.credentials.auroraPort} host=${command.credentials.auroraHost}`;

        let args = ['-f',     'PostgreSQL',
                    '-oo',    'LIST_ALL_TABLES=NO',
                    '-lco',   'OVERWRITE=YES',
                    '-lco',   'PG_USE_COPY=YES',
                    '-lco',   'OGR_TRUNCATE=YES',
                    '-lco',   'GEOMETRY_NAME=wkb_geometry',
                    '-t_srs', 'EPSG:4326',
                    '-skipfailures',
                    db,
                    command.output
        ];

        //Allow layers to be specified
        if(command.parameters.layers) {
                args = args.concat(command.parameters.layers)
        }

        try {
                let res  = await new Promise((resolve,reject) => {

                        execFile('ogr2ogr', args, (error, stdout, stderr) => {
                                if (error) {
                                        console.log('stderr', stderr)
                                        reject(error)
                                }
                                console.log(stdout)
                                resolve(stdout)
                        });
                });

                return {message : res}

        } catch(e){
                throw ({message: 'loadGeopackage error', error: e})
        }


}

//TODO refactor loadgeopackage as ogr2ogr will do this
module.exports.loadCSV = async(command) => {


}

module.exports.runQuery =  async(parameters, values=[]) => {

        try {
                //query in parameters or read from file
                let fileStream = parameters.sqlFile ? fs.createReadStream(parameters.sqlFile) : ''
                let query = fileStream === '' ? parameters.query : await streamToString(fileStream)


                const client = new Client({
                        user: parameters.credentials.auroraMasterUser,
                        host: parameters.credentials.auroraHost,
                        database: parameters.credentials.auroraDatabaseName,
                        password: parameters.credentials.auroraMasterPass,
                        port: parameters.credentials.auroraPort,
                });


                let finish = await new Promise((resolve, reject) => {

                        client.connect().catch(e => {reject(err.stack)})


                                client.query(query, values, (err, res) => {

                                        if (err) {
                                                reject(err.stack)
                                        }

                                        client.end()
                                        resolve(res)
                                });


                });

                return {message: finish}

        } catch(e){

                throw ({message: 'runQuery error', error: e})
        }


}

module.exports.fetch_sync = async (url, data) => {

        return await fetch(url).then(res => res.json());
}

module.exports.sleep = async (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
}