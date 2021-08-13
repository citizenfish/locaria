//requires
const {load_os_opendata} = require('./load_os_opendata.js')
const utils = require('./load_utils.js')


///Variables
const region = process.env.region || 'eu-west-1'
const bucket = `${process.env.domain || 'locus1.nautoguide.com'}-data`
const path = 'command.json'
const status_path = 'status.json'
let status = []

main()

async function main(){

    let command = JSON.parse(await utils.gets3File(region,bucket,path))
    let returnValue = ''

    if(command.error) {
        console.log({error : 'Failed', bucket : bucket, diagnostics : command})
        return(command)
    }

    //TODO check to see if a command is already in progress and return if so
    await update_status({messasge : 'read command', status : 'success', command: command})


    command['region'] = region
    command['bucket'] = bucket

    //trigger the required command
    try {
        switch (command.command) {

            case 'load_os_opendata':

                returnValue = await load_os_opendata(command, update_status)
                break;

            default:
                await update_status({
                    operation: 'execute command',
                    status: 'error',
                    error: `Invalid command ${command.command}`
                })

        }
    } catch(e){

        update_status({message: 'Error in load', details: e})
        returnValue = {error : e}
    }
    return(returnValue);
}

async function update_status(status_update)  {

    console.log(status_update.message)

    //we pass this function into modules so persist the s3 details
    this.region = region;
    this.bucket = bucket;
    this.status_path = status_path;

    //Add a timestamp

    status_update['timestamp'] = Date().toLocaleString()
    //Add status to array and write to S3
    status.push(status_update);
    return await utils.puts3File(region,bucket,status_path,JSON.stringify(status));

}










