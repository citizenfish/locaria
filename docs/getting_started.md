# LOCUS Technical Overview

LOCUS is a search and retrieval system targeted at local authority neighbourhood portal applications. It is based around a set of APIs that connect to a relational database. These APIs allow users to search and filter data across a wide range of data sets and formats.

LOCUS is designed to be low maintenance and highly scalable. This is achieved by using "microservices" operating within the Amazon Web Services environment. These microservices are tiny snippets of code that receive search requests from the internet and process them against a database.

Amazon refer to these microservices as Lambda functions. Lambda functions are written in the NodeJS language which is a superset of Javascript. LOCUS uses Lambda functions to connect to a database and carry out searches.

Searches are actioned using the SQL language within the database. LOCUS implements all search logic in the database using the PL/PGSQL language which is very similar to SQL. This allows us to separate search logic from api handling code making LOCUS easy to change and maintain.



# Installing Locus

In order to install LOCUS you will need a degree of familiarity with the Amazon Web Services (AWS) environment. We recommend gaining familiarity with the guides at https://aws.amazon.com/getting-started/.

In particular it is important to understand the principles of how AWS manages security and credentials (IAM).

LOCUS comes with an installer that will guide you through the process.

## Pre-requisites

In order to install Locus you will need the following components:-

- a PostgreSQL database service running postgres version 9.6 or higher (we recommend 11)
- an Amazon AWS account
- super user credentials for the PostgreSQL database
- Amazon IAM credentials [[link](https://docs.aws.amazon.com/iam/index.html)]
- Git and Nodejs installed locally
- AWS cli installed and configured [[link](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)]

## Step 1 - install locally

Download locus code and SQL with:-

```sqlite-psql
git clone https://github.com/nautoguide/locus.git
```

Change to the locus directory and install all nodejs modules

```bash
cd locus
npm install
```



## Step 2 - AWS Setup

Locus needs access to your AWS account using the AWS cli. For this to work you need an IAM account that has privileges to the following
services:

- S3: Full access
- API Gateway: Full access
- Lambda: Full access
- Cloudformation: Full access

To do this go to the IAM console, select the user and then add permissions using pre exiting policies. Then search for the above
listed policies and add them to the user.

Once created you will need to create an API key for this account which includes a key and a secret key. Note these down. Now install
aws cli found here:

https://aws.amazon.com/cli/

Once installed run:

```jshelllanguage
aws configure --profile locus
```

It will ask for both keys and also a default region, this will be the region you wish you services to be installed in.

We will also need details of your VPC setup, specifically the 2 private subnets you wish to launch your lambda code into.

If you are unsure of the AWS VPC you can read more details here: https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html

If you have never setup a VPC before or are running on the default setup it is insecure and we suggest using this example layout:

https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html

This layout of 2 private subnets is required for locus. Lambda should never be deployed in a public subnet and it will not have access to the internet
in that configuration.

The subnets will need access to your postgres server or RDS server and also access to the internet via NAT gateway. Follow this guide to setup NAT on those private subnets you created earlier.

https://aws.amazon.com/premiumsupport/knowledge-center/internet-access-lambda-function/

Once done note down the subnet id's

You will also need a security group for your lambda, this will normally contain rules that allow access to your postgres instance and the NAT gateway.

For more information on security groups see this: https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html  

## Step 3 - Setup & Deploy

Firstly make sure you have the following information for your system

- Postgress
    - username
    - password
    - host
    - port
    - database name
- AWS
    - API Key
    - API Secret Key
    - 2 VPC subnets id's
    - Security group
    - Domain name for the API
    
Now run:

```jshelllanguage
npm run configure
```    

You will be presented with a cli and you need to add a new deployment stage. A STAGE is essentially a unique deployment that is deployed in one
or more AWS accounts. IE you can install two stages in a single AWS account that can be configured to talk to one or more postgres instances.

We suggest using at least two stages, Test and Live.

To configure a stage in the cli select 'a'

You will be asked various questions that require entry of all the above information. When asked for a stage name enter 'test' or
 your chosen target. The postgres details take the format:

pg://USERNAME:PASSWORD@HOST:PORT/DATABASE

Once compete hit 'w' to save these details. This will write out two files in the directory below the repo:

**locus-env.yml**

```yaml

test:
  postgres: pg://USERNAME:PASSWORD@HOST:PORT/DATABASE
```

**locus-custom.yml**

```yaml
test:
  securityGroupIds: foo
  subnet1: bar
  subnet2: foo
  profile: bar
```

These file can contain multiple connection strings to allow you to set up development,test and live instances of the databases. As shown above with local and development versions

We highly recommend that you take this approach if you are planning on making your own changes to locus.

We strongly advise that you keep these files outside of the git directory structure in order to ensure that it cannot accidently be shared outside of your organisation or checked into a public repository.

You can now use the deploy option from the cli 'e'.

It will ask which stage you wish to deploy then present some options for deploying components

- api - Install te gateway/lambda API
- sql - Run the sql required to create the schemas and functions
- scrape - Install the web scaper in lambda/cloudwatch
- web - Install the web frontend



