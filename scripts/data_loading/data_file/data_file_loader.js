/**
 * This script runs in a docker container and acts as the controller for the data load process
 *
 */
const {load_excel} = require('./load_excel.js')

const {registerContainer, updateContainerStatus} = require('../loader_utils.js')
let containerId
/**
 * This function carries out the data load
 * @param id
 * @returns {Promise<void>}
 */

const loadFunction = async (parameters) => {
    let result = await load_excel(parameters, updateContainerStatus)

    if(result.error) {
        throw({error :result.error})
    }
    return result
}

//TESTING TODO REMOVE

process.env.CONTAINERID = 1

/**
 * We need to register our container, get an id and use this id for status updating
 */
updateContainerStatus({id: process.env.CONTAINERID, type: "data_file_loader"})
    .then(parameters => {
        containerId = parameters.id
        console.log(`Container initialised with id ${containerId}`)
        /* Call the loader */
        loadFunction(parameters)
            .then(result => {
                    updateContainerStatus({id: containerId, statusMessage: result, status: 'COMPLETED'})
                        .then(result => console.log(`Load process has completed`))
                }
            ).catch(error => {
                updateContainerStatus({id: containerId, errorMessage: error, status : 'ERROR'})
                    .then(result => {
                        console.log(`Load process has errored`)
                        console.log(error)
                    })
        })
        /* This is how you update status */

    })
    .catch(error => {
        // If the container has been created we move it into error status
        if (containerId !== undefined) {
            updateContainerStatus({id: containerId, errorMessage: error.message, status: 'ERROR'})
                .then(result => console.log(`Container ERROR status updated with id ${result}`))
        } else {
            console.log(` Something bad happened ${error}`)
        }
    })






