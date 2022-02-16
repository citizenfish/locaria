const fs = require('fs');
const yaml =require('yaml');



const config = process.argv[2]||'../serverless/multi.json';
const stage = process.argv[3]||'multi';

const {spawnSync} = require('child_process');

const configJson = require(config);

const main = () => {
	const buildDir=`${configJson.buildDir}/build`;
	const copyFiles=["serverless.yml","package.json"];
	makeBuildDir(buildDir);
	for(let n in configJson.nodes) {

		for(let f in copyFiles) {
			const sourceFile=`${configJson.buildDir}/${configJson.nodes[n].dir}/${copyFiles[f]}`;
			const destFile=`${buildDir}/${copyFiles[f]}`;
			console.log(`Copying ${sourceFile}`);
			fs.copyFileSync(sourceFile,destFile);
			if(copyFiles[f]==='serverless.yml') {
				console.log(`Updating ${sourceFile}`);
				updateYaml(destFile,configJson.nodes[n].outputs);
			}
		}
		npmInstall(buildDir);
		deployNode(buildDir);
	}

}

const deployNode = (dir) => {
	console.log('Deploying serverless');
	let options = {
		cwd: dir,
		shell: true,
		stdio: 'pipe',
		env:{
			SLS_INTERACTIVE_SETUP_ENABLE:1
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

const updateYaml = (file,outputs) => {

	const customTags=["!Ref","!GetAtt"];

	let fileData = fs.readFileSync(file, 'utf8')


	for(let t in customTags) {
		const regExp=new RegExp(`${customTags[t]} (.*)`, "g");
		let matches=fileData.match(regExp);
		for(let m in matches) {
			fileData=fileData.replace(matches[m],`"${matches[m]}"`);
		}
	}
	let yamlParse=yaml.parse(fileData);

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
		yamlParse.resources.Outputs[o]={Value:outputs[o]};
	}


    let yamlString=yaml.stringify(yamlParse);

	for(let t in customTags) {
		const regExp=new RegExp(`\"${customTags[t]} (.*)\"`, "g");
		let matches=yamlString.match(regExp);
		for(let m in matches) {
			yamlString=yamlString.replace(matches[m],`${matches[m].replace(/\"/g,'')}`);
		}
	}
	fs.writeFileSync(file,yamlString);

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





