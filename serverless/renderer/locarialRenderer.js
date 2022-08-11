module.exports.run = (event, context, callback) => {

	const conn = {
		user: process.env.auroraMasterUser,
		host: process.env.postgresHost,
		database: process.env.auroraDatabaseName,
		password: process.env.auroraMasterPass,
		port: process.env.postgresPort,
	}

	const html = '<!DOCTYPE html>\
		<html lang="en">\
		<head>\
		<meta name="viewport" content="width=device-width, initial-scale=1">\
		<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800&display=swap" rel="stylesheet">\
		<link href="https://fonts.googleapis.com/css?family=Merriweather" rel="stylesheet">\
		<link href="https://fonts.googleapis.com/css?family=Caveat" rel="stylesheet">\
		<script type="module" src="/dist/full.bundle.js"></script>\
		<meta charset="UTF-8">\
		<title>Title</title>\
		</head>\
		<body class="on-home">\
		<div id="root" class="contain">\
		</div>\
		</body>\
		</html>';
	const response = {
		statusCode: 200,
		headers: {
			'Content-Type': 'text/html',
		},
		body: html,
	};
// callback will send HTML back
	callback(null, response);
};