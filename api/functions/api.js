/**
 * @author Richard Reynolds richard@nautoguide.com
 *
 * @description Lambda API
 *
 */

'use strict';
const Database = require("./database");

let client = null;

module.exports.run = (event, context, callback) => {

	const conn = `pg://${process.env.auroraMasterUser}:${process.env.auroraMasterPass}@${process.env.postgresHost}:${process.env.postgresPort}/${process.env.auroraDatabaseName}`;

	//let conn = process.env.postgres;

	/**
	 *  We support POST and GET, process the packet body based on method
	 * @type {any}
	 */
	let packet = {};
	if (event.httpMethod === 'GET') {
		packet.method = event.pathParameters.proxy;
		for (let i in event.queryStringParameters) {
			packet[i] = event.queryStringParameters[i];
		}
	} else {
		packet = JSON.parse(event['body']);

	}

	//packet.method = event.resource.match(/^\/([a-z_]*)/)[1];

	/**
	 *  Decode any URI encoding if this was a GET request
	 */
	for (let i in packet) {
		packet[i] = decodeURI(packet[i]);
	}


	context.callbackWaitsForEmptyEventLoop = false;

	console.log(packet);
	/**
	 *  Connect to the database
	 * @type {Database}
	 */
	let database = new Database(client, conn, callback);
	database.connect(stage1);


	/**
	 *  Process the call
	 */
	function stage1() {
		client = database.getClient();


		let querysql = 'SELECT locus_core.locus_gateway($1::JSONB)';
		let qarguments = [packet];
		console.log(querysql);
		console.log(qarguments);
		client.query(querysql, qarguments, function (err, result) {
			/**
			 *  SQL ERROR
			 */
			if (err) {
				console.log(err);
				callback(null, {
					statusCode: 220,
					headers: {
						"Content-Type": 'application/json',
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token,x-token",
						"Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT"
					},
					body: JSON.stringify({"error": "SQL failed"})
				});
			} else {
				/**
				 *  Successful request
				 */
				callback(null, {
					statusCode: 200,
					headers: {
						"Content-Type": 'application/json',
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token,x-token",
						"Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT"
					},
					body: JSON.stringify(result.rows[0].locus_gateway)
				});
			}
		});
	}

};

