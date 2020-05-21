/**
 * Config
 * @type {string}
 */

const envFile='../locus-env.yml';
const customFile='../locus-custom.yml';


/**
 *  Includes
 */
const fs = require('fs')
const YAML = require('yaml');
const { exec } = require('child_process');

const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});

let configNew=true;
let configs={};


/**
 *  Start
 */
console.log("Locus config tool");
checkEnvironment();


function checkEnvironment() {

	exec('aws configure list', (err, stdout, stderr) => {
		if (err) {
			//some err occurred
			console.log('AWS CLI is not found please install https://docs.aws.amazon.com/cli/latest/userguide/install-windows.html');
			process.exit();
		} else {
			//console.log(`stdout: ${stdout}`);
			if (fs.existsSync(envFile)) {
				console.log('Existing config found');
				configs.env=YAML.parse(fs.readFileSync(envFile, 'utf8'));
				configs.custom=YAML.parse(fs.readFileSync(customFile, 'utf8'));
				configNew=false;
				listConfig();
			} else {
				configs.env={};
				configs.custom={};
				console.log('No existing config found');
			}
			commandLoop();

		}
	});
}

function commandLoop() {
	readline.question(`Command[h for help]?`, (cmd) => {
		switch(cmd) {
			case 'h':
				console.log('l - List current config sections');
				console.log('a - Add new config section');
				console.log('d - Delete config section');
				console.log('w - Write the current config');
				console.log('e - Deploy system');
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
			case 'q':
				process.exit(0);
				break;

		}
	})
}

function deploySystem() {
	let stage='test';
	readline.question(`Stage to deploy [test]?`, (cmd) => {
		if(cmd)
			stage=cmd;
		deploySystemMain(stage);
	});
}

function deploySystemMain(stage) {
	readline.question(`Deploy command for stage ${stage} [h for help]?`, (cmd) => {
		switch(cmd) {
			case 'h':
				console.log('api - Deploy API');
				console.log('sql - Deploy SQL');
				console.log('usql - Upgrade SQL');
				console.log('web - Deploy Web interface');
				console.log('scrape - Deploy scraper');
				console.log('ws - Deploy websocket');
				console.log('q - Exit deploy mode');
			case 'all':
				deploySystemMain(stage);
				break;
			case 'scrape':
				deployScrape(stage);
				break;
			case 'api':
				deployAPI(stage);
				break;
			case 'web':
				deployWEB(stage);
				break;
			case 'sql':
				deploySQL(stage);
				break;
			case 'usql':
				upgradeSQL(stage);
				break;
			case 'ws':
				deployWS(stage);
				break;
			case 'q':
				commandLoop();
				break;
			default:
				console.log(`Unknown mode [${cmd}]`);
				commandLoop();
				break;
		}
	});
}


function deployScrape(stage) {
	const options={
		cwd: "scrape/"
	};
	console.log('#npm install')
	exec(`npm install` ,options, (err, stdout, stderr) => {
		if(err) {
			console.log('npm install FAILED!');
			console.log(stderr);
			deploySystemMain(stage);

		} else {
			console.log(stdout);
			const cmdLine=`serverless deploy --stage ${stage}`;
			console.log(`#${cmdLine}`);
			exec( cmdLine,options, (err, stdout, stderr) => {
				console.log(stdout);
				deploySystemMain(stage);
			});
		}
	});
}

function deployWS(stage) {
	const options = {
		cwd: "websocket/"
	};
	console.log('#npm install')
	exec(`npm install`, options, (err, stdout, stderr) => {
		if (err) {
			console.log('npm install FAILED!');
			console.log(stderr);
			deploySystemMain(stage);

		} else {
			console.log(stdout);
			const cmdLine = `sls create_domain --stage ${stage}`;
			console.log(`#${cmdLine}`);
			exec(cmdLine, options, (err, stdout, stderr) => {
				console.log(stdout);
				const cmdLine = `serverless deploy --stage ${stage}`;
				console.log(`#${cmdLine}`);
				exec(cmdLine, options, (err, stdout, stderr) => {
					console.log(stdout);
					deploySystemMain(stage);
				});
			});
		}
	});
}

function deployAPI(stage) {
	const options={
		cwd: "api/"
	};
	console.log('#npm install')
	exec(`npm install` ,options, (err, stdout, stderr) => {
		if(err) {
			console.log('npm install FAILED!');
			console.log(stderr);
			deploySystemMain(stage);

		} else {
			console.log(stdout);
			const cmdLine=`sls create_domain --stage ${stage}`;
			console.log(`#${cmdLine}`);
			exec( cmdLine,options, (err, stdout, stderr) => {
				console.log(stdout);
				const cmdLine = `serverless deploy --stage ${stage}`;
				console.log(`#${cmdLine}`);
				exec(cmdLine, options, (err, stdout, stderr) => {
					console.log(stdout);
					deploySystemMain(stage);
				});
			});
		}
	});
}

function deployWEB(stage) {
	const options={
		cwd: "api/"
	};
	const cmdLine=`grunt deploySite --profile=${configs['custom'][stage].profile} --stage=${stage} --distribution=${configs['custom'][stage].distribution}`;
	console.log(`#${cmdLine}`);

	exec(cmdLine ,options, (err, stdout, stderr) => {
		if(err) {
			console.log('grunt FAILED!');
			console.log(stderr);
			deploySystemMain(stage);


		} else {
			console.log(stdout);
			deploySystemMain(stage);

		}
	});
}

function deploySQL(stage) {
	const options={
	};
	const cmdLine=`grunt deploySQLFull --stage=${stage}`;
	console.log(`#${cmdLine}`);
	exec( cmdLine,options, (err, stdout, stderr) => {
		console.log(stdout);
		console.log(err);
		console.log(stderr);
		deploySystemMain(stage);
	});
}

function upgradeSQL(stage) {
	const options={
	};
	const cmdLine=`grunt deploySQLupgrade --stage=${stage}`;
	console.log(`#${cmdLine}`);
	exec( cmdLine,options, (err, stdout, stderr) => {
		console.log(stdout);
		console.log(err);
		console.log(stderr);
		deploySystemMain(stage);
	});
}

function deleteConfig() {
	let stage='dev';
	readline.question(`system stage [${stage}]?`, (cmd) => {
		if(cmd.length>0)
			stage=cmd;
			delete configs.env[stage];
			delete configs.custom[stage];
			commandLoop();
	});
}

const configQuestions = [
	{details:"Give the deployment stage a name, EG dev|test|live. This is used to reference this profile in the future",name:"stage",text:"Stage name",default:"dev",config:"env",stage:true},
	{details:"You need aws cli install and configured to access your account, enter the profile used here",name:"profile",text:"AWS profile to use",default:"default",config:"custom"},

	{details:"This section details will Lambda settings",name:"securityGroupIds",text:"AWS Security group to assign to lambda",default:"default",config:"custom"},
	{name:"region",text:"AWS region",default:"eu-west-1",config:"custom"},
	{name:"subnet1",text:"AWS first subnet to use",default:"subnet1",config:"custom"},
	{name:"subnet2",text:"AWS second subnet to use",default:"subnet2",config:"custom"},
	{name:"postgres",text:"postgres connect string",default:"pg://locus:locus@localhost:5432/locus",config:"env"},
	{name:"cron",text:"Cron string to use for scraper",default:"cron(0/10 * ? * MON-FRI *)",config:"custom"},
	{name:"domain",text:"Domain name to use for api",default:"api.vialocus.co.uk",config:"custom"},
	{name:"wsdomain",text:"Domain name to use for websocket",default:"ws.vialocus.co.uk",config:"custom"},
	{name:"distribution",text:"Cloudfront distribution to clear",default:"ABCD",config:"custom"},
	{name:"createRoute53Record",text:"Create S3 record",default:"false",config:"custom"}

];

function addConfig() {

	let index=0;
	let stage='dev';

	askQuextion();
	function askQuextion() {
		if(index<configQuestions.length) {
			if(configQuestions[index].details)
				console.log(configQuestions[index].details);
			readline.question(`${configQuestions[index].text} [${configQuestions[index].default}]?`, (cmd) => {
				if (cmd.length === 0)
					cmd = configQuestions[index].default;
				if (configQuestions[index].stage === true) {
					stage = cmd;
					configs['env'][stage] = {};
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
	fs.writeFileSync(envFile,YAML.stringify(configs.env) );
	fs.writeFileSync(customFile,YAML.stringify(configs.custom) );
	console.log('Config files written');
	commandLoop();

}

function listConfig() {
	for(let i in configs.env) {
		console.log(`[${i}]`);
	}
	commandLoop();

}