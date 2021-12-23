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
			configs[stage].postgresConnection = `pg://${configs[stage].auroraMasterUser}:${configs[stage].auroraMasterPass}@${data.postgresHost}:${data.postgresPort}/${configs[stage].auroraDatabaseName}`;
			configs[stage].cognitoURL = configs[stage].cognitoDomainName;
			configs[stage].cognitoPoolId = data.cognitoPoolId;
			configs[stage].poolClientId = data.poolClientId;
			configs[stage].cfdist = data.cfdist;
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