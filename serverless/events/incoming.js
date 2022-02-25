/**
 *  File events
 *
 *  When file hits the configured S3 bucket we need to add an event for the event processor to pickup
 */

'use strict';
const Database = require("./database");
const env = process.env;

/**
 * This is called when the event happens
 * @param event
 * @param context
 * @param callback
 */
module.exports.run = (event, context, callback) => {
	let client=null;
	/*
	 * Get the database connection
	 */
	const conn= {
		user: process.env.auroraMasterUser,
		host: process.env.postgresHost,
		database: process.env.auroraDatabaseName,
		password: process.env.auroraMasterPass,
		port: process.env.postgresPort,
	};
	console.log(conn);
	let database = new Database(client, conn, callback);
	database.connect(main)

	function main() {
		client.connect();

		let key=decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

		/*
		 * The filename contains the stage and the file_id  so we split it up
		 */
		let parts = key.split('/').slice(1);

		let packet = {
			"method": "add_file",
			"file_id": parts[1],
			"status": "UPLOADED",
			"s3_path": key

		};

		let querysql = 'SELECT locaria_core.locaria_internal_gateway($1::JSONB)';
		let qarguments = [packet];
		console.log(querysql);
		console.log(qarguments);
		client.query(querysql, qarguments, function (err, result) {
			if (err) {
				console.log(err);
				client.end();
				callback(null, JSON.stringify({"message": "BAD"}));

			} else {
				console.log(result.rows[0]['locaria_gateway']);
				client.end();
				callback(null, JSON.stringify({"message": "OK"}));
			}
		});
	}


};