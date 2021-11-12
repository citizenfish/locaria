# Overview

LOCUS data loaders are run for docker containers that are stored in the Amazon ECR container store. The process for setting up a container is as follows:-

- set up an ECR repository to hold Docker images
- set up an ECS cluster to run our Docker images
- create the Dockerfile and build locally ensuring that it uses the correct processor architecture
- tag the Dockerfile with the ECR 
- push Docker build up to ECR
- store any required credentials in AWS secrets
- create an iam role for the execution of FARGATE tasks
- attach an execution policy to this role giving access to required resources
  - Aurora
  - S3 storage
- create an ECS task definition for the container to be run
- create a cloudwatch log group for the task (optional)

Once setup the task can be run using the ecs run-task command. 

The following variable are required:-

- $AWSACCOUNT - the  id of the aws account
- $REGION - the aws region
- $SUBNET1 - a subnet linked to the VPC
- $SUBNET2 - a subnet linked to the VPC
- $SECURITYGROUP - a security group to give FARGATE access to the database and S3
- $DOCKERNAME - a name for the docker image (eg: os_opendata_loader)

The command set below assumes a local profile named "locus" has been configured.

It is worth noting that adding a new Docker image will require the following:-

- Docker build, tag and push process
- Addition of any extra secrets
- Task definition creation
- Cloudwatch log group creation

So these may be better run as a script rather than in yaml config

## Creating the ECR Repository

```shell
aws ecr create-repository --repository-name locus_data_loaders --region $REGION --profile locus
```

Returns:-
```json
{
    "repository": {
        "repositoryArn": "arn:aws:ecr:eu-west-1:$AWSACCOUNT:repository/locus_data_loaders",
        "registryId": "$AWSACCOUNT",
        "repositoryName": "locus_data_loaders",
        "repositoryUri": "$AWSACCOUNT.dkr.ecr.eu-west-1.amazonaws.com/locus_data_loaders",
        "createdAt": "2021-11-05T10:18:05+00:00",
        "imageTagMutability": "MUTABLE",
        "imageScanningConfiguration": {
            "scanOnPush": false
        },
        "encryptionConfiguration": {
            "encryptionType": "AES256"
        }
    }
}
```

The repositoryUri should be stored in the variable $REPOSITORYURI

## Creating the ECS Cluster

```shell
aws ecs create-cluster --profile locus --cluster-name "$DOCKERNAME_cluster" --region $REGION
```

## Building the docker image locally

```shell
docker buildx build --platform=linux/amd64 -f <DOCKERFILE> -t $DOCKERNAME:latest .
```

## Tagging the docker image

```shell
docker tag $DOCKERNAME:latest $REPOSITORYURI
```

## Pushing docker image to ECR

```shell
#login to ecr
aws ecr get-login-password --profile locus --region $REGION | docker login --username AWS --password-stdin $REPOSITORYURI
#push docker image
docker push $REPOSITORYURI
```

## Store secrets 

In the example below we store the database connection string using the name DBCONNECTION when Fargate is actioned this will be passed securely as an environment variable
```shell
aws secretsmanager create-secret --region $REGION --name DBCONNECTION --description 'Secret description' --secret-string '$DB_CONNECTION_STRING' --profile locus
```

The command will return an ARN for the secret which should be stored in $SECRETSRESOURCEARN and used in the execution role definition

## Create iam fargate roles

See example in scripts/data_loading/ecs-task-role-trust-policy.json

```shell
aws iam create-role --profile locus --region $REGION --role-name $DOCKERNAME-task-execution-role --assume-role-policy-document file://ecs-task-role-trust-policy.json
```
See example in scripts/data_loading/testloadder-iam-policy-task-execution-role.json

```shell
aws iam put-role-policy --profile locus --region eu-west-1 --role-name $DOCKERNAME-task-execution-role --policy-name $DOCKERNAME-iam-policy-task-execution-role --policy-document file://$DOCKERNAME-iam-policy-task-execution-role.json
```

## Register task

See example task definition in scripts/data_loading/testloader-task.json

```shell
aws ecs register-task-definition --profile locus --region $REGION --cli-input-json file://$DOCKERNAME-task.json
```


## Create cloudwatch logs

```shell
aws logs create-log-group --profile locus --log-group-name testloader --region eu-west-1
```

## Run the task

aws ecs run-task --profile locus --region $REGION \
--cluster "$DOCKERNAME_cluster" \
--launch-type FARGATE \
--network-configuration "awsvpcConfiguration={subnets=["$SUBNET1","$SUBNET2"],securityGroups=["$SECURITYGROUP"],assignPublicIp=ENABLED}" \
--task-definition $DOCKERNAME
 