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
	console.log('Fargate router lambda-----');
	const conn = `pg://${process.env.auroraMasterUser}:${process.env.auroraMasterPass}@${process.env.postgresHost}:${process.env.postgresPort}/${process.env.auroraDatabaseName}`;
	console.log(conn);
	console.log(`${process.env.fargateRouterHost}:${process.env.fargateRouterPort}`);

	let database = new Database(client, conn, callback);
	database.connect(stage1);

	function stage1() {
		client = database.getClient();


		const querysql = 'SELECT locaria_core.locaria_gateway($1::JSONB)';
		let qarguments = [{}];
		client.query(querysql, qarguments, function (err, result) {
			let payload = {"foo": "bar", "result": result};
			callback(null, payload);

		});
	}

}