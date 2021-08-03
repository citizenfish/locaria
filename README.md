# LOCUS Technical Overview

LOCUS is a search and retrieval system targeted at local authority neighbourhood portal applications. It is based around a set of APIs that connect to a relational database. These APIs allow users to search and filter data across a wide range of data sets and formats.

LOCUS is designed to be low maintenance and highly scalable. This is achieved by using "microservices" operating within the Amazon Web Services environment. These microservices are tiny snippets of code that receive search requests from the internet and process them against a database.

Amazon refer to these microservices as Lambda functions. Lambda functions are written in the NodeJS language which is a superset of Javascript. LOCUS uses Lambda functions to connect to a database and carry out searches.

Searches are actioned using the SQL language within the database. LOCUS implements all search logic in the database using the PL/PGSQL language which is very similar to SQL. This allows us to separate search logic from api handling code making LOCUS easy to change and maintain.

- [Getting Started](docs/getting_started.md)
  
- [How It Works](docs/how_it_works.md)
  
- [How To](docs/how_to.md)

