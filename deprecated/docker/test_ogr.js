
const {loadGeopackage} = require('./load_utils')


command = {credentials : {auroraDatabaseName: 'daveb',
    auroraMasterUser: 'postgres',
    auroraMasterPass: '',
    auroraHost: 'localhost',
    auroraPort: 5432}}

command['output'] = 'test.geopackage'
command['parameters'] = {schema : 'test2'}
let file =  loadGeopackage(command)
console.log(file)