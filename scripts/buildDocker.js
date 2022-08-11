/**
 * Config
 * @type {string}
 */

const buildDir = './docker/builds';

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
const environment = process.argv[4]||'dev';
const docker= process.argv[5]||'file_loader';

console.log(`Building docker ${docker} for stage ${stage} theme ${theme}`);
//console.log(configs);
if (configs[stage].themes[theme]) {
    config = configs[stage];

    let outputsFileName=`serverless/outputs/${stage}-outputs.json`;
    if(!fs.existsSync(outputsFileName)) {
        console.log(`${outputsFileName} does not exist, have you deployed?`);
        process.exit(0);
    }
    outputs=fs.readFileSync(outputsFileName, 'utf8');

    let outputsSiteFileName=`serverless/outputs/${stage}-outputs-${theme}-${environment}.json`;
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
    console.log(`No such config ${stage} ${theme} ${environment}`);
}

function doCopy() {
    const srcPath = './docker/' + docker;
    const modPath = './docker/modules';

    console.log(`cp ${srcPath} -> ${buildDir}`);
    fsExtra.copy(srcPath, buildDir, function (err) {
        if (err) {
            console.log('Copy failed!');
            console.log(err);
        } else {

            const resource = {
                db_var: "LOCARIADB",
                theme: theme,
                stage: stage,
                environment: environment,
                s3_var: "S3DLBUCKET",
                logBucket: `locarialogs-${stage}-${theme}${environment}`
            }
            fs.writeFileSync(`${buildDir}/config.json`, JSON.stringify(resource));

            //Copy in any system python modules
            fsExtra.copy(modPath,buildDir, function(err){
                if (err) {
                    console.log('Modules Copy failed!');
                    console.log(err);
                } else {

                    const cmdLine = `docker buildx build --platform=linux/amd64 -f Dockerfile -t ${docker}:latest .`;
                    exec(cmdLine, {cwd:buildDir}, (err, stdout, stderr) => {
                        console.log(err);
                        console.log(stdout);
                        console.log(stderr);

                    })
                }
            })

        }
    });
}