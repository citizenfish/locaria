/**
 *  File events
 *
 *  When file hits the configured S3 bucket we need to add an event for the event processor to pickup
 */

'use strict';
const AWS = require('aws-sdk');

/**
 * This is called when the event happens
 * @param event
 * @param context
 * @param callback
 */
module.exports.run = (event, context, callback) => {
	console.log(`Incoming task: [${event['task']}`);
	console.log(event);

	let params = {
		taskDefinition: event['task'],
		cluster: event['ecsName'],
		launchType: "FARGATE",
		networkConfiguration: {
			awsvpcConfiguration: {
				subnets: [
					event['vpcPrivateSubnetA'],
					event['vpcPrivateSubnetB'],
				],
				securityGroups: [
					event['ServerlessSecurityGroup']
				],
				assignPublicIp: "ENABLED"
			}
		}
	};

	console.log(params);

	let ecs = new AWS.ECS();
	ecs.runTask(params, function (err, data) {
		if (err) console.log(err, err.stack); // an error occurred
		else     console.log(data);           // successful response
	});


	callback(null, JSON.stringify({"message": "OK"}));
};