'use strict';
const Database = require("./database");
const AWS = require('aws-sdk');

module.exports.run = (event, context, callback) => {

	let cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

	let params = {

		GroupName: 'Registered', //your confirmed user gets added to this group
		UserPoolId: event.userPoolId,
		Username: event.userName
	};

	// Setup database connection details
	const conn = {
		user: process.env.auroraMasterUser,
		host: process.env.postgresHost,
		database: process.env.auroraDatabaseName,
		password: process.env.auroraMasterPass,
		port: process.env.postgresPort,
	}


	let client = null;
	let database = new Database(client, conn, callback);

	// Add Registered group to the user
	console.log('Adding user to group');
	cognitoIdentityServiceProvider.adminAddUserToGroup(params, function (err, data) {

		// If error then we abort
		if (err) {
			callback(err)
		} else {
			console.log('User added to group');

			// connect the database
			database.connect(() => {
				client = database.getClient();
				let payload = {
					method: 'add_user_store',
					user_store: {
						user_id: event.userName,
						user_email: event.request.userAttributes.email,
						status: "Initial signup"
					}
				}
				let acl = {
					_userID: event.userName,
				}
				client.query("SELECT locaria_core.locaria_internal_gateway($1::JSONB,$2::JSONB)", [payload, acl], function (err, result) {
					if (err) {
						console.log(err);
					}
					console.log(result);
					callback(null, event);
					client.end();

				});
			})
		}
	});
};