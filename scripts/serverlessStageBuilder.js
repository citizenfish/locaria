const fs = require('fs');
const yaml =require('yaml');



const config = process.argv[2]||'../serverless/multi.json';
const stage = process.argv[3]||'multi';
const items = process.argv[4]||'all';
const theme = process.argv[5]||'main'

const {spawnSync} = require('child_process');

const configJson = require(config);

const main = () => {
	const buildDir=`${configJson.buildDir}/build`;
	const buildOutput=`${configJson.buildDir}/outputs/${stage}-outputs.json`;
	const buildOutputSite=`${configJson.buildDir}/outputs/${stage}-outputs-${theme}.json`;
	makeBuildDir(buildDir);
	resetOutputs([buildOutput,buildOutputSite]);
	let itemsArray=items.split(",");

	for(let n in configJson.nodes) {
		if(itemsArray.indexOf(configJson.nodes[n].dir)!==-1||itemsArray[0]==='all') {
			console.log(`building ${configJson.nodes[n].dir}`);
			let copyFiles=["serverless.yml","package.json"];
			if(configJson.nodes[n].functions)
				copyFiles=[...copyFiles,...configJson.nodes[n].functions];

			for (let f in copyFiles) {
				const sourceFile = `${configJson.buildDir}/${configJson.nodes[n].dir}/${copyFiles[f]}`;
				const destFile = `${buildDir}/${copyFiles[f]}`;
				console.log(`Copying ${sourceFile}`);
				fs.copyFileSync(sourceFile, destFile);
				if (copyFiles[f] === 'serverless.yml') {
					console.log(`Updating ${sourceFile}`);
					updateYaml(destFile, configJson.nodes[n].outputs,configJson.nodes[n].outputsSitePrefix);
				}
			}
			npmInstall(buildDir);
			deployNode(buildDir);
			if(configJson.nodes[n].outputsSitePrefix)
				mergeOutputs(buildOutputSite, buildDir);
			else
				mergeOutputs(buildOutput, buildDir);
		} else {
			console.log(`skipping ${configJson.nodes[n].dir}`);
		}
	}

}

const resetOutputs = (files,kill=false) => {
	for(let f in files) {
		if (fs.existsSync(files[f]) !== true || kill === true) {
			console.log(`Resetting outputs file ${files[f]}`);
			const fileData = {"VERSION": "0.1"};
			fs.writeFileSync(files[f], JSON.stringify(fileData));
		}
	}
}

const mergeOutputs = (file,dir) => {
	const nodeFile=`${dir}/node.json`;
	let fileDataNew = JSON.parse(fs.readFileSync(nodeFile, 'utf8'));
	let fileDataOld = JSON.parse(fs.readFileSync(file, 'utf8'));
	let newData={...fileDataNew,...fileDataOld};
	fs.writeFileSync(file,JSON.stringify(newData));
}

const deployNode = (dir) => {
	console.log('Deploying serverless');
	let options = {
		cwd: dir,
		shell: true,
		stdio: 'pipe',
		env:{
			SLS_INTERACTIVE_SETUP_ENABLE:1,
			theme:theme
		}
	};
	let result=spawnSync('serverless', ['deploy','--stage',stage],options);
	console.log(result.stdout.toString());
}

const npmInstall = (dir) => {

	console.log('Installing npm modules');
	let options = {
		cwd: dir,
		shell: true,
		stdio: 'pipe'
	};

	let result=spawnSync('npm ', ['install'],options);
	//console.log(result.stdout.toString());
}

const updateYaml = (file,outputs,prefix=false) => {

	const customTags=["!Ref","!GetAtt"];


	let fileData = fs.readFileSync(file, 'utf8')


	for(let t in customTags) {
		const regExp=new RegExp(`${customTags[t]} (.*)`, "g");
		let matches=fileData.match(regExp);
		for(let m in matches) {
			fileData=fileData.replace(matches[m],`"${matches[m]}"`);
		}
	}
	let yamlParse=yaml.parse(fileData,{version:"1.1"});

	// Add our output configs
	if(!yamlParse.custom) {
		yamlParse.custom={};
	}
	yamlParse.custom.output={
		file: "node.json"
	}
	if(!yamlParse.resources) {
		yamlParse.resources={};
	}
	if(!yamlParse.resources.Outputs) {
		yamlParse.resources.Outputs={};
	}

	for(let o in outputs) {
		let outputName=o;
		yamlParse.resources.Outputs[outputName]={Value:outputs[o]};
	}


    let yamlString=yaml.stringify(yamlParse,{version:"1.1"});

	for(let t in customTags) {
		const regExp=new RegExp(`\"${customTags[t]} (.*)\"`, "g");
		let matches=yamlString.match(regExp);
		for(let m in matches) {
			yamlString=yamlString.replace(matches[m],`${matches[m].replace(/\"/g,'')}`);
		}
	}


	fs.writeFileSync(file,yamlString);
	//console.log(yamlString);

}

const makeBuildDir = (dir) => {
	if (!fs.existsSync(dir)) {
		console.log(`creating new build dir [${dir}]`);
		fs.mkdirSync(dir);
	}
	cleanBuildDir(dir);
}

const cleanBuildDir = (dir) => {
	const dirFile=`${dir}/serverless.yml`;
	if (fs.existsSync(dirFile)) {
		console.log(`Cleaning up [${dirFile}]`);
		fs.unlinkSync(dirFile);
	}
}

if(configJson.buildDir) {
	main()
} else {
	console.log(`${config} does not contain buildDir`);
}





