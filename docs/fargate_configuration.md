# Overview

Fargate process to be as follows:-

1) file record created in database
2) database triggers fargate to load the "data_loader" task
3) data_loader task fires up python script
   1) poll database for all files of status REGISTERED
   2) process each file
   3) continue until there are no files of status REGISTERED
   4) exit
4) 

https://www.serverless.com/blog/serverless-application-for-long-running-process-fargate-lambda/
