/**
 * This script runs in a docker container and acts as the controller for the data load process
 *
 */
const {load_os_opendata} = require('./load_os_opendata.js')

const {updateContainerStatus} = require('../loader_utils.js')

/**
 * This function carries out the data load
 * @param id
 * @returns {Promise<void>}
 */

const loadFunction = async (parameters) => {
    let result = await load_os_opendata(parameters, updateContainerStatus)

    if (result.error) {
        throw({error: result.error})
    }
    console.log(result)
    return result
}

//TESTING TODO REMOVE
process.env.CONTAINERID = 2

/**
 * We need to register our container, get an id and use this id for status updating
 */

let loader_wrapper = async() => {

    try {
        let init = await updateContainerStatus({
            id: parseInt(process.env.CONTAINERID),
            type: "os_opendata_loader",
            status: 'FARGATE_RUNNING'
        })
        let load = await loadFunction(init)
        let finish = updateContainerStatus({id: init.id, statusMessage: load, status: 'COMPLETED'})
        process.exit(1)
    } catch(e) {
        console.log(e)
        updateContainerStatus({
            id: process.env.CONTAINERID,
            type: "data_file_loader",
            status: 'FARGATE_FAILED',
            errorMessage : e
        })
    }
}

loader_wrapper()
