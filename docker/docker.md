# Overview

Locaria uses docker containers to run batch jobs primarily for the uploading and downloading of data.

These jobs run as containers within the Amazon Fargate infrastructure. The workflow for triggering a job is as follows:-

- a file is created in the files table
- the trigger files_trigger.sql is run based upon the file's states (currently REGISTERED or DOWNLOAD_REQUESTED)
- this trigger checks to see whether a Fargate process is required, if so it calls the function aws_lambda_interface.sql
- aws_lambda_interface retrieves the relevant parameters from parameters table including the arn of the function to call the Fargate process, this is usually ecsRunTask
- the Fargate task is run, it is responsible for updating the database post task

# Configuration

A docker container must have the following configuration information

## Directory

A directory in the /docker tree of the locaria codebase, eg: /docker/new_docker/

Note well that any shared modules should be copied into to the /docker/modules directory 

## Dockerfile

A Dockerfile in the root of the directory created, eg: /docker/new_docker/Dockerfile

## dockers.json

An entry in the file /docker/dockers.json which points to the directory created above. This is used by the configure.js script to identify and deploy docker containers to the AWS ECR docker store

```json
{
  "new_docker": {
    "description": "New docker container we are creating"
  }
}
```
## serverless.yml

This file creates the following resources:-

- ECS container for running all docker images
- an ECR container for each docker instance
- a set of secrets to be passed to the running docker containers as environment variables
- a set of roles for running the docker containers and logging
- a task definition for running the docker container
- a lambda function for running the tasks

# Deploying docker containers

Run the configure script npm run configure

Chose "e" then stage then the command "docker" and chose the relevant container






