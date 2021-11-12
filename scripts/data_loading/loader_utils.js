const {Client} = require('pg')
const fs = require("fs")
const {S3Client, GetObjectCommand} = require("@aws-sdk/client-s3")
const fastcsv = require('fast-csv')
const tmp = require('temporary')
const copyFrom = require('pg-copy-streams').from

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