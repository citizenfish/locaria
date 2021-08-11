/**
 * @author Richard Reynolds richard@nautoguide.com
 *
 * @description Lambda API
 *
 */

'use strict';
const Database = require("./database");
const AWS = require('aws-sdk');
const { uuid } = require('uuidv4');


const MAX_BYTES=50000;


module.exports.run = (event, context, callback) => {
	let client = null;

	const conn=`pg://${process.env.auroraMasterUser}:${process.env.auroraMasterPass}@${process.env.postgresHost}:${process.env.postgresPort}/${process.env.auroraDatabaseName}`;
	console.log(conn);
	//let conn = process.env.postgres;
	const suuid=uuid();

	const connectionId=event.requestContext.connectionId;
	const eventType=event.requestContext.eventType;
	console.log(`EVENT: ${eventType}`);
	console.log(`ID: ${connectionId}`);


	context.callbackWaitsForEmptyEventLoop = false;

	const apiClient  = new AWS.ApiGatewayManagementApi({
		apiVersion: '2018-11-29',
		endpoint: 'https://'+event.requestContext.domainName + '/' + event.requestContext.stage
	});

	/**
	 *  Connect to the database
	 * @type {Database}
	 */
	let database = new Database(client, conn, callback);
	switch(eventType) {
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
		client = database.getClient();
		client.query("SELECT locus_core.session_api('del', $1)", [connectionId], function (err, result) {
			if(err) {
				console.log(err);
			}
			console.log(result);
			callback(null, {statusCode: 200});
			client.end();

		});
	}

	function newSession() {
		client = database.getClient();
		let querysql = "SELECT locus_core.session_api('set', $1, $2::JSONB)";
		let qarguments = [connectionId,{"status":"Connected"}];
		client.query(querysql, qarguments, function (err, result) {
			if(err) {
				console.log(err);
				callback(null, {statusCode: 500 });
				client.end();

			} else {
				console.log('Done Connect');
				callback(null, {statusCode: 200 });
				client.end();


			}
		});

	}


	function processMessage() {

		const body=JSON.parse(event.body);
		const packet=body;


		let payload={"queue":packet.queue,"packet":{}};
		switch(packet.api) {
			case 'session':
				payload.packet.id=connectionId;
				sendToClient(payload);
				break;
			case 'api':
				client = database.getClient();
				let querysql = 'SELECT locus_core.locus_gateway($1::JSONB)';
				let qarguments = [packet.data];
				console.log(querysql);
				console.log(qarguments);
				client.query(querysql, qarguments, function (err, result) {
					if(err) {
						console.log(err);
						callback(null, {statusCode: 500 });
						client.end();

					} else {
						payload.packet = result.rows[0]['locus_gateway'];
						payload.method = packet.data.method;
						sendToClient(payload);
					}
				});
				break;

		}
	}

	function sendToClient(payload) {
		let currentPacket=0;
		let totalPackets=0;
		let packetArray=[];
		payload=JSON.stringify(payload);
		if(payload.length>MAX_BYTES) {
			totalPackets = Math.ceil(payload.length / MAX_BYTES);
			console.log(`total packets [${totalPackets}`);
			for (let i = 0; i < totalPackets; i++) {
				let loc = i * MAX_BYTES;
				let sub = payload.slice(loc, MAX_BYTES + loc);
				packetArray.push(sub);
			}
			_sendPacket();
		} else {
			_sendWS(payload,sendSuccess);
		}

		function _sendPacket() {
			if(currentPacket<totalPackets) {
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


		function _sendWS(payload,success) {
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
			client.end();

		}
	}


};

