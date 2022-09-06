const AWS = require('aws-sdk');

module.exports.run = (event, context, callback) => {

	let cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

	let params = {

		GroupName: 'Registered', //your confirmed user gets added to this group
		UserPoolId: event.userPoolId,
		Username: event.userName
	};



		cognitoIdentityServiceProvider.adminAddUserToGroup(params, function(err, data) {

			if (err) {
				callback(err)
			}

			callback(null, event);
		});
};