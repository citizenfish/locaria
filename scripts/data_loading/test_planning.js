const YAML = require("yaml");
const fs = require('fs')

const {load_planning_data} = require('./load_planning_data.js')

let command ={credentials : YAML.parse(fs.readFileSync('../../../locus-custom.yml', 'utf8')).test}
command['authority_id'] = 27
//const command = {authority_id: 27}

load_planning_data(command, (mess) => {console.log(mess)})
    .then(r =>{console.log('SUCCESS');console.log(r)})
    .catch(e => {console.log('ERROR');console.log(e)})

