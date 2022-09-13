/**
 *  File events
 *
 *  When file hits the configured S3 bucket we need to add an event for the event processor to pickup
 */
'use strict';
let pg = require('pg');
const AWS = require("aws-sdk");

/**
 * This is called when the event happens
 * @param event
 * @param context
 * @param callback
 */
module.exports.run = (event, context, callback) => {

    //console.log(process.env);
    const conn= {
        user: process.env.auroraMasterUser,
        host: process.env.postgresHost,
        database: process.env.auroraDatabaseName,
        password: process.env.auroraMasterPass,
        port: process.env.postgresPort,
    }
    /*
     * Get the database connection
     */
    let client = new pg.Client(conn);
    client.connect();
    console.log(event);

    if(event['id']) {
        console.log('MODE ID');
        client.query("SELECT locaria_core.session_api('search_id', $1)", [event['id']], function (err, result) {
            if (err) {
                console.log(err);
                client.end();
                callback(null, {"response_code": 3000, "message": "search_id FAILED"});
            } else {
                sendWSMessage([result.rows[0].session_api.id]);
                console.log(result.rows[0].session_api.id);

            }
        });
    } else {
        console.log('MODE GROUP');
        client.query("SELECT locaria_core.session_api('search_group', $1)", [event['group']], function (err, result) {
            if (err) {
                console.log(err);
                client.end();
                callback(null, {"response_code": 3000, "message": "search_group FAILED"});
            } else {
                console.log(result.rows[0].session_api);
                sendWSMessage(result.rows[0].session_api);
            }
        });
    }


    function sendWSMessage(ids) {
        let websocketHttps=process.env['websocket'].replace(/wss:/,'https:');
        console.log(websocketHttps);
        const apiClient = new AWS.ApiGatewayManagementApi({
            apiVersion: '2018-11-29',
            endpoint: websocketHttps
        });

        let payload=JSON.stringify(event['packet']);

        let id=0;

        prepSend();

        function prepSend() {
            if (id < ids.length)
                doSend(id);
            else
                success();
        }

        function doSend(number) {
            let connectionId = ids[number];


            console.log(`Sending [${number}] - ${connectionId}`);
            console.log(payload);

            apiClient
                .postToConnection({ConnectionId: connectionId, Data: payload})
                .promise()
                .then(() => {
                    console.log(`Message sent to ${connectionId}!`);
                    id++;

                    prepSend();
                })
                .catch(e => {
                    if (e.statusCode === 410 || e.statusCode === 504) {
                        console.log(`Found stale connection, deleting ${connectionId}`);
                        // delete connectionId from your database or cache
                    } else {
                        console.log(`Failed to post. Error: ${JSON.stringify(e)}`);
                    }
                    id++;
                    prepSend();
                });

        }

    }

    function success() {
        callback(null,JSON.stringify({"response_code":200,"message":"Sent!"}));
        client.end();
    }
};