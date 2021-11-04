const fs = require('fs')
const YAML = require('yaml')

const Database = require("../../../api/functions/database.js");
const {get_containers,instantiate_container,get_container_status} =  require('../../../api/functions/data_loader/load_methods.js');

//Read database config

const file = fs.readFileSync('../../../../locus-env.yml', 'utf8')
const conn = YAML.parse(file).local.postgres

let client = null
let database = new Database(client, conn, (e)=>{console.log(e)})

let callback =  (result) => {

    console.log(result)
}

//TEST get_containers
database.connect(() =>{
    client = database.getClient();
    get_containers({},client,callback)
})

