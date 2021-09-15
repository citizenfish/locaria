//requires
const {load_os_opendata} = require('./os_opendata/load_os_opendata.js')
const {load_planning_data} = require('./planning/load_planning_data.js')
const {load_crime_data} = require('./crime/load_crime_data')
const {load_excel} = require('./data_file/load_excel.js')

const {gets3File,puts3File,deletes3File} = require('./load_utils.js')


///Variables
const region = process.env.region || 'eu-west-1'
const bucket = `${process.env.domain || 'locus1.nautoguide.com'}-data`
const path = 'command.json'
let status_path = 'status.json'
let status = []

main()

async function main() {

    let command = {}
    let returnValue = ''

    try {
        //read the command file from s3
        command = JSON.parse(await gets3File(region, bucket, path))

        if (command.error) {
            console.log({error: 'Failed', bucket: bucket, diagnostics: command})
            return
        }

        status_path = `${command.parameters.product}_${status_path}`

        //Check to see if a command is already in progress and return
        let current_status = JSON.parse(await gets3File(region, bucket, status_path))

        if (current_status[current_status.length - 1].status !== 'end') {
            console.log({error: `${status_path} is already processing`, details: current_status})
            await deletes3File(region, bucket, path)
            //TODO if command is still in processing after too long then re-run
            return
        }
    } catch (e) {
        if(!command.command) {
            update_status({message: e, status: 'error'})
            return
        }

    }

    await update_status({message: 'read command', status: 'processing', command: command.command})

    command['region'] = region
    command['bucket'] = bucket

    //trigger the required command
    try {
        switch (command.command) {

            case 'load_os_opendata':
                returnValue = await load_os_opendata(command, update_status)
                break

            case 'load_planning_data':
                returnValue = await load_planning_data(command, update_status)
                break

            case 'load_crime_data':
                returnValue = await load_crime_data(command, update_status)
                break

            case 'load_excel':
                returnValue = await load_excel(command, update_status)
                break

            default:
                returnValue = {
                    message: 'execute command failure',
                    status: 'error',
                    error: `Invalid command ${command.command}`
                }

        }
    } catch (e) {

        await update_status({message: 'Error in load', details: e, e_details: e.message, status: 'error'})
        returnValue = {error: e}
    }

    await update_status({message: returnValue, status: 'end'})
    //TODO remove comment out
    // await deletes3File(region, bucket, path)
    return
}

async function update_status(status_update) {

    console.log(JSON.stringify(status_update))


    //we pass this function into modules so persist the s3 details
    this.region = region
    this.bucket = bucket
    this.status_path = status_path

    //Add a timestamp

    status_update['timestamp'] = Date().toLocaleString()
    //Add status to array and write to S3
    status.push(status_update);

    try {
        return await puts3File(region, bucket, status_path, JSON.stringify(status))
    } catch (e) {
        console.log(e)
        return
    }

}