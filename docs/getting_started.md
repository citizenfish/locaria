



# Installing Locus

In order to install LOCUS you will need a degree of familiarity with the Amazon Web Services (AWS) environment. We recommend gaining familiarity with the guides at https://aws.amazon.com/getting-started/.

In particular it is important to understand the principles of how AWS manages security and credentials (IAM).

LOCUS comes with an installer that will guide you through the process.

## Pre-requisites

In order to install Locus you will need the following components:-

- an Amazon AWS account
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
- RDS: Full access

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

You will also need to create a certificate for subdomains you wish to use in the following regions:

domain: us-east-1
restdomain: us-east-1
wsdomain: (region your stack is deployed in)

Get the certificates validated, then you will need the arn for
the next step.

## Step 3 - Access infrastructure via VPN

There steps are site specific but we use:

https://docs.aws.amazon.com/vpn/latest/clientvpn-admin/cvpn-getting-started.html

We have added to the config security rules for a VPN CIDR of: 10.1.0.0/22

If you are following the guide then use the above as your CIDR for the VPN and then
associate with the VPC that contains our created 10.0.0.0/16 CIDR.

## Step 4 - Setup & Deploy

Firstly make sure you have the following information for your system


- API Key
- API Secret Key
- Domain name for the API & Website
- Certificate arn
    
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

Once compete hit 'w' to save these details. This will write out a file in the directory below the repo:

**locus-custom.yml**

```yaml
test:
 profile: locus
 region: eu-west-1
 cron: cron(0/10 * ? * MON-FRI *)
 .......
```

This file can contain multiple connection strings to allow you to set up development,test and live instances of the databases. As shown above with local and development versions

We highly recommend that you take this approach if you are planning on making your own changes to locus.

We strongly advise that you keep these files outside of the git directory structure in order to ensure that it cannot accidentally be shared outside of your organisation or checked into a public repository.

You can now use the deploy option from the cli 'e'.

It will ask which stage you wish to deploy then present some options for deploying components

- api - Install all the infrastructure into AWS
- sql - Run the sql required to create the schemas and functions
- scrape - Install the web scaper in lambda/cloudwatch
- web - Install the web frontend



