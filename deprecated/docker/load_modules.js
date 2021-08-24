let pg = require('pg');
const fs = require("fs");
const fetch = require('node-fetch');

const streamToString = (stream) =>
    new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });

module.exports.gets3File  = async (bucket,path)  => {

    try {
        const S3command = new GetObjectCommand({
            Bucket: bucket,
            Key: path
        });

        let s3response = await s3Client.send(S3command);
        let fileContents = await streamToString(s3response.body);

        return fileContents;

    } catch(e){
        return {error : e.Code};
    }

}

module.exports.run_sql_from_file = async (file, client) => {

        let fileStream = fs.createReadStream(file);
        let query = await streamToString(fileStream);
        let returnResult;

        await new Promise((resolve, reject) => {

            client.connect()
            client.query(query)
                  .then(result => {returnResult = result; resolve()})
                  .catch(e => {reject(e.stack)})


        }).catch(e => {returnResult = {'error' : e}});


        client.end();

        return returnResult;

}

module.exports.fetch_sync = async (url, data) => {

    return await fetch(url).then(res => res.json());
}