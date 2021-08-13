const {S3Client, GetObjectCommand,PutObjectCommand} = require("@aws-sdk/client-s3")
const yauzl = require('yauzl');
const fs = require("fs");
const {execFile} = require("child_process");
const {Client} = require("pg");
const {runQuery} = require("./load_utils");
const copyFrom = require('pg-copy-streams').from

const streamToString = (stream) =>
    new Promise((resolve, reject) => {
        const chunks = []
        stream.on("data", (chunk) => chunks.push(chunk))
        stream.on("error", reject)
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
});

module.exports.gets3File  = async (region,bucket,path)  => {

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

                let fileContents = await streamToString(s3response.Body)

                return fileContents

        } catch(e){
                return {error: e}
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
                return {error: e}
        }

}

module.exports.unzipFile = async(parameters) => {

        let returnValue = {processedFiles :[], input: parameters.input, output: parameters.output}

        try {
                await new Promise((resolve, reject) => {
                        yauzl.open(parameters.input, {
                                lazyEntries: true,
                                autoClose: true
                        }, function (err, zipfile)
                        {

                                if (err) {
                                        console.log(err.message);
                                        reject(err.message);
                                }

                                zipfile.readEntry()

                                zipfile.on('entry', (entry) =>{

                                        if(/gpkg|csv/.test(entry.fileName)){
                                                returnValue.processedFiles.push(entry.fileName)
                                                zipfile.openReadStream(entry, function (err, readStream) {

                                                        if (err) {
                                                                console.log(err.message)
                                                                reject(err);
                                                        }

                                                        const outFile = fs.createWriteStream(parameters.output)

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
                                        console.log('zip done')
                                        resolve()

                                });

                        }
                )

                })

                return returnValue

        } catch(e){
                console.log(e)
                return {error: e}
        }
}

module.exports.loadGeopackage = async(command) => {



        const db = `PG:dbname=${command.credentials.auroraDatabaseName} active_schema=${command.parameters.schema || 'locus_data'} user=${command.credentials.auroraMasterUser} password=${command.credentials.auroraMasterPass} port=${command.credentials.auroraPort} host=${command.credentials.auroraHost}`;

        let args = ['-f',     'PostgreSQL',
                    '-lco',   'OVERWRITE=YES',
                    '-lco',   'GEOMETRY_NAME=wkb_geometry',
                    '-lco',   'PG_USE_COPY=YES',
                    '-lco',   'OGR_TRUNCATE=YES',
                    '-t_srs', 'EPSG:4326',
                    '-skipfailures',
                    db,
                    command.output
        ];


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
                return {error : e.message}
        }


}

module.exports.loadCSV = async(command) => {

        try {
                //read header from first line of file
                let header = ''
                let import_table = command.import_table

                await new Promise( (resolve) => {
                        const dataFile = fs.createReadStream(command.output)
                        const reader = readline.createInterface({input: dataFile})

                        reader.on('line', (line) => {
                                header = line
                                reader.close()
                                resolve()
                        })
                })

                if(header === ''){
                        return {error : "Cannot read header"}
                }

                //Now make the table
                header = header.toLowerCase()
                    .split(',')
                    .map(function (value) {
                            return value + " TEXT"
                    })
                    .join(',')
                    .replace(/[^0-9A-Z_ ]/, '');

                command['query'] = `DROP TABLE IF  EXISTS ${import_table} CASCADE; CREATE TABLE ${import_table}(${header});`;
                let res = await runQuery(command)

                //import the data
                let res2 = await new Promise((resolve, reject) => {

                        let stream = client.query(copyFrom(`COPY ${import_table} FROM STDIN WITH CSV HEADER`));
                        let fileStream = fs.createReadStream(command.output);
                        fileStream.on('error', function (err) {
                                reject(err.message);
                        });
                        stream.on('finish', function () {
                                resolve({});
                        });
                        fileStream.pipe(stream);

                });

                return {message : 'CSV data load complete'}

        } catch(e) {
                return {error : e.message};
        }


}

module.exports.runQuery =  async(parameters) => {

        try {
                //query in parameters or read from file
                let filestream = parameters.sqlFile ? fs.createReadStream(parameters.sqlFile) : ''
                let query = filestream === '' ? parameters.query : await streamToString(fileStream)

                const client = new Client({
                        user: parameters.credentials.auroraMasterUser,
                        host: parameters.credentials.auroraHost,
                        database: parameters.credentials.auroraDatabaseName,
                        password: parameters.credentials.auroraMasterPass,
                        port: parameters.credentials.auroraPort,
                });

                let finish = await new Promise((resolve, reject) => {

                        client.query(query, function (err, res) {

                                if (err) {
                                        console.log(err.stack)
                                        reject(err.stack);
                                }


                                resolve(res);
                        });
                });

                return {message: res}

        } catch(e){
                return {error : e.message};
        }


}