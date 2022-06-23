/**
 * deploy.js - deploy file_loader Docker into AWS Fargate environment
 */
const fs = require('fs')
const exec = require('child_process').exec;

//Load config file
const configs = JSON.parse(fs.readFileSync('../../../locaria.json', 'utf8')).new

//Fargate name
const fargate_name = 'locaria_data_loader'

//TODO these need to come from config
const subnet1 = 'subnet-0ab069af0c7b5336b'
const subnet2 = 'subnet-0e5bf400ddf246221'
const security_group = 'sg-09134d09f081a7b1d'

///*** Command Lines ***/
const docker_version = 'docker --version'
const docker_build = `docker buildx build --platform=linux/amd64 -t ${fargate_name}:latest ./file_loader`
const ecr_login = `aws ecr get-login-password --region ${configs.region} | docker login --username AWS --password-stdin ${configs.ecrRepoURI}`
const docker_tag_cmd = `cd ./file_loader; docker tag ${fargate_name}:latest ${configs.ecrRepoURI}`
const push_to_ecr_cmd = `cd ./file_loader; docker push ${configs.ecrRepoURI}`
const dbconnection = configs.postgresConnection.replace('pg://', 'pq://')
//TODO all of these converted to config
const create_db_secret = `aws secretsmanager create-secret --region ${configs.region} --name LOCARIADB --description 'Postgres credentials' --secret-string '${dbconnection}'`
const update_db_secret = `aws secretsmanager update-secret --region ${configs.region} --name LOCARIADB --description 'Postgres credentials' --secret-string '${dbconnection}'`

const create_ecs_task_role_cmd = `cd ./file_loader; aws iam create-role --profile locus --region ${configs.region} --role-name ${fargate_name}-task-role --assume-role-policy-document file://ecs-task-execution-role-trust-policy.json`
const create_put_role_policy_cmd = `cd ./file_loader; aws iam put-role-policy --region ${configs.region} --role-name ${fargate_name}-task-role --policy-name ${fargate_name}-iam-policy-task-role --policy-document file://ecs-iam-policy-task-role.json`

const create_ecs_task_execution_role_cmd = `cd ./file_loader; aws iam create-role --profile locus --region ${configs.region} --role-name ${fargate_name}-task-execution-role --assume-role-policy-document file://ecs-task-execution-role-trust-policy.json`
const create_put_execution_role_policy_cmd = `cd ./file_loader; aws iam put-role-policy --region ${configs.region} --role-name ${fargate_name}-task-execution-role --policy-name ${fargate_name}-iam-policy-task-execution-role --policy-document file://ecs-iam-policy-task-execution-role.json`
const register_task_cmd = `cd ./file_loader; aws ecs register-task-definition --region ${configs.region} --cli-input-json file://register-task.json`
const create_log_group_cmd = `aws logs create-log-group --log-group-name ${fargate_name} --region ${configs.region}`
const aws_run_task_cmd = `aws ecs run-task --region ${configs.region} --cluster "locaria-cluster" --launch-type FARGATE --network-configuration "awsvpcConfiguration={subnets=["${subnet1}","${subnet2}"],securityGroups=["${security_group}"],assignPublicIp=ENABLED}" --task-definition ${fargate_name}`
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
        //set_secretmanager()
        console.log("Stuff that ... running task")
        aws_run_task()
    })
}

const set_secretmanager = () => {
    console.log("This needs to be done in cloud formation templates/serverless - Over to Richard")
    create_ecs_task_role()
}

const create_ecs_task_role = () => {
    console.log("CONVERT to serverless - Create ecs task  role")
    exec(create_ecs_task_role_cmd, (err,stdout,stderr) => {
        if(err){
            console.error("Create ecs task role Failed")
            console.error(err)
            process.exit()
        }
        console.log(`${stdout}Proceeding with put role policy`)
        //create_put_role_policy()
    })

}

const create_put_role_policy = () => {
    console.log("CONVERT to serverless - Create put role policy")
    exec(create_put_role_policy_cmd, (err,stdout,stderr) => {
    if(err){
        console.error("Create put role policy Failed")
        console.error(err)
        process.exit()
    }
    console.log(`${stdout}Create ecs task execution role`)
    //create_put_role_policy()
})
}

const create_ecs_task_execution_role = () => {
    console.log("CONVERT to serverless - Create ecs task execution role")
    exec(create_ecs_task_execution_role_cmd, (err,stdout,stderr) => {
        if(err){
            console.error("Create ecs task execution role Failed")
            console.error(err)
            process.exit()
        }
        console.log(`${stdout}Proceeding with put execution role policy`)
        create_put_execution_role_policy()
    })
}

const create_put_execution_role_policy = () => {
    //This has to be converted to serverless as secrets ARN currently hard coded in file
    console.log("CONVERT to serverless - Create put execution role policy")
    exec(create_put_execution_role_policy_cmd, (err,stdout,stderr) => {
        if(err){
            console.error("Create put role policy Failed")
            console.error(err)
            process.exit()
        }
        console.log(`${stdout}Proceeding with task defintion`)
        register_task()
    })
}

const register_task = () => {
    console.log("CONVERT to serverless - Register Task")
    exec(register_task_cmd, (err,stdout,stderr) => {
        if(err){
            console.error("Register Task")
            console.error(err)
            process.exit()
        }
        console.log(`${stdout}Proceeding with cloudwatch logs`)

    })
}

const create_log_group = () => {
    console.log("CONVERT to serverless - Create Log Groups")
    exec(create_log_group_cmd, (err,stdout,stderr) => {
        if(err){
            console.error("Create Log Groups")
            console.error(err)
            process.exit()
        }
        console.log(`${stdout}All done`)

    })
}

const aws_run_task = () => {
    console.log("Running AWS TASK")
    exec(aws_run_task_cmd, (err,stdout,stderr) => {
        if(err){
            console.error("AWS Run task error")
            console.error(err)
            process.exit()
        }
        console.log(`${stdout}All done`)

    })
}