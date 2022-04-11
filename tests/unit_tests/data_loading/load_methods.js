const fs = require('fs')


const Database = require("../../../src/deprecated/api/functions/database.js");
const {get_files,add_file,update_file,delete_file} =  require('../../../src/deprecated/api/functions/data_loader/load_methods.js');

//Read database config

const file = fs.readFileSync('../../../../locaria.json', 'utf8')
const conn = JSON.parse(file).new.postgresConnection

let client = null
let database = new Database(client, conn, (e)=>{console.log(e)})
let update = false
let deleteV = false

let callback =  (result) => {

    console.log(result)

    if(result.locaria_internal_gateway.id !== undefined && !update) {
        console.log('UPDATING')
        database.connect(() =>{
            client = database.getClient();
            update = true
            update_file({'id' : result.locaria_internal_gateway.id, 'name' : 'UPDATED NAME', 'status': 'UPDATED STATUS'},client,callback)
        })
    }

    if(result.locaria_internal_gateway.id !== undefined && update && !deleteV) {
        console.log('DELETING')
        database.connect(() =>{
            client = database.getClient();
            deleteV = true
            delete_file({'id' : result.locaria_internal_gateway.id},client,callback)
        })
    }
}

//TEST get_files
database.connect(() =>{
    client = database.getClient();
    get_files({"status" : "DELETED"},client,callback)
})

//TEST add_file
database.connect(() =>{
    client = database.getClient();
    add_file({'type' : 'csv', 'name' : 'Test File'},client,callback)
})



