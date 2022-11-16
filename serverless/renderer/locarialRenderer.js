'use strict';
const Database = require("./database");

module.exports.run = (event, context, callback) => {

	let path=event.path;
	path=path.replace(/^\//,'');
	path=path.replace(/\/.*$/,'');
	path=path.replace('index.html','');
	if(path===''||path===undefined) {
		path = 'Home';
	}
	console.log(`processed-defaults: ${path}`)


	if(path==='Admin') {
		const html = `\
				<!DOCTYPE html>\
				<html lang="en">\
				<head>\
				<meta name="viewport" content="width=device-width, initial-scale=1">\
				<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800&display=swap" rel="stylesheet">\
				<link href="https://fonts.googleapis.com/css?family=Merriweather" rel="stylesheet">\
				<link href="https://fonts.googleapis.com/css?family=Caveat" rel="stylesheet">\
				<script type="module" src="/dist/admin.bundle.js"></script>\
				<meta charset="UTF-8">\
				<title>Admin</title>\
				</head>\
				<body class="on-home">\
				<div id="root" class="contain">\
				</div>\
				</body>\
				</html>`;


		const response = {
			statusCode: 200,
			headers: {
				'Content-Type': 'text/html',
			},
			body: html,
		};
// callback will send HTML back
		callback(null, response);
	} else {

		const conn = {
			user: process.env.auroraMasterUser,
			host: process.env.postgresHost,
			database: process.env.auroraDatabaseName,
			password: process.env.auroraMasterPass,
			port: process.env.postgresPort,
		}
		let client = null;

		let database = new Database(client, conn, callback);


		let querysql = 'SELECT locaria_core.locaria_gateway($1::JSONB,$2::JSONB)';
		let qarguments = [
			{
				method: "get_parameters",
				parameter_name: path

			}, {}];

		database.connect(() => {

			client = database.getClient();


			client.query(querysql, qarguments, function (err, result) {

				let description = 'Home';
				let title = 'Home';
				if (result.rows[0]['locaria_gateway'] && result.rows[0]['locaria_gateway']['parameters'] && result.rows[0]['locaria_gateway']['parameters'][path]) {
					description = result.rows[0]['locaria_gateway']['parameters'][path]['data']['description'];
					title = result.rows[0]['locaria_gateway']['parameters'][path]['data']['title'];
				}


				const html = `\
				<!DOCTYPE html>\
				<html lang="en">\
				<head>\
				<meta name="viewport" content="width=device-width, initial-scale=1">\
				<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800&display=swap" rel="stylesheet">\
				<link href="https://fonts.googleapis.com/css?family=Merriweather" rel="stylesheet">\
				<link href="https://fonts.googleapis.com/css?family=Caveat" rel="stylesheet">\
				<script type="module" src="/dist/full.bundle.js"></script>\
				<meta charset="UTF-8">\
				<meta name="description" content="${description}"/>
				<title>${title}</title>\
				</head>\
				<body class="on-home">\
				<div id="root" class="contain">\
				</div>\
				</body>\
				</html>`;


				const response = {
					statusCode: 200,
					headers: {
						'Content-Type': 'text/html',
					},
					body: html,
				};
// callback will send HTML back
				callback(null, response);
				client.end();
			});
		})
	}
};