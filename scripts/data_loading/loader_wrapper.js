/**
 * This script runs in a docker container and acts as the controller for the data load process
 *
 */

const {Client} = require('pg')

const queryRunner = async (parameters, values = [], callback) => {

    let fileStream = parameters.sqlFile ? fs.createReadStream(parameters.sqlFile) : ''
    let query = fileStream === '' ? parameters.query : await streamToString(fileStream)
    const client = new Client(parameters.connectionString);

    client.connect().catch(e => {
        console.log(e.stack)
        callback({error: e.stack})
    })

    client.query(query, values, (err, res) => {

        if (err) {
            console.log(err.stack)
            callback({error: err.stack})
        }

        client.end()
        callback(res)
    });
}

queryRunner({
        connectionString: process.env.DBCONNECTION,
        query: 'SELECT locus_core.locus_internal_gateway($1::JSONB)'
    },
    [{method: "initialise_container", type: "test_loader"}],
    (ret) => {
        console.log(ret)
    })
