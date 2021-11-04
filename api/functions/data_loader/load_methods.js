/**
    get_containers - connect to database and retrieve a list of containers via the internal api
 */

module.exports.get_containers =  (packet, client, callback) => {

    console.log("get_containers")
    let ret = {}
    let querysql = 'SELECT locus_core.locus_internal_gateway($1::JSONB)';
    let qarguments= [{method: "get_containers"}];

    client.query(querysql, qarguments,  (err, result) => {

        if(err) {
            callback({error :err, "response_code" : 1097})
        }

        callback(result.rows[0])
    })

    return ret

}

module.exports.instantiate_container = (packet,client) => {

    return {
        "container_id" : 12345,
        "user_message" : "Foo baa"
    }
}

module.exports.get_container_status = (packet,client) => {

    return {
        "response_code" : 200,
        "message" : "Text message",
        "attributes" : {
            "log_messages" : [
                {
                    "date" : "DD-MM-YYYY HH:MM:SS",
                    "log" : "This is the log message"
                }
            ],
            "last_error" : "Last error message",
            "progress" : "20%"
        },
        "last_update" : "DD-MM-YYYY HH:MM:SS"
    }
}