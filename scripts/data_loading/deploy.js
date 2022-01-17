/**
 * deploy.js - deploy file_loader Docker into AWS Fargate environment
 */
const fs = require('fs')
const exec = require('child_process').exec;

//Load config file
const configs = JSON.parse(fs.readFileSync('../../../locaria.json', 'utf8')).new


///*** Command Lines ***/
const docker_version = 'docker --version'
const docker_build = 'docker buildx build --platform=linux/amd64 -t locaria_data_loader:latest ./file_loader'
const ecr_login = `aws ecr get-login-password --region ${configs.region} | docker login --username AWS --password-stdin ${configs.ecrRepoURI}`
const docker_tag_cmd = `cd ./file_loader; docker tag locaria_data_loader:latest ${configs.ecrRepoURI}`
const push_to_ecr_cmd = `cd ./file_loader; docker push ${configs.ecrRepoURI}`

// Check Docker is present

exec(docker_version, (err, stdout, stderr) => {
   if(stdout.match(/^Docker version/) === null) {
       console.error('Docker is required to install the file loader');
       process.exit()
   }

   console.log(`${stdout}Proceeding with install`);
   build_docker_image()
});

const build_docker_image = () => {
    console.log("Building docker image")
    exec(docker_build, (err, stdout,stderr) => {
        if(err){
            console.error("Docker build has failed")
            console.error(err)
            process.exit()
        }

        console.log(`${stderr}Proceeding with docker tag`)
        docker_tag()

    })
}

const docker_tag = () => {
    console.log("Tagging docker image")
    exec(docker_tag_cmd, (err,stdout,stderr) => {
        if(err){
            console.error("Docker tag Failed")
            console.error(err)
            process.exit()
        }
        console.log(`${stdout}Proceeding with push to ECR`)
        push_to_ecr()
    })
}


const push_to_ecr = () => {
    console.log("Pushing to ECR")
    exec(`${ecr_login};${push_to_ecr_cmd}`, (err,stdout,stderr) => {
        if(err){
            console.error("Push to ECR Failed")
            console.error(err)
            process.exit()
        }

        console.log(`${stdout}Proceeding with upload secrets`)
        set_secretmanager()
    })
}

const set_secretmanager = () => {
    console.log("Setting DB login secret")

}
