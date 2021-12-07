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

const stage = process.argv[2];

console.log(`Building stage ${stage}`);
if (configs[stage].theme) {
	config = configs[stage];
	console.log(`Using theme - ${configs[stage].theme}`);
	if (fs.existsSync(buildDir)) {
		console.log(`cleaning build dir ${buildDir}`);
		fsExtra.remove(buildDir, () => {
			doCopy();
		});
	} else {
		doCopy();
	}
} else {
	console.log(`No such config ${stage}`);
}

function doCopy() {
	const srcPath = config.themeDir + config.theme;
	console.log(`cp ${srcPath} -> ${buildDir}`);
	fsExtra.copy(srcPath, buildDir, function (err) {
		if (err) {
			console.log('Copy failed!');
			console.log(err);
		} else {

			const resource = {
				websocket: `wss://${config.wsdomain}`
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