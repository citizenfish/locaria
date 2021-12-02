const {load_excel} = require('../../../../scripts/data_loading/data_file/load_excel.js')
const fs = require('fs')
const command = JSON.parse(fs.readFileSync('./../../../../command_gla.json', 'utf8'))

console.log(command)
main()

async function main() {
    const region = process.env.region || 'eu-west-1'
    const bucket = `${process.env.domain || 'locus1.nautoguide.com'}-data`
    command['region'] = region
    command['bucket'] = bucket
    try {
        let returnValue = await load_excel(command, update_status)
        console.log(returnValue)
    } catch(e){
        console.log(e.message)
    }

}
function update_status(status_update) {

    console.log(JSON.stringify(status_update))

}