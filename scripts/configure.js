/**
 * Config
 * @type {string}
 */

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

//For data downloads
const fetch = require('node-fetch');
const request = require('request');
const {S3Client, ListObjectsCommand, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");


//For decoding file contents as S3 api uses filestreams
const streamToString = (stream) =>
	new Promise((resolve, reject) => {
		const chunks = [];
		stream.on("data", (chunk) => chunks.push(chunk));
		stream.on("error", reject);
		stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
	});

//Unzip and process files
const yauzl = require('yauzl');
const { Client } = require('pg')
let copyFrom = require('pg-copy-streams').from

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
			if (fs.existsSync(customFile)) {
				console.log('Existing config found');
				configs.custom=YAML.parse(fs.readFileSync(customFile, 'utf8'));
				configNew=false;
				listConfig();
			} else {
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
				console.log('tests - Run Tests');
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
			case 'tests':
				runTests(stage);
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

function loadData(){

	let stage='test';
	readline.question(`Stage to deploy [test]?`, (cmd) => {

		if(cmd) {
			stage = cmd;
			//set the profile to be used by AWS commands

		}

		process.env["AWS_PROFILE"] = configs.custom[stage].profile;

		readline.question(`Data set to load [OpenNames]?`, (cmd) => {
			if(cmd === 'OpenNames' || cmd === ''){
				loadOSOpenData('OpenNames', stage);
			} else {
				console.log('Data set '+ cmd + ' not supported');
				commandLoop();
			}


		});
	});



}

function loadOSOpenData(product, stage){
	console.log("Loading OS " + product + ".. checking current version");
	let osDataHubProductURL = configs.custom[stage].osDataHubProductURL;

	if(!osDataHubProductURL){
		console.log("Missing osDataHubProductURL");
		commandLoop();
	}

	/* Use OS API to get product list, find product then get version and file url */

	 fetch(osDataHubProductURL)
		.then(res => res.json())
		.then(json => {

			for(var i in json) {
				if(json[i].id === product){
					let pURL = json[i].url;
					let pVer = json[i].version;

					//get the download url which means 3 calls to OS API
					console.log("Retrieving details for "+product+ " version " + pVer);

					fetch(pURL)
						.then(res => res.json())
						.then (json => {
							let dURL = json.downloadsUrl;
							fetch(dURL)
								.then(res => res.json())
								.then(json => {
									for(var i in json){
										if(json[i].format === 'CSV'){
											loadDataS3({version : pVer, url : json[i].url, product : product, size: json[i].size, stage: stage});
										}
									}
								})
						})


				}
			}
		});

}

async function loadDataS3(parameters){


	let makeDir = true;
	let version = '';
	const s3Client = new S3Client({ region: configs.custom[parameters.stage].region, signatureVersion: 'v4' });
	let command = new ListObjectsCommand({Bucket : configs.custom[parameters.stage].domain + "-data"})
	let response =  await s3Client.send(command);


	//Do we need to create the version file ?
	for(var i in response.Contents){
		if(response.Contents[i].Key === parameters.product +'/version.txt'){
			console.log("Folder Exists");
			makeDir = false;

			//get the version string
			command  = new GetObjectCommand({
				Bucket : configs.custom[parameters.stage].domain + "-data",
				Key: parameters.product + "/" + "version.txt"
			});

			response = await s3Client.send(command);
			const bodyContents = await streamToString(response.Body);
			version  = bodyContents.replace('[0-9\-]', '');
			console.log("Version ["+ version + "]");
		}
	}

	//Create the directory
	if(makeDir){
		console.log("Making new folder");
		command = new PutObjectCommand({
			Bucket : configs.custom[parameters.stage].domain + "-data",
			Key :  parameters.product + "/" + "version.txt",
			Body : parameters.version
		});

		response = await s3Client.send(command);

	}

	//If the versions differ we need to download the data and upload it
	if(version !== parameters.version) {

		console.log("Step 1 - downloading locally");
			const dest = configs.custom[parameters.stage].tmp + "/data.zip";
			const file = fs.createWriteStream(dest);
			parameters['dest'] = dest;

			request(parameters.url).pipe(file);
			file.on('finish', function() {
				file.close(processZip(parameters));
			})

	} else {
		console.log("Data in sync no need to upload to S3");
		commandLoop();

	}

}

function processZip(parameters){
	console.log("Step 2 - Processing downloaded data");

	const outFilePath = parameters.dest + '.csv';
	try {
		fs.unlinkSync(outFilePath);

	} catch (e) {
		console.log("No output file to delete");
	}

	yauzl.open(parameters.dest, {lazyEntries: true}, function(err, zipfile){
		if(err) {
			console.log(err.message);
			commandLoop();
		}


		zipfile.readEntry();
		zipfile.on('entry', function(entry){
			if(/csv/.test(entry.fileName)){
				console.log(entry.fileName);
				zipfile.openReadStream(entry, function(err, readStream){
					if(err){
						console.log(err.message);
						commandLoop();
					}
					readStream.on('end', function(){
						zipfile.readEntry();
					});

					//Read OS header into a separate file
					if(/Docs(.*)csv/.test(entry.fileName)){
						const outFile = fs.createWriteStream(outFilePath + ".header");
						readStream.pipe(outFile);
					} else {
						const outFile = fs.createWriteStream(outFilePath, {'flags': 'a'});
						readStream.pipe(outFile);
					}

				})
			} else {
				console.log("Ignoring " + entry.fileName);
				zipfile.readEntry();
			}

		}).on('end', function(){
			console.log("Step 3 - moving on to database load");
			//First we need to make our table create statement

			loadCSV(parameters,outFilePath)
		});
	});
}

async function loadCSV(parameters, outFilePath) {
	const headerFile = fs.createReadStream(outFilePath + ".header");
	let header = await streamToString(headerFile);
	//TODO move out of code
	let tableCreate = "CREATE TABLE IF NOT EXISTS locus_core.opennames_import(" +
						header.toLowerCase().split(',').map(function(value){
						return value + " TEXT"
						}).join(',')
						+")";


	const client = new Client({
		user: configs.custom[parameters.stage].auroraMasterUser,
		host: configs.custom[parameters.stage].auroraHost,
		database: configs.custom[parameters.stage].auroraDatabaseName,
		password: configs.custom[parameters.stage].auroraMasterPass,
		port: configs.custom[parameters.stage].auroraPort,
	});

	client.connect();

	client.query(tableCreate, function(err,res){

		if (err) {
			console.log(err.stack)
		} else {
			//Finally load the data
			console.log("Step 4 - Loading " + parameters.product + " this may take some time.")
			let stream = client.query(copyFrom('COPY locus_core.opennames_import FROM STDIN WITH CSV'));
			let fileStream = fs.createReadStream(outFilePath);
			fileStream.on('error',function(err){
				console.log(err.message);
			});
			stream.on('finish',function(){
				console.log("Step 5 - Loaded " + parameters.product + " cleaning up and creating views");

				//finally create the search view
				//TODO this should be in yaml or a config file
				const query = `DROP MATERIALIZED VIEW IF EXISTS locus_core.location_search_view;
							CREATE MATERIALIZED VIEW locus_core.location_search_view AS
							SELECT "﻿id" AS id,
							   ST_TRANSFORM(ST_GEOMFROMEWKT('SRID=27700;POINT('||geometry_x||' '||geometry_y||')'), 4326) AS wkb_geometry,
							  
							   name1 AS location,
							   local_type as location_type,
							   setweight(to_tsvector(COALESCE(name1,'')), 'A') ||
							   setweight(to_tsvector(COALESCE(name2,'')), 'B') ||
							   setweight(to_tsvector(COALESCE(populated_place,'')), 'C') ||
							  setweight(to_tsvector(COALESCE(district_borough,'')), 'D') AS tsv
							FROM   locus_core.opennames_import
							WHERE  local_type IN ('City','Town','Other Settlement','Village','Hamlet','Suburban Area','Named Road','Postcode');
							
							CREATE INDEX opennames_wkb_geometry_idx ON locus_core.location_search_view USING GIST(wkb_geometry);
							CREATE INDEX os_opennames_weighted_tsv  ON locus_core.location_search_view USING GIN(tsv);`;

				client.query(query, function(err, res){
					//clean up
					fs.unlinkSync(outFilePath);
					fs.unlinkSync(parameters.dest);
					console.log("View created");
					commandLoop();
				});

			});
			fileStream.pipe(stream);
		}
	});


}

 function runTests(stage) {
	const options={
	};
	const cmdLine=`grunt runTests --stage=${stage}`;
	console.log(`#${cmdLine}`);
	exec( cmdLine,options, (err, stdout, stderr) => {
		console.log(stdout);
		console.log(err);
		console.log(stderr);
		deploySystemMain(stage);
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
		cwd: "./"
	};
	const cmdLine=`grunt deploySite --profile=${configs['custom'][stage].profile} --stage=${stage} --distribution=${configs['custom'][stage].distribution} --bucket=${configs['custom'][stage].domain} --region=${configs['custom'][stage].region}`;
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
			delete configs.custom[stage];
			commandLoop();
	});
}

const configQuestions = [
	{details:"Give the deployment stage a name, EG dev|test|live. This is used to reference this profile in the future",name:"stage",text:"Stage name",default:"dev",config:"custom",stage:true},
	{details:"You need aws cli install and configured to access your account, enter the profile used here",name:"profile",text:"AWS profile to use",default:"default",config:"custom"},

	{name:"region",text:"AWS region",default:"eu-west-1",config:"custom"},
	{name:"cron",text:"Cron string to use for scraper",default:"cron(0/10 * ? * MON-FRI *)",config:"custom"},
	{name:"domain",text:"Domain name to use for website",default:"api.vialocus.co.uk",config:"custom"},
	{name:"restdomain",text:"Domain name to use for rest api",default:"api.vialocus.co.uk",config:"custom"},
	{name:"wsdomain",text:"Domain name to use for websocket",default:"ws.vialocus.co.uk",config:"custom"},
	{name:"certARN",text:"AWS cert ARN",default:"arn:aws:acm:us-east-1:xxxxxxxxxxxxxxxx",config:"custom"},
	{name:"auroraDatabaseName",text:"Aurora database name",default:"locus",config:"custom"},
	{name:"auroraMasterUser",text:"Aurora master user",default:"locus",config:"custom"},
	{name:"auroraMasterPass",text:"Aurora master password",default:"CHANGEME",config:"custom"},
	{name:"osDataHubProductURL", text:"OS Data Hub Product URL (Data Downloads)", default:"https://api.os.uk/downloads/v1/products", config:"custom"},
	{name:"tmp", text:"Temporary local storage for downloads", default:"/tmp", config:"custom"}
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
	fs.writeFileSync(customFile,YAML.stringify(configs.custom) );
	console.log('Config files written');
	commandLoop();

}

function listConfig() {
	for(let i in configs.custom) {
		console.log(`[${i}]`);
	}
	commandLoop();

}