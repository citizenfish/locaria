/**
    file operations
 **/
let _ret = {}
let _querysql = 'SELECT locaria_core.locaria_internal_gateway($1::JSONB)'

let _runQuery = (packet,client,callback,error_code) => {

    client.query(_querysql, [packet],  (err, result) => {

        if(err) {
            callback({error :err, "response_code" : error_code})
        }

        callback(result.rows[0])
    })
}

module.exports.get_files =  (packet, client, callback) => {

    packet["method"] = 'get_files'

    _runQuery(packet,client,callback,1097)

    return _ret

}

module.exports.add_file = (packet,client,callback) => {

    packet["method"] = 'add_file'

    _runQuery(packet,client,callback,1098)

    return _ret


}

module.exports.update_file = (packet,client,callback) => {

    packet["method"] = 'update_file'

    _runQuery(packet,client,callback,1099)

    return _ret
}

module.exports.delete_file = (packet,client,callback) => {

    packet["method"] = 'delete_file'

    _runQuery(packet,client,callback,1100)

    return _ret
}

