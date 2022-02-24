/**
 * Config
 * @type {string}
 */

const buildDir = './src/theme/builder';

/**
 *  Includes
 */
const fs = require('fs')
const fsExtra = require('fs-extra')

const {exec} = require('child_process');


const configs = require('../../locaria.json');

let config = {};
let outputsSite;
let outputs;

const stage = process.argv[2];
const theme = process.argv[3]||'main';

console.log(`Building stage ${stage} theme ${theme}`);
//console.log(configs);
if (configs[stage].themes[theme]) {
	config = configs[stage];

	let outputsFileName=`serverless/outputs/${stage}-outputs.json`;
	if(!fs.existsSync(outputsFileName)) {
		console.log(`${outputsFileName} does not exist, have you deployed?`);
		process.exit(0);
	}
	outputs=fs.readFileSync(outputsFileName, 'utf8');

	let outputsSiteFileName=`serverless/outputs/${stage}-outputs-${theme}.json`;
	if(!fs.existsSync(outputsSiteFileName)) {
		console.log(`${outputsSiteFileName} does not exist, have you deployed?`);
		process.exit(0);
	}
	outputsSite=JSON.parse(fs.readFileSync(outputsSiteFileName,'utf8'));

	if (fs.existsSync(buildDir)) {
		console.log(`cleaning build dir ${buildDir}`);
		fsExtra.remove(buildDir, () => {
			doCopy();
		});
	} else {
		doCopy();
	}
} else {
	console.log(`No such config ${stage} ${theme}`);
}

function doCopy() {
	const srcPath = config.themeDir + theme;
	console.log(`cp ${srcPath} -> ${buildDir}`);
	fsExtra.copy(srcPath, buildDir, function (err) {
		if (err) {
			console.log('Copy failed!');
			console.log(err);
		} else {

			const resource = {
				websocket: outputsSite.ServiceEndpointWebsocket,
				cognitoURL: `auth.${config.themes[theme].domain}`,
				cognitoPoolId: outputsSite.cognitoPoolId,
				poolClientId: outputsSite.poolClientId
			}
			fs.writeFileSync(`${buildDir}/resources.json`, JSON.stringify(resource));
			const cmdLine = `webpack --config webpack.config.js`;
			console.log("success!");
			exec(cmdLine, {}, (err, stdout, stderr) => {
				console.log(err);
				console.log(stdout);
				console.log(stderr);


			})
		}
	});
}