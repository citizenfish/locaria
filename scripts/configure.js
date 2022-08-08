/**
 * Config
 * @type {string}
 */
const pg = require("pg");
const format = require('pg-format');

const expand = require('glob-expand');

const customFile = '../locaria.json';


/**
 *  Includes
 */
const fs = require('fs')
const {exec} = require('child_process');
//const dotenv = require('dotenv')
const AWS = require('aws-sdk')
const {v4: uuidv4} = require("uuid");

const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});


let configNew = true;
let configs = {};

//let OSOpenData = require('./docker/load_os_opendata');
/**
 *  Start
 */
console.log("Locaria config tool");

checkEnvironment();


function checkEnvironment() {

	exec('aws configure list', (err, stdout, stderr) => {
		if (err) {
			//some err occurred
			console.log('AWS CLI is not found please install https://docs.aws.amazon.com/cli/latest/userguide/install-windows.html');
			process.exit();
		} else {
			//console.log(`stdout: ${stdout}`);
			if (fs.existsSync(customFile)) {
				console.log('Existing config found');
				configs.custom = JSON.parse(fs.readFileSync(customFile, 'utf8'));
				configNew = false;
				listConfig();
			} else {
				configs.custom = {};
				console.log('No existing config found');
			}
			commandLoop();

		}
	});
}

function reloadConfig() {
	configs.custom = JSON.parse(fs.readFileSync(customFile, 'utf8'));
}

function commandLoop() {
	readline.question(`Command[h for help]?`, (cmd) => {
		switch (cmd) {
			case 'h':
				console.log('l - List current config sections');
				console.log('a - Add new config section');
				console.log('d - Delete config section');
				console.log('w - Write the current config');
				console.log('e - Deploy system');
				console.log('ld - Load Data (OS Opendata)');
				console.log('q - Quit');
				commandLoop();
				break;
			case 'l':
				listConfig();
				break;
			case 'a':
				addConfig();
				break;
			case 'd':
				deleteConfig();
				break;
			case 'w':
				writeConfig();
				break;
			case 'e':
				deploySystem();
				break;
			case 'ld':
				loadData();
				break;
			case 'q':
				process.exit(0);
				break;

		}
	})
}

async function loadData() {

	let stage = Object.keys(configs.custom)[0];


	let cmd = await new Promise(resolve => {
		readline.question(`Stage to use [${stage}]?`, resolve);
	});

	if (cmd) {
		stage = cmd;
	}

	cmd = await new Promise(resolve => {
		readline.question("Data set to load [OpenNames]?", resolve);
	});

	configs.custom[stage]['dataSet'] = cmd;
	process.env["AWS_PROFILE"] = configs.custom[stage].profile;


	commandLoop();

}

function getSageOutputs(stage, theme,environment) {
	let outputsFileName = `serverless/outputs/${stage}-outputs.json`;
	if (theme !== undefined)
		outputsFileName = `serverless/outputs/${stage}-outputs-${theme}-${environment}.json`;
	if (!fs.existsSync(outputsFileName)) {
		console.log(`${outputsFileName} does not exist, have you deployed?`);
		process.exit(0);
	}
	return JSON.parse(fs.readFileSync(outputsFileName, 'utf8'));
}

function sendSQLFiles(stage, theme, environment,configFile, callBack) {

	const outputs = getSageOutputs(stage);
	let themeOutputs = getThemeOutputs(stage, theme,environment);

	//const conn=`pg://${configs.custom[stage].auroraMasterUser}:'${encodeURI(configs.custom[stage].auroraMasterPass)}'@${outputs.postgresHost}:${outputs.postgresPort}/locaria${theme}`;


	let items = 0;
	let skipped = 0;
	let failed = 0;
	let fileList = [];

	if (!fs.existsSync(configFile)) {
		console.log(`specified config file ${configFile} does not exist!`);
		callBack(stage, theme,environment);
		return;
	}


	const deployConfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));

	deployConfig.subs = {};

	if (deployConfig.substitutions) {
		if (fs.existsSync(deployConfig.substitutions)) {
			deployConfig.subs = JSON.parse(fs.readFileSync(deployConfig.substitutions, 'utf8'));
		} else {
			console.log(`substitutions file: ${deployConfig.substitutions} not found`);
			callBack(stage, theme,environment);
			return;
		}
	}
	deployConfig.config = configs.custom[stage];

	const image_upload_file = `serverless/outputs/${stage}-outputs-${theme}-${environment}-images.json`;
	//`${configs.custom[stage].themeDir}/${theme}/images/image_upload.json`

	let imageFiles = {}
	try {
		imageFiles = JSON.parse(fs.readFileSync(image_upload_file, 'utf8'));
	} catch (err) {
		console.log(`No image upload file ${image_upload_file}`)
	}


	let id = 0;
	deployEntry(id);

	function deployEntry(id) {

		if (deployConfig.databases[id]) {
			// new revert
			let databaseName = deployConfig.databases[id].database ? deployConfig.databases[id].database : `locaria${theme}${environment}`;
			//let databaseName = deployConfig.databases[id].database ? deployConfig.databases[id].database : `locaria${theme}`;
			const conn = {
				user: configs.custom[stage].auroraMasterUser,
				host: outputs.postgresHost,
				database: databaseName,
				password: configs.custom[stage].auroraMasterPass,
				port: outputs.postgresPort,
			}

			console.log(`Using: ${outputs.postgresHost} - ${databaseName}`);
			let client = new pg.Client(conn);


			client.connect((err) => {
				if (err) {
					console.error("DATABASE CONNECTION FAILURE: ", err.stack);
				} else {
					console.log('Connected to db');
					client.on('notice', msg => {
						console.log(`Postgress Server NOTICE: ${msg.where} - ${msg.message}`);
					});
					//fileList = deployConfig.databases[id].tables;
					fileList = [];
					deployConfig.databases[id].tables.forEach(function (f) {
						fileList.push(...expand({cwd: './'}, [f]));
					});
					items = fileList.length;
					sendFile(0);

				}
			});

			function sendFile(index) {
				let f = fileList[index];
				if (!fs.existsSync(f)) {
					console.log(`Source file ${f} not found.`);
					index++;
					skipped++;
					if (index >= items) {
						callBack(stage, theme,environment);
					} else {
						sendFile(index);
					}
				} else {
					console.log('Running: ' + f);
					let fileData = fs.readFileSync(f, 'utf8');


					let match;
					//let vars = /\{\{subs\.(.*?)\}\}/gm;
					let vars = RegExp('\{\{subs\.(.*?)\}\}', 'g')
					while (match = vars.exec(fileData)) {
						console.log(`${match[0]} : ${deployConfig.databases[id].subs[match[1]]}`)
						fileData = fileData.replace(match[0], deployConfig.subs[match[1]]);
					}

					vars = /\{\{config\.(.*?)\}\}/g;
					while (match = vars.exec(fileData)) {
						fileData = fileData.replace(match[0], deployConfig.config[match[1]]);
					}

					vars = /\{\{outputs\.(.*?)\}\}/g;
					while (match = vars.exec(fileData)) {
						fileData = fileData.replace(match[0], outputs[match[1]]);
					}

					vars = /\{\{themeOutputs\.(.*?)\}\}/g;
					while (match = vars.exec(fileData)) {
						fileData = fileData.replace(match[0], themeOutputs[match[1]]);
					}

					vars = /\{\{assets\.(.*?)\}\}/g;
					while (match = vars.exec(fileData)) {
						if(imageFiles[match[1]]) {
							fileData = fileData.replace(match[0], `~uuid:${imageFiles[match[1]].uuid}~url:${imageFiles[match[1]].url}`);
						} else {
							fileData = fileData.replace(match[0], `~uuid:failed~url:failed`);
							console.error(`ASSETS REFERENCE [${match[1]}] not valid`)
						}
					}

					vars = /\{\{assetUUID\.(.*?)\}\}/g;
					while (match = vars.exec(fileData)) {
						fileData = fileData.replace(match[0], imageFiles[match[1]].uuid);
					}

					vars = /\{\{theme\}\}/g;
					while (match = vars.exec(fileData)) {
						fileData = fileData.replace(`\{\{theme\}\}`, theme);
					}

					vars = /\{\{environment\}\}/g;
					while (match = vars.exec(fileData)) {
						fileData = fileData.replace(`\{\{environment\}\}`, environment);
					}


					//console.log(fileData);
					client.query(fileData, function (err, result) {
						index++;
						if (err) {
							console.log(`SQL ${f} failed`);
							console.log(err.stack);
							failed++;
							if (deployConfig.databases[id].stopOnError === true) {
								console.log(`EARLY STOP! DONE ${fileList.length} Records SKIPPED ${skipped}`);
								callBack(stage, theme,environment);
								return;
							}
						} else {
							if (deployConfig.databases[id].output && result.rows) {
								console.log(result.rows);
							}
							console.log(`SQL ${f} OK`);
							if (Array.isArray(result)) {
								result.forEach(function (res) {
									console.log(`Result ${res.command} - ${res.rowCount}`);
								})
							} else {
								console.log(`Result ${result.command} - ${result.rowCount}`);
							}

						}
						if (index >= items) {
							console.log(`DONE ${fileList.length} FAILED ${failed} Records SKIPPED ${skipped}`);
							id++;
							deployEntry(id);
							//callBack(stage, theme);
						} else {
							sendFile(index);
						}
					});
				}
			}
		} else {
			console.log('End of databases');
			callBack(stage, theme,environment);
		}
	}

}


function deploySystem() {
	let stage = Object.keys(configs.custom)[0];
	readline.question(`Stage to deploy [${stage}]?`, (cmd) => {
		if (cmd)
			stage = cmd;
		console.log('Themes configured:');
		let keys = Object.keys(configs['custom'][stage].themes);
		for (let t in keys) {
			console.log(`[${keys[t]}]`);
		}
		let theme = keys[0];
		let environment = "dev";
		readline.question(`Theme to use [${theme}]?`, (cmd) => {
			if (cmd)
				theme = cmd;
			readline.question(`environment to use [${environment}]?`, (cmd) => {
				if (cmd)
					environment = cmd;
				deploySystemMain(stage, theme,environment);
			});
		});
	});
}

function deploySystemMain(stage, theme,environment) {
	reloadConfig();
	readline.question(`Deploy command for ${stage}:${theme};${environment} [h for help]?`, (cmd) => {
		switch (cmd) {
			case 'h':
				console.log('stage - Deploy stage');
				console.log('node - Deploy a single stage node');
				console.log('web - Deploy a themed build');
				console.log('sql - Deploy SQL');
				console.log('usql - Upgrade SQL');
				console.log('usqlnt - Upgrade SQL without theme SQL files')
				console.log('docker - deploy a docker instance');
				console.log('tests - Run Tests');
				console.log('q - Exit deploy mode');
				deploySystemMain(stage, theme,environment);
				break;
			case 'stage':
				deployStage(stage, theme,environment);
				break;
			case 'node':
				deployStageNode(stage, theme,environment);
				break;
			case 'web':
				deployWEB(stage, theme,environment);
				break;
			case 'sql':
				deploySQL(stage, theme,environment);
				break;
			case 'usql':
				upgradeSQL(stage, theme,environment);
				break;
			case 'usqlnt':
				upgradeSQL(stage, theme,environment, false);
				break;
			case 'docker':
				deployDocker(stage, theme,environment);
				break;
			case 'tests':
				runTests(stage, theme,environment);
				break;
			case 'q':
				commandLoop();
				break;
			default:
				console.log(`Unknown command [${cmd}]`);
				deploySystemMain(stage, theme,environment)
				break;
		}
	});
}


function runTests(stage, theme,environment) {
	sendSQLFiles(stage, theme,environment, 'database/tests.json', deploySystemMain);

}

function getThemeOutputs(stage, theme,environment) {
	let outputsSiteFileName = `serverless/outputs/${stage}-outputs-${theme}-${environment}.json`;
	if (!fs.existsSync(outputsSiteFileName)) {
		console.log(`${outputsSiteFileName} does not exist, have you deployed?`);
		process.exit(0);
	}
	console.log(`Loaded: ${outputsSiteFileName}`);
	return JSON.parse(fs.readFileSync(outputsSiteFileName, 'utf8'));

}


function deployDocker(stage, theme,environment) {
	const dockers = JSON.parse(fs.readFileSync('docker/dockers.json', 'utf8'));
	let docker = Object.keys(dockers)[0];
	for (let d in dockers) {
		console.log(`[${d}] - ${dockers[d].description}`);
	}
	readline.question(`deploy docker image stage ${stage}, theme ${theme}? [${docker}]`, (cmd) => {
		if (cmd)
			docker = cmd;
		console.log('Build');
		executeWithCatch(`node scripts/buildDocker.js  ${stage} ${theme} ${docker}`, "./", () => {
			console.log('tag');
			let outputs = getThemeOutputs(stage, theme,environment);
			executeWithCatch(`docker tag ${docker}:latest ${outputs.ecrRepositoryUri}`, "./", () => {
				console.log('Login');
				executeWithCatch(`aws ecr get-login-password --profile ${configs['custom'][stage].profile} --region ${configs['custom'][stage].region} | docker login --username AWS --password-stdin ${outputs.ecrRepositoryUri}`, "./", () => {
					console.log('deploy');
					executeWithCatch(`docker push ${outputs.ecrRepositoryUri}`, "./", (stdout) => {
						console.log('sql updates');
						//reload output as they have changed
						sendSQLFiles(stage, theme, 'database/dockers.json', deploySystemMain);
					}, () => {
						deploySystemMain(stage, theme);
					});
				}, () => {
					deploySystemMain(stage, theme);
				});
			}, () => {
				deploySystemMain(stage, theme);
			});
		}, () => {
			deploySystemMain(stage, theme);
		});
	})
}

function deployStageNode(stage, theme,environment) {
	let node = 'cloudfront';
	readline.question(`node to deploy on stage ${stage}, theme ${theme}? [${node}]`, (cmd) => {
		if (cmd)
			node = cmd;
		executeWithCatch(`node scripts/serverlessStageBuilder.js ../serverless/${configs['custom'][stage].serverlessType}.json ${stage} ${node} ${theme} ${environment}`, "./", () => {
			console.log('Done')
			deploySystemMain(stage, theme,environment);

		}, () => {
			deploySystemMain(stage, theme,environment);
		});

	});
}


function deployStage(stage, theme) {

	readline.question(`Deploy entire base stage ${stage}? [y/n]`, (cmd) => {
		if (cmd === 'y') {
			executeWithCatch(`node scripts/serverlessStageBuilder.js ../serverless/multi.json ${stage} all ${theme}`, "./", () => {
				console.log('Done')
				deploySystemMain(stage, theme);

			}, () => {
				deploySystemMain(stage, theme);
			});
		} else {
			console.log('Aborted');
		}
	});

	return;

	// OLDS
	console.log('#npm install')
	exec(`npm install`, options, (err, stdout, stderr) => {
		if (err) {
			console.log('npm install FAILED!');
			console.log(stderr);
			deploySystemMain(stage);

		} else {
			console.log(stdout);
			const cmdLine = `sls create_domain --stage ${stage} --file serverless-single.yml`;
			console.log(`#${cmdLine}`);
			exec(cmdLine, options, (err, stdout, stderr) => {
				console.log(stdout);
				const cmdLine = `serverless deploy --stage ${stage} --file serverless-single.yml`;
				console.log(`#${cmdLine}`);
				exec(cmdLine, options, (err, stdout, stderr) => {
					console.log(stdout);
					/*const cmdLine = `sls export-env --stage ${stage}`;
					console.log(`#${cmdLine}`);
					exec(cmdLine, options, (err, stdout, stderr) => {
						console.log(stdout);*/
					deploySystemMain(stage);
					//});
				});
			});
		}
	});
}

function executeWithCatch(cmd, cwd, success, fail, options) {
	options = Object.assign({
		cwd: cwd
	}, options);
	console.log(`#${cmd}`);
	exec(cmd, options, (err, stdout, stderr) => {
		if (err) {
			console.log('command FAILED!');
			console.log(stderr);
			console.log(err);
			fail();
		} else {
			console.log(stdout);
			success(stdout);
		}
	});
}

function deployWEB(stage, theme,environment) {

	/*const buf = fs.readFileSync('api/.env');
	const config = dotenv.parse(buf)*/
	const outputs = getSageOutputs(stage, theme,environment);
	let dist = outputs.cfDist;

	executeWithCatch(`node scripts/builder.js ${stage} ${theme} ${environment}`, "./", () => {
		const cmdLine = `grunt deploySite --profile=${configs['custom'][stage].profile} --stage=${stage} --distribution=${dist} --bucket=locaria-${stage}-${theme}${environment} --region=${configs['custom'][stage].region} --theme=${theme} --environment=${environment}`;
		executeWithCatch(cmdLine, "./", () => {
			deploySystemMain(stage, theme,environment);
		}, () => {
			deploySystemMain(stage, theme,environment);
		})
	}, () => {
		deploySystemMain(stage, theme,environment);
	});


}

function deploySQL(stage, theme,environment) {
	readline.question(`Are you sure you wish to wipe and re-install ${theme} [n]?`, (cmd) => {
		if (cmd === 'y') {
			sendSQLFiles(stage, theme,environment, 'database/install.json', installThemeSQL);
		} else {
			console.log('Aborted!');
			deploySystemMain(stage, theme,environment);
		}
	});
}


function upgradeSQL(stage, theme, environment,theme_files = true) {

	if (configs.custom[stage].themes[theme][environment].live === true) {
		readline.question(`Are you sure you wish to update ${theme}-${environment} as LIVE mode is enabled [n]?`, (cmd) => {
			if (cmd === 'y') {
				//See if we have an image upload config file
				next();
			} else {
				deploySystemMain(stage, theme,environment);
			}
		});
	} else {
		next();
	}

	function next() {
		const image_upload_path = `${configs.custom[stage].themeDir}${theme}/images`;

		const image_output_path = `serverless/outputs/${stage}-outputs-${theme}-${environment}-images.json`;
		const image_upload_file = `${image_upload_path}/image_upload.json`
		if (fs.existsSync(image_upload_file)&&theme_files===true) {
			console.log(`Found image_upload.json reading image config file Using profile ${configs.custom[stage].profile}`)
			// process.env.AWS_PROFILE = configs.custom[stage].profile


			const bucket = `locaria-${stage}-${theme}${environment}`;
			const path = 'assets';
			let files = JSON.parse(fs.readFileSync(image_upload_file));

			if (!fs.existsSync(image_output_path)) {
				fs.copyFileSync(image_upload_file,image_output_path);
			}

			let outputFiles = JSON.parse(fs.readFileSync(image_output_path));

			files={...files,...outputFiles};

			//console.log(files);

			uploadFilesToS3(stage, theme, environment,configs.custom[stage].profile, files, bucket, path, image_upload_path, (files) => {
				fs.writeFileSync(image_output_path, JSON.stringify(files));
				usqlSQL(stage, theme, environment,theme_files);
			});

		} else {
			console.log('No image config file found for theme or no theme mode')
			usqlSQL(stage, theme, environment,theme_files)
		}
	}

}

const usqlSQL = (stage, theme, environment,theme_files) => {
	if (theme_files) {
		sendSQLFiles(stage, theme, environment,'database/upgrade.json', upgradeThemeSQL);
	} else {
		sendSQLFiles(stage, theme, environment,'database/upgrade.json', deploySystemMain);
	}
}

const uploadFilesToS3 = async (stage, theme, environment,profile, files, bucket, path, image_upload_path, success) => {

	const outputs = getSageOutputs(stage);

	const conn = {
		user: configs.custom[stage].auroraMasterUser,
		host: outputs.postgresHost,
		database: `locaria${theme}${environment}`,
		password: configs.custom[stage].auroraMasterPass,
		port: outputs.postgresPort
	};

	console.log(`Using: ${outputs.postgresHost} - locaria${theme}`);
	let client = new pg.Client(conn);

	let updates=[];
	for (let i in files) {
		if (files[i]['url'] === undefined) {
			let uuid = uuidv4();

			let file = `${image_upload_path}/${i}`
			console.log(`Uploading ${file} to ${bucket}:/${theme}${environment}/${path}/${uuid}`)
			const body = fs.readFileSync(file);

			let credentials = new AWS.SharedIniFileCredentials({profile: profile});
			AWS.config.credentials = credentials;

			const s3 = new AWS.S3();

			const upload = await s3.upload({
				Bucket: bucket,
				Key: `${theme}${environment}/${path}/${uuid}.${files[i]['ext']}`,
				Body: body,
				ContentType: files[i]['mime_type']
			}).promise();
			if (upload.Location !== undefined) {
				//files[i]['url'] = `https://${configs.custom[stage].themes[theme][environment].domain}/${path}/${uuid}.${files[i]['ext']}`;
				files[i]['url'] = `/${path}/${uuid}.${files[i]['ext']}`;
				files[i]['uuid'] = uuid;
				updates.push([uuid,{ext:files[i]['ext'],url:`${path}/${uuid}.${files[i]['ext']}`,name:i,usage:files[i]['usage'],s3_path:`${theme}${environment}/${path}/${uuid}.${files[i]['ext']}`,s3_bucket:bucket}])
			} else {
				console.log(`Upload failed!`);
			}
		}
	}
	if(updates.length>0) {
		client.connect((err) => {
			if (err) {
				console.error("DATABASE CONNECTION FAILURE: ", err.stack);
			} else {
				console.log('Connected to db');
				console.log(updates);
				console.log(format("INSERT INTO locaria_core.assets (uuid,attributes) VALUES %L", updates));
				client.query(format("INSERT INTO locaria_core.assets (uuid,attributes) VALUES %L", updates), [], function (err, result) {
					if (err) {
						console.log(err);
					}
					success(files);
				});

			}
		});
	} else {
		console.log('No assets to update');
		success(files);
	}
	/*		}
		});*/

	//return files
}

function installThemeSQL(stage, theme,environment) {
	executeWithCatch(`node scripts/builder.js ${stage} ${theme} ${environment}`, "./", () => {
		sendSQLFiles(stage, theme, environment,'src/theme/builder/database/install.json', deploySystemMain);
	}, () => {
		deploySystemMain(stage, theme,environment);
	});
}


function upgradeThemeSQL(stage, theme,environment) {
	executeWithCatch(`node scripts/builder.js ${stage} ${theme} ${environment}`, "./", () => {
		sendSQLFiles(stage, theme, environment,'src/theme/builder/database/upgrade.json', deploySystemMain);
	}, () => {
		deploySystemMain(stage, theme,environment);
	});
}

function deleteConfig() {
	let stage = 'dev';
	readline.question(`system stage [${stage}]?`, (cmd) => {
		if (cmd.length > 0)
			stage = cmd;
		delete configs.custom[stage];
		commandLoop();
	});
}

const configQuestions = [
	{
		details: "Give the deployment stage a name, EG dev|test|live. This is used to reference this profile in the future",
		name: "stage",
		text: "Stage name",
		default: "dev",
		config: "custom",
		stage: true
	},
	{
		details: "Deployment mode to use single|multi. Multi allows multiple sites per environment",
		name: "mode",
		text: "Deployment mide",
		default: "single",
		config: "custom"
	},
	{
		details: "Which theme to use by default",
		name: "theme",
		text: "Theme name",
		default: "default",
		config: "custom"
	},
	{
		details: "Theme dir",
		name: "themeDir",
		text: "Theme director",
		default: "./src/theme/",
		config: "custom"
	},
	{
		details: "You need aws cli install and configured to access your account, enter the profile used here",
		name: "profile",
		text: "AWS profile to use",
		default: "default",
		config: "custom"
	},

	{name: "region", text: "AWS region", default: "eu-west-1", config: "custom"},
	{name: "domain", text: "Domain name to use for website", default: "default.locaria.org", config: "custom"},
	{
		name: "imageDomain",
		text: "Domain name to use for image hosting",
		default: "images.locaria.org",
		config: "custom"
	},
	{name: "restdomain", text: "Domain name to use for rest api", default: "rest.locaria.org", config: "custom"},
	{name: "wsdomain", text: "Domain name to use for websocket", default: "ws.locaria.org", config: "custom"},
	{name: "certARN", text: "AWS cert ARN", default: "arn:aws:acm:us-east-1:xxxxxxxxxxxxxxxx", config: "custom"},
	{
		name: "certImagesARN",
		text: "AWS images cert ARN",
		default: "arn:aws:acm:us-east-1:xxxxxxxxxxxxxxxx",
		config: "custom"
	},
	{name: "auroraDatabaseName", text: "Aurora database name", default: "locaria", config: "custom"},
	{name: "auroraMasterUser", text: "Aurora master user", default: "locaria", config: "custom"},
	{name: "auroraMasterPass", text: "Aurora master password", default: "CHANGEME", config: "custom"},
	{
		name: "auroraVersion",
		text: "Aurora database version",
		default: "13.4",
		config: "custom"
	},
	{
		name: "auroraFamily",
		text: "Aurora database Family",
		default: "aurora-postgresql13",
		config: "custom"
	},
	{
		name: "osDataHubProductURL",
		text: "OS Data Hub Product URL (Data Downloads)",
		default: "https://api.os.uk/downloads/v1/products",
		config: "custom"
	},
	{name: "tmp", text: "Temporary local storage for downloads", default: "/tmp", config: "custom"}
];

function addConfig() {

	let index = 0;
	let stage = 'dev';

	askQuextion();

	function askQuextion() {
		if (index < configQuestions.length) {
			if (configQuestions[index].details)
				console.log(configQuestions[index].details);
			readline.question(`${configQuestions[index].text} [${configQuestions[index].default}]?`, (cmd) => {
				if (cmd.length === 0)
					cmd = configQuestions[index].default;
				if (configQuestions[index].stage === true) {
					stage = cmd;
					configs['custom'][stage] = {};
				} else {
					configs[configQuestions[index].config][stage][configQuestions[index].name] = cmd;
				}
				index++;
				askQuextion();
			});
		} else {
			commandLoop();
		}
	}
}

function writeConfig() {
	fs.writeFileSync(customFile, JSON.stringify(configs.custom));
	console.log('Config files written');
	commandLoop();
}

function listConfig() {
	for (let i in configs.custom) {
		console.log(`[${i}]`);
	}
	commandLoop();
}