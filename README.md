# LOCARIA Technical Overview

LOCARIA is a search and retrieval system. It is based around a set of APIs that connect to a relational database. These APIs allow users to search and filter data across a wide range of data sets and formats.

LOCARIA is designed to be low maintenance and highly scalable. This is achieved by using "microservices" operating within the Amazon Web Services environment. These microservices are tiny snippets of code that receive search requests from the internet and process them against a database.

Amazon refer to these microservices as Lambda functions. Lambda functions are written in the NodeJS language which is a superset of Javascript. LOCARIA uses Lambda functions to connect to a database and carry out searches.

Searches are actioned using the SQL language within the database. LOCARIA implements all search logic in the database using the PL/PGSQL language which is very similar to SQL. This allows us to separate search logic from api handling code making LOCARIA easy to change and maintain.

8th December 2021
