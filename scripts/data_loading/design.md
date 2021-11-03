# Overview

The locus data loading process is based upon the use of docker containers to manage the loading and configuration of all data. This allows for a variety of technologies to be used when loading data. This gives us more flexibility as we can use tools such as the gdal suite or unix command lines to facilitate upload.

The architecture works as follows:-

- serverless configuration to register docker containers with Fargate and set up ECS containers
- database configuration to hold details of available loaders (docker instances)
- a websockets API to instantiate Fargate load processes
- a database API to monitor progress of load processes
- a standard method for docker containers to:-
  - receive load commands
  - report data load process
  - listen on ports for commands (if staying active)

# websockets API

The websockets api will provide the following set of methods:-

## get_containers

This will provide a list of available data load containers along with their capabilities and required parameters.

### request
```json
{
  "method" : "get_containers"
}
```

### response

```json
[
  {
    "name" :  "load_os_opendata",
    "description" : "Load Ordnance Survey Open Data",
    "type" : "loader|listener",
    "port" : 1234,
    "parameters" : {
      "data_set" : ["OpenNames", "BoundaryLine", "OpenUPRN", "OpenUSRN"],
      "category" : "",
      "tags" : [],
      "preSQL" : "pre_load.sql",
      "postSQL" : "post_load.sql",
      "credentials" : {}
    }
  }
]
```

#### name

This is the name of the container to be run and will be used by the **instantiate_container** command.

#### description

A description to be displayed to the user

#### type

- loader - a container that will run, load the data and then exit on load or error
- listener - a container that will run and then listen on a specified port for a command

#### port

The port that the container will be available from if it is a **listener**

#### parameters

A structure containing the parameters and options that must be passed to the **instantiate_container** command 

## instantiate_container

This command runs a container passing in the required command file

### request

```json

{
  "method" : "instantiate_container",
  "parameters" : {
    ...
  },
  "debug" : true
}
```

#### parameters

A container specific set of parameters that should match the parameter set returned by **get_containers**

#### debug

A boolean stating whether to log and return verbose debug messages
### response

```json
{
  "container_id" : 12345,
  "user_message" : "Foo baa"
}
```

#### container_id

A unique id to be used when calling **get_container_status**

#### user_message

A text message that can be displayed to the user on response

## get_container_status

This command returns the status of a container that has been previously instantiated.

### request

The request is given the container_id of a container that has previously been **instantiated** with **instantiate_container**
```json
{
  "method" : "get_container_status",
  "container_id" : 12345
}
```

### response

```json
{
  "code" : 200,
  "message" : "Text message",
  "attributes" : {
    "log_messages" : [
      {
        "date" : "DD-MM-YYYY HH:MM:SS",
        "log" : "This is the log message"
      }
    ],
    "last_error" : "Last error message",
    "progress" : "20%"
  },
  "last_update" : "DD-MM-YYYY HH:MM:SS"
}
```

#### code

A status code from the following list:-

- **300** container is being instantiated
- **301** [loader] container has run successfully and exited
- **302** [listener] container has run successfully and is listening on configured port
- **303** [loader] container has run successfully and is executing a command
- **304** container has run with errors and exited
- **399** container status has 

#### message 

A text message to display to user

#### attributes

A json structure with additional data items that relate to the status (for example errors or diagnostics). The following **may** be returned:-

- **log_messages** an array of log message structures in date order
- **last_error** the last error message (if any)
- **progress** a progress indicator 