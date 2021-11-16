const {Client} = require('pg')
const fs = require("fs")
const {S3Client, GetObjectCommand} = require("@aws-sdk/client-s3")
const fastcsv = require('fast-csv')
const tmp = require('temporary')
const fetch = require("node-fetch");
const yauzl = require("yauzl");
const {execFile} = require("child_process");
const copyFrom = require('pg-copy-streams').from
const DBparse = require('pg-connection-string').parse;

const streamToString = (stream, toString = true) =>
    new Promise((resolve, reject) => {
        const chunks = []
        stream.on("data", (chunk) => chunks.push(chunk))
        stream.on("error", reject)
        stream.on("end", () => resolve(toString? Buffer.concat(chunks).toString("utf8") : Buffer.concat(chunks)))
    })

module.exports.streamLoader = async (parameters) => {

    const client = new Client(process.env.DBCONNECTION);
    let errors = 0
    let ret = await new Promise((resolve,reject) => {

        client.connect().catch(e => {
            console.log(e.stack)
            resolve({error: e.stack})
        })

        let stream = client.query(copyFrom(`COPY ${parameters.table}(category_id,attributes) FROM STDIN WITH CSV`))
        console.log('STREAM')
        stream.on('error', () => errors++)
        stream.on('end', () => {
            resolve({load_errors : errors})
        })
        console.log('CSV')
        fastcsv.writeToStream(stream, parameters.data)
            .on('error', (err) => {
                console.log(err)
                resolve({error: err})

            })
            .on('finish', () => {
                console.log('FINISH')
                resolve({load_errors : errors})
            })

    })

    return ret
}

module.exports.writeCSV = async (parameters) => {

    if(parameters.file_path === undefined){
        let file = new tmp.File()
        parameters["file_path"] = file.path
    }

    let errors = 0
    let ret = await new Promise((resolve,reject) => {

        fastcsv.writeToPath(parameters.file_path, parameters.data)
            .on('error', (err) => {errors++})
            .on('finish', () => {
                resolve({file_path : parameters.file_path, errors : 0})
            })
    })

    return ret
}

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
        return ({message: 'gets3File error', error: e})
    }

}

module.exports.runQuery =  async(parameters, values=[]) => {

    try {
        //query in parameters or read from file
        let fileStream = parameters.sqlFile ? fs.createReadStream(parameters.sqlFile) : ''
        let query = fileStream === '' ? parameters.query : await streamToString(fileStream)

        //Connection string must be passed in from environment
        const client = new Client(process.env.DBCONNECTION);

        return( await new Promise((resolve, reject) => {

            client.connect().catch(e => {
                console.log(e.stack)
                reject(e.stack)
            })


            client.query(query, values, (err, res) => {

                if (err) {
                    reject(err.stack)
                }

                client.end()
                resolve(res)
            });


        }))



    } catch(e){

        return ({error: 'runQuery error', message: e})
    }


}

const containerAPI =  async (parameters) => {


    let result =  await module.exports.runQuery({
            query: 'SELECT locus_core.locus_internal_gateway($1::JSONB) AS container'
        },
        [parameters])

    return result.rows !== undefined ? result.rows[0].container : result

}

module.exports.registerContainer = async(parameters) => {

    parameters["method"] = 'initialise_container'
    let result = await  containerAPI(parameters)
    if(!result.id) throw({result})
    return result.id
}

module.exports.updateContainerStatus = async (parameters) => {

    parameters["method"] = 'update_container'
    let result = await  containerAPI(parameters)
    if(!result.id) throw({result})
    return result

}

module.exports.downloadFileFromURL = async (parameters) => {

    let status = []
    let tmp_file = new tmp.File().path

    try {

        status.push({message: 'Begin download', data: parameters})

        const file = fs.createWriteStream(tmp_file)
        await new Promise(resolve => {

            fetch(parameters.url)
                .then(
                    res => new Promise((resolve) => {
                            res.body.pipe(file)
                            res.body.on('end', () => resolve())
                        }
                    ))
            file.on('finish', resolve);
        });

        status.push({message : `Downloaded ${parameters.url} to ${tmp_file}`})

        return({file_name : tmp_file, status : status})

    } catch (e) {
        return ({message: 'downloadFileFromURL', error: e})
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

module.exports.loadGeopackage = async(parameters) => {

    let status = []

    //`PG:dbname=${parameters.credentials.auroraDatabaseName} active_schema=${command.parameters.schema || 'locus_data'} user=${command.credentials.auroraMasterUser} password=${command.credentials.auroraMasterPass} port=${command.credentials.auroraPort} host=${command.credentials.auroraHost}`;
    let config = DBparse(process.env.DBCONNECTION)
    const db = `PG:dbname=${config.database} active_schema=${parameters.schema} user=${config.user} password=${config.password} port=${config.port} host=${config.host}`;

    let args = ['-f',     'PostgreSQL',
        '-lco',   'GEOMETRY_NAME=wkb_geometry',
        '-t_srs', 'EPSG:4326',
        '-skipfailures',
        db,
        parameters.file
    ];

    //Pass these config options via environment
    process.env.PG_USE_COPY='YES'
    process.env.OGR_TRUNCATE='YES'

    //Allow layers to be specified
    if(parameters.layers) {
        args = args.concat(parameters.layers)
    }

    status.push(args)

    try {
        let res  = await new Promise((resolve,reject) => {

            execFile('ogr2ogr', args, (error, stdout, stderr) => {
                if (error) {
                    status.push({errorMessage : 'ogr2ogr error',data: stderr})
                    reject(status)
                }
                status.push({statusMessage : 'ogr2ogr run',data: stdout})
                resolve(status)
            });
        });

        return status

    } catch(e){
        throw ({message: 'loadGeopackage error', error: e})
    }


}

module.exports.loadCSV = async(command) => {

 //TODO
}