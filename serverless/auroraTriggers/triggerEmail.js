/**
 *  File events
 *
 *  When file hits the configured S3 bucket we need to add an event for the event processor to pickup
 */
'use strict';
const aws = require("aws-sdk");

/**
 * This is called when the event happens
 * @param event
 * @param context
 * @param callback
 */
module.exports.run = (event, context, callback) => {

	console.log(event);
	sendSESEmail(event);


	function sendSESEmail(message) {

		let ses = new aws.SES({region: "eu-west-1"});

		ses.sendTemplatedEmail(message, function (err, response) {
			if (err) {
				eventError(3001, err);
			} else {
				eventSuccess(200, response);
			}
		})
	}

	function eventSuccess(code, message) {
		const payload = {"response_code": code, "message": message};
		callback(null, payload);
	}

	function eventError(code, message) {
		const payload = {"response_code": code, "message": message};
		callback(null, payload);
	}

};