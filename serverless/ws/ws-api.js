/**
 * @author Richard Reynolds richard@nautoguide.com
 *
 * @description Lambda API
 *
 */

'use strict';
const Database = require("./database");
const Timing = require("./timing");
const AWS = require('aws-sdk');
const {v4: uuidv4} = require('uuid');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

//data load api

const {update_file, delete_file, get_files} = require('./load_methods.js');
const MAX_BYTES = 50000;


module.exports.run = (event, context, callback) => {
    let times = new Timing();
    times.start("Setup");
    let client = null;
    let mask = undefined;

    //const conn = `pg://${process.env.auroraMasterUser}:${process.env.auroraMasterPass}@${process.env.postgresHost}:${process.env.postgresPort}/${process.env.auroraDatabaseName}`;
    const conn = {
        user: process.env.auroraMasterUser,
        host: process.env.postgresHost,
        database: process.env.auroraDatabaseName,
        password: process.env.auroraMasterPass,
        port: process.env.postgresPort,
    }
    const suuid = uuidv4();

    const connectionId = event.requestContext.connectionId;
    const eventType = event.requestContext.eventType;
    //console.log(`EVENT: ${eventType}`);
    //console.log(`ID: ${connectionId}`);


    context.callbackWaitsForEmptyEventLoop = false;

    //console.log(event.requestContext);
    /*	const apiClient = new AWS.ApiGatewayManagementApi({
            apiVersion: '2018-11-29',
            endpoint: 'https://' + event.requestContext.domainName + '/' + event.requestContext.stage
        });*/

    const apiClient = new AWS.ApiGatewayManagementApi({
        apiVersion: '2018-11-29',
        endpoint: 'https://' + event.requestContext.domainName + '/' + event.requestContext.stage
    });
    times.stop("Setup");

    /**
     *  Connect to the database
     * @type {Database}
     */
    times.start("Connect");

    let database = new Database(client, conn, callback);
    switch (eventType) {
        case 'CONNECT':
            console.log(`Connecting ${connectionId}`);
            database.connect(newSession);
            break;
        case 'DISCONNECT':
            console.log(`Disconnecting ${connectionId}`);
            database.connect(endSession);
            break;
        case 'MESSAGE':
            database.connect(processMessage);
            break;
        default:
            console.log(`Unknown event type ${eventType}`);
            break;
    }

    function endSession() {
        times.stop("Connect");

        client = database.getClient();
        client.query("SELECT locaria_core.session_api('del', $1)", [connectionId], function (err, result) {
            if (err) {
                console.log(err);
            }
            console.log(result);
            callback(null, {statusCode: 200});
            client.end();

        });
    }

    function newSession() {
        times.stop("Connect");

        client = database.getClient();
        let querysql = "SELECT locaria_core.session_api('set', $1, $2::JSONB)";
        let qarguments = [connectionId, {"status": "Connected", "groups": []}];
        client.query(querysql, qarguments, function (err, result) {
            if (err) {
                console.log(err);
                callback(null, {statusCode: 500});
                client.end();

            } else {
                console.log('Done Connect');
                callback(null, {statusCode: 200});
                client.end();


            }
        });

    }

    function updateSession(groups) {
        let querysql = "SELECT locaria_core.session_api('set', $1, $2::JSONB)";
        let qarguments = [connectionId, {"status": "Connected", "groups": groups}];
        client.query(querysql, qarguments, function (err, result) {
            if (err) {
                console.log(err);
            }
        });
    }


    function processMessage() {
        times.stop("Connect");

        const body = JSON.parse(event.body);
        const packet = body;


        if(packet&&packet.data) {
            if (packet.data.mask)
                mask = packet.data.mask;
            packet.data['_connectionIdWS'] = connectionId;
        }

        let payload = {"queue": packet.queue, "packet": {"response_code": 200}};
        switch (packet.api) {
            case 'session':
                payload.packet.id = connectionId;
                sendToClient(payload);
                break;
            // Public API
            case 'api':
                times.start("Query");

                client = database.getClient();
                let querysql = 'SELECT locaria_core.locaria_gateway($1::JSONB)';
                let qarguments = [packet.data];
                console.log(querysql);
                console.log(qarguments);
                client.query(querysql, qarguments, function (err, result) {
                    times.stop("Query");

                    if (err) {
                        console.log(err);
                        payload.packet['response_code'] = 310;
                        sendToClient(payload);

                    } else {
                        if (result.rows[0]['locaria_gateway'] === null) {
                            payload.packet['response_code'] = 500;
                            sendToClient(payload);
                        } else {
                            payload.packet = result.rows[0]['locaria_gateway'];
                            payload.timing = times.display();
                            payload.method = packet.data.method;
                            sendToClient(payload);
                        }
                    }
                });
                break;
            // Secure API
            case 'sapi':
                validateToken(packet, function (tokenPacket) {
                        client = database.getClient();
                        updateSession(tokenPacket['cognito:groups']);
                        if (tokenPacket['cognito:groups'] && tokenPacket['cognito:groups'].indexOf('Admins') !== -1) {
                            // inject groups / user from token
                            packet.data["_user"] = tokenPacket['cognito:username'];
                            packet.data["_group"] = tokenPacket['cognito:groups'];
                            packet.data["_email"] = tokenPacket['email'];
                            let querysql = 'SELECT locaria_core.locaria_internal_gateway($1::JSONB,$2::JSONB)';
                            /* For non admins
                                                        let qarguments = [packet.data, {
                                                            "owner": tokenPacket['cognito:username'],
                                                            "view": ["Moderator"]

                                                        }];
                            */
                            let qarguments = [packet.data, {
                                "owner": tokenPacket['cognito:username'],
                                "email": tokenPacket['email']
                            }];
                            console.log(querysql);
                            console.log(qarguments);
                            client.query(querysql, qarguments, function (err, result) {
                                if (err) {
                                    console.log(err);
                                    payload.packet['response_code'] = 311;
                                    sendToClient(payload);

                                } else {
                                    if (result.rows[0]['locaria_internal_gateway'] === null) {
                                        payload.packet['response_code'] = 500;
                                        sendToClient(payload);
                                    } else {
                                        payload.packet = result.rows[0]['locaria_internal_gateway'];
                                        payload.method = packet.data.method;
                                        sendToClient(payload);
                                    }
                                }
                            });
                        } else {
                            payload.packet['response_code'] = 312;
                            sendToClient(payload);
                        }
                    },
                    function (tokenPacket) {
                        payload.packet['response_code'] = 300;
                        payload.packet = tokenPacket;
                        sendToClient(payload);
                    });
                break;

            /// New loader API
            case 'lapi':
                validateToken(packet, function (tokenPacket) {
                        client = database.getClient();
                        updateSession(tokenPacket['cognito:groups']);
                        if (tokenPacket['cognito:groups'] && tokenPacket['cognito:groups'].indexOf('Loader') !== -1) {
                            // Valid user with loader token
                            let cb = (result) => {
                                sendToClient(result)
                            }
                            switch (packet.data.method) {
                                case 'get_files':
                                    get_files(packet, client, cb);
                                    break;
                                case 'add_file':
                                    add_file(packet);
                                    break;
                                case 'update_file':
                                    update_file(packet, client, cb);
                                    break;
                                case 'delete_file':
                                    delete_file(packet, client, cb);
                                    break;
                                default:
                                    payload.packet['response_code'] = 401;
                                    sendToClient(payload);
                                    break;
                            }
                        } else {
                            payload.packet['response_code'] = 313;
                            console.log(`tokenPacket['cognito:groups'] does not contain Loader!`);
                            sendToClient(payload);
                        }
                    },
                    function (tokenPacket) {
                        payload.packet['response_code'] = 300;
                        payload.packet = tokenPacket;
                        sendToClient(payload);
                    });
                break;
            case 'token':
                validateToken(packet, function (tokenPacket) {
                        client = database.getClient();
                        updateSession(tokenPacket['cognito:groups']);
                        payload.packet = tokenPacket;
                        sendToClient(payload);
                    },
                    function (tokenPacket) {
                        payload.packet['response_code'] = 300;
                        payload.packet = tokenPacket;
                        sendToClient(payload);

                    });
                break;
            default:
                payload.packet['response_code'] = 201;
                sendToClient(payload);
                break;


        }
    }

    function add_file(packet) {
        let payload = {"queue": packet.queue, "packet": {"response_code": 200}};

        client = database.getClient();
        let querysql = 'SELECT locaria_core.locaria_internal_gateway($1::JSONB)';
        packet.data.s3_bucket = process.env.importBucket;
        packet.data.s3_region = process.env.region;
        packet.data.status = 'REGISTERED';
        //packet.data.contentType=packet.data.contentType||'text/csv';
        if (packet.data.file_attributes === undefined)
            packet.data = {};
        packet.data.file_attributes.bucket = process.env.importBucket;
        packet.data.file_attributes.path = `incoming/`;
        packet.data.file_attributes.id_as_filename = true;

        let qarguments = [packet.data];
        console.log(querysql);
        console.log(qarguments);
        client.query(querysql, qarguments, function (err, result) {
            if (err) {
                console.log(err);
                payload.packet['response_code'] = 310;
                sendToClient(payload);

            } else {
                console.log(result.rows[0]['locaria_internal_gateway']);
                if (result.rows[0]['locaria_internal_gateway']['id'] === undefined) {
                    payload.packet['response_code'] = 500;
                    sendToClient(payload);
                } else {

                    let s3 = new AWS.S3();
                    let filePath = `incoming/${result.rows[0]['locaria_internal_gateway']['id']}.${packet.data.file_attributes.ext}`;

                    let s3parameters = {
                        Bucket: process.env.importBucket,
                        Key: filePath,
                        ContentType: packet.data.contentType
                    };
                    console.log(s3parameters);

                    let url = s3.getSignedUrl('putObject', s3parameters);
                    payload.packet = {
                        "url": url
                    };
                    payload.response_code = 200;
                    payload.method = packet.data.method;
                    sendToClient(payload);
                }
            }
        });


    }

    function validateToken(packet, success, fail) {
        if (packet.data.id_token === undefined) {
            fail({"message": "No id_token provided"});
            return;
        }
        const token = packet.data.id_token;
        console.log(token);
        const url = `https://cognito-idp.eu-west-1.amazonaws.com/${process.env.pool}/.well-known/jwks.json`;
        console.log(url);
        fetch(url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        }).then(res => res.json())
            .then(function (json) {
                console.log(`JSON RETURN`);
                console.log(json);
                let pems = {};
                let keys = json['keys'];
                for (let i = 0; i < keys.length; i++) {
                    //Convert each key to PEM
                    let key_id = keys[i].kid;
                    let modulus = keys[i].n;
                    let exponent = keys[i].e;
                    let key_type = keys[i].kty;
                    let jwk = {kty: key_type, n: modulus, e: exponent};
                    let pem = jwkToPem(jwk);
                    pems[key_id] = pem;
                }
                console.log(pems);
                //validate the token
                let decodedJwt = jwt.decode(token, {complete: true});
                console.log(decodedJwt);
                if (!decodedJwt) {
                    console.log("Not a valid JWT token");
                    fail({"message": "Not a valid JWT token"});
                } else {

                    let kid = decodedJwt.header.kid;
                    let pem = pems[kid];
                    if (!pem) {
                        console.log('Invalid pem');
                        fail({"message": "Invalid pem"});
                    } else {
                        jwt.verify(token, pem, function (err, tokenPayload) {
                            if (err) {
                                console.log("Invalid Token.");
                                fail({"message": `Invalid token ${err}`});
                            } else {
                                console.log("Valid Token.");
                                console.log(tokenPayload);
                                success(tokenPayload);
                            }
                        });
                    }
                }

            });
    }

    function compressGeoJSON(payload) {
        payload.packet.options.compress = {
            inc: 0,
            properties: {}
        }
        for (let f in payload.packet.geojson.features) {
            let compressedProperties = {};
            recurseProperties(payload, payload.packet.geojson.features[f].properties, compressedProperties, mask);
            payload.packet.geojson.features[f].properties = compressedProperties;
        }
        payload.packet.options.compress.properties = swapKeysAndValues(payload.packet.options.compress.properties);


    }

    function recurseProperties(payload, ptr, savePtr, maskPtr) {
        for (let p in ptr) {
            if (mask === undefined || (maskPtr[p] === true || typeof maskPtr[p] === 'object' )) {
                if (!payload.packet.options.compress.properties[p]) {
                    payload.packet.options.compress.properties[p] = payload.packet.options.compress.inc.toString(16);
                    payload.packet.options.compress.inc++;
                }
                if (typeof ptr[p] === 'object' && !Array.isArray(ptr[p]) && ptr[p] !== null) {
                    savePtr[payload.packet.options.compress.properties[p]] = {};
                    recurseProperties(payload, ptr[p], savePtr[payload.packet.options.compress.properties[p]], mask&&mask[p]? mask[p]:undefined);
                } else {
                    savePtr[payload.packet.options.compress.properties[p]] = JSON.parse(JSON.stringify(ptr[p]));
                }
            }
        }
    }

    function swapKeysAndValues(obj) {
        const swapped = Object.entries(obj).map(
            ([key, value]) => ({[value]: key})
        );
        return Object.assign({}, ...swapped);
    }

    function sendToClient(payload) {
        let currentPacket = 0;
        let totalPackets = 0;
        let packetArray = [];
        // detect geojson for compression
        if (payload.packet && payload.packet.options && payload.packet.geojson) {
            compressGeoJSON(payload);
        }
        payload = JSON.stringify(payload);
        if (payload.length > MAX_BYTES) {
            totalPackets = Math.ceil(payload.length / MAX_BYTES);
            console.log(`total packets [${totalPackets}`);
            for (let i = 0; i < totalPackets; i++) {
                let loc = i * MAX_BYTES;
                let sub = payload.slice(loc, MAX_BYTES + loc);
                packetArray.push(sub);
            }
            _sendPacket();
        } else {
            _sendWS(payload, sendSuccess);
        }

        function _sendPacket() {
            if (currentPacket < totalPackets) {
                let packet = Buffer.from(packetArray.shift()).toString('base64');
                currentPacket++;
                console.log(`packet:${currentPacket}-${totalPackets} Size: ${packet.length}`);
                _sendWS(JSON.stringify({
                    "frame": currentPacket,
                    "totalFrames": totalPackets,
                    "uuid": suuid,
                    "data": packet
                }), _sendPacket);
            } else {
                console.log('Done all packets');
                sendSuccess();
            }
        }


        function _sendWS(payload, success) {
            apiClient
                .postToConnection({ConnectionId: connectionId, Data: payload})
                .promise()
                .then(() => {
                    console.log(`Message sent to ${connectionId}!`);
                    success();
                })
                .catch(e => {
                    if (e.statusCode === 410 || e.statusCode === 504) {
                        console.log(`Found stale connection, deleting ${connectionId}`);
                        // delete connectionId from your database or cache
                    } else {
                        console.log(`Failed to post. Error: ${JSON.stringify(e)}`);
                    }
                    success();
                });
        }

        function sendSuccess() {
            callback(null, {statusCode: 200});
            if (client)
                client.end();

        }
    }


};

