function handler(data, serverless, options) {
	const fs = require("fs");

	console.log('Received Stack Output', data);
	const customFile = '../../locaria.json';

	const stage = data.stage;
	let configs = {}

	console.log(`updating stage ${stage}`);

	if (fs.existsSync(customFile)) {
		console.log('Config found');
		configs = JSON.parse(fs.readFileSync(customFile, 'utf8'));

		if (configs[stage]) {
			configs[stage].postgressConnection = `pg://${configs[stage].auroraMasterUser}:${configs[stage].auroraMasterPass}@${data.postgresHost}:${data.postgresPort}/${configs[stage].auroraDatabaseName}`;
			fs.writeFileSync(customFile, JSON.stringify(configs));
			console.log('Written');
		} else {
			console.log('NO STAGE in config');
		}

	} else {
		console.log('No existing config found!!!');
	}

}

module.exports = {handler}